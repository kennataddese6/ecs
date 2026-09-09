"use client";

import * as React from "react";
import {
  UploadCloud,
  X,
  Video,
  Play,
  AlertCircle,
  FileVideo,
  CheckCircle2,
  Paperclip,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoUploadInputProps {
  fileInputName?: string;
  existingVideoUrl?: string | null;
  label?: string;
}

const ALLOWED_EXTENSIONS = ["mp4", "webm", "ogg", "mov", "m4v"];
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

function isValidVideoFormat(file: File): boolean {
  if (!file) return false;
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  const isTypeValid = file.type ? file.type.startsWith("video/") : false;
  return isTypeValid || ALLOWED_EXTENSIONS.includes(ext);
}

export function VideoUploadInput({
  fileInputName = "videoFile",
  existingVideoUrl = "",
  label = "Product Showcase Video (Optional)",
}: VideoUploadInputProps) {
  const [previewUrl, setPreviewUrl] = React.useState<string>(existingVideoUrl || "");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [fileInfo, setFileInfo] = React.useState<{ name: string; sizeMb: string } | null>(null);
  const [isRemoved, setIsRemoved] = React.useState<boolean>(false);
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (existingVideoUrl) {
      setPreviewUrl(existingVideoUrl);
    }
  }, [existingVideoUrl]);

  const processFile = (file: File) => {
    setErrorMsg(null);
    setIsRemoved(false);

    if (!isValidVideoFormat(file)) {
      setErrorMsg(
        `Invalid file type "${file.name}". Please attach an MP4, WebM, OGG, or MOV video.`
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMsg(
        `File size exceeds 50MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please attach a compressed video.`
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setFileInfo({
      name: file.name,
      sizeMb: (file.size / (1024 * 1024)).toFixed(1),
    });

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Assign to input element if possible
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
      processFile(file);
    }
  };

  const handleRemove = () => {
    setPreviewUrl("");
    setFileInfo(null);
    setErrorMsg(null);
    setIsRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenPicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3 p-4 rounded-xl bg-card border border-border/80 shadow-xs">
      {/* Hidden inputs to manage video state across updates */}
      <input type="hidden" name="existingVideoUrl" value={existingVideoUrl || ""} />
      {isRemoved && <input type="hidden" name="removeVideo" value="true" />}

      {/* Actual file input for form submission */}
      <input
        ref={fileInputRef}
        type="file"
        name={fileInputName}
        accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-m4v"
        onChange={handleFileChange}
        className="hidden"
        id="product-video-file-upload"
      />

      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold flex items-center space-x-2">
          <Video className="h-4 w-4 text-primary" />
          <span>{label}</span>
        </label>
        {previewUrl && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Video Attached</span>
          </span>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Attach a video from your computer or phone. It will be uploaded to storage and featured as
        the final slide in the product gallery.
      </p>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center space-x-2 animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!previewUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleOpenPicker}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all text-center group ${
            isDragging
              ? "border-primary bg-primary/10 scale-[1.01]"
              : "border-border/80 hover:border-primary/60 bg-muted/20 hover:bg-muted/40"
          }`}
        >
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-2">
            <Paperclip className="h-6 w-6" />
          </div>
          <p className="text-xs font-bold text-foreground">
            Click to attach video file (or drag & drop)
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            MP4, WebM, MOV, or OGG (Max 50MB)
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 pointer-events-none text-xs font-semibold"
          >
            <UploadCloud className="h-3.5 w-3.5 mr-1.5" />
            Choose Video File
          </Button>
        </div>
      ) : (
        /* Video Attached Preview Area */
        <div className="space-y-3 pt-1">
          <div className="relative rounded-xl overflow-hidden border border-border bg-black/95 aspect-video w-full flex items-center justify-center shadow-inner group">
            <video
              src={previewUrl}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain"
            />

            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 hover:bg-destructive text-white shadow-md transition-colors cursor-pointer z-10"
              title="Remove Video"
              aria-label="Remove Video"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-muted/40 border border-border text-xs">
            <div className="flex items-center space-x-2 truncate">
              <FileVideo className="h-4 w-4 text-primary shrink-0" />
              {fileInfo ? (
                <div className="truncate">
                  <span className="font-semibold text-foreground truncate">{fileInfo.name}</span>
                  <span className="text-muted-foreground ml-1.5">({fileInfo.sizeMb} MB)</span>
                </div>
              ) : (
                <div className="truncate">
                  <span className="font-semibold text-foreground">Current Product Video</span>
                  <span className="text-muted-foreground ml-1.5 truncate max-w-[200px]">
                    ({previewUrl.split("/").pop() || "Attached"})
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleOpenPicker}
                className="h-7 text-xs font-semibold"
              >
                <RefreshCw className="h-3 w-3 mr-1.5" />
                Change Video
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 font-semibold"
              >
                <X className="h-3 w-3 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
