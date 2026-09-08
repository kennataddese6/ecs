"use client";

import * as React from "react";
import {
  UploadCloud,
  X,
  Link as LinkIcon,
  Video,
  Play,
  AlertCircle,
  FileVideo,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VideoUploadInputProps {
  name?: string;
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
  name = "videoUrl",
  fileInputName = "videoFile",
  existingVideoUrl = "",
  label = "Product Video (Optional)",
}: VideoUploadInputProps) {
  const [previewUrl, setPreviewUrl] = React.useState<string>(existingVideoUrl || "");
  const [mode, setMode] = React.useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = React.useState<string>(existingVideoUrl || "");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [fileInfo, setFileInfo] = React.useState<{ name: string; sizeMb: string } | null>(null);
  const [isRemoved, setIsRemoved] = React.useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (existingVideoUrl) {
      setPreviewUrl(existingVideoUrl);
      setUrlInput(existingVideoUrl);
    }
  }, [existingVideoUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setIsRemoved(false);
    const file = e.target.files?.[0];
    if (file) {
      if (!isValidVideoFormat(file)) {
        setErrorMsg(
          `Invalid file type "${file.name}". Please upload an MP4, WebM, OGG, or MOV video file.`
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrorMsg(
          `File size exceeds 50MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please choose a compressed video file.`
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
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setIsRemoved(false);
    const val = e.target.value;
    setUrlInput(val);
    setPreviewUrl(val.trim());
    setFileInfo(null);
  };

  const handleClear = () => {
    setPreviewUrl("");
    setUrlInput("");
    setFileInfo(null);
    setErrorMsg(null);
    setIsRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-xl bg-card border border-border/80 shadow-xs">
      {/* Hidden inputs to manage video state across updates */}
      <input type="hidden" name="existingVideoUrl" value={existingVideoUrl || ""} />
      {isRemoved && <input type="hidden" name="removeVideo" value="true" />}

      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold flex items-center space-x-2">
          <Video className="h-4 w-4 text-primary" />
          <span>{label}</span>
        </label>
        <div className="flex items-center space-x-1 bg-muted p-0.5 rounded-lg border border-border text-xs">
          <button
            type="button"
            onClick={() => setMode("file")}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              mode === "file"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              mode === "url"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Video URL
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Showcase this product in action. The video will be displayed in the product gallery as the
        final slide after the product photos.
      </p>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center space-x-2 animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {mode === "file" ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            name={fileInputName}
            accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-m4v"
            onChange={handleFileChange}
            className="hidden"
            id="product-video-file-upload"
          />

          {!previewUrl ? (
            <label
              htmlFor="product-video-file-upload"
              className="border-2 border-dashed border-border/80 hover:border-primary/60 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors text-center group"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-2">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold text-foreground">
                Click to upload video or drag and drop
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                MP4, WebM, OGG or MOV (Max 50MB)
              </p>
            </label>
          ) : null}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <LinkIcon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              name={name}
              value={urlInput}
              onChange={handleUrlChange}
              placeholder="https://.../video.mp4"
              className="pl-9 text-xs"
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Direct link to an MP4 or WebM video file.
          </p>
        </div>
      )}

      {/* Video Preview Player */}
      {previewUrl && (
        <div className="space-y-2 pt-1">
          <div className="relative rounded-xl overflow-hidden border border-border bg-black/95 aspect-video w-full flex items-center justify-center shadow-inner">
            <video
              src={previewUrl}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain"
            />

            <button
              type="button"
              onClick={handleClear}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 hover:bg-destructive text-white shadow-md transition-colors cursor-pointer z-10"
              title="Remove Video"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <div className="flex items-center space-x-1.5 truncate">
              {fileInfo ? (
                <>
                  <FileVideo className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="font-medium text-foreground truncate max-w-[200px]">
                    {fileInfo.name}
                  </span>
                  <span>({fileInfo.sizeMb} MB)</span>
                  <span className="text-emerald-500 flex items-center space-x-0.5 ml-1">
                    <CheckCircle2 className="h-3 w-3 inline" />
                    <span>Ready</span>
                  </span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate max-w-[260px]">{previewUrl}</span>
                </>
              )}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
