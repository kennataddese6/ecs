"use client";

import * as React from "react";
import Image from "next/image";
import { UploadCloud, X, Link as LinkIcon, Image as ImageIcon, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageUploadInputProps {
  name?: string;
  fileInputName?: string;
  defaultValue?: string;
  label?: string;
}

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif", "gif", "svg"];

function isValidFormat(file: File): boolean {
  if (!file) return false;
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  const isTypeValid = file.type ? file.type.startsWith("image/") : false;
  return isTypeValid || ALLOWED_EXTENSIONS.includes(ext);
}

export function ImageUploadInput({
  name = "imageUrl",
  fileInputName = "imageFile",
  defaultValue = "",
  label = "Image Upload",
}: ImageUploadInputProps) {
  const [previewUrl, setPreviewUrl] = React.useState<string>(defaultValue);
  const [mode, setMode] = React.useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = React.useState<string>(defaultValue);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (defaultValue) {
      setPreviewUrl(defaultValue);
      setUrlInput(defaultValue);
    }
  }, [defaultValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (file) {
      if (!isValidFormat(file)) {
        setErrorMsg(`Invalid file type "${file.name}". Please upload a JPG, JPEG, PNG, WEBP, or AVIF image file.`);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrlInput(val);
    setPreviewUrl(val);
  };

  const clearImage = () => {
    setPreviewUrl("");
    setUrlInput("");
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold flex items-center space-x-2">
          <ImageIcon className="h-4 w-4 text-primary" />
          <span>{label}</span>
        </label>
        <div className="flex items-center space-x-1 text-xs">
          <button
            type="button"
            onClick={() => setMode("file")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              mode === "file"
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              mode === "url"
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            URL
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20 flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* HIDDEN INPUTS FOR FORM SUBMISSION - ALWAYS IN DOM */}
      <input type="hidden" name={name} value={urlInput || (previewUrl.startsWith("http") || previewUrl.startsWith("/") ? previewUrl : "")} />
      <input
        ref={fileInputRef}
        type="file"
        name={fileInputName}
        accept="image/jpeg,image/jpg,image/png,image/webp,image/avif,image/gif,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
      />

      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-border bg-card p-3 group shadow-sm flex items-center space-x-4">
          <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-muted border border-border flex-shrink-0">
            <Image
              src={previewUrl}
              alt="Image Preview"
              fill
              className="object-cover"
              unoptimized={previewUrl.startsWith("blob:") || previewUrl.startsWith("data:")}
            />
          </div>
          <div className="flex-1 space-y-1.5 overflow-hidden pr-2">
            <p className="text-xs font-semibold text-foreground truncate">
              {previewUrl.startsWith("blob:") ? "New File Selected" : previewUrl}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {previewUrl.startsWith("blob:") ? "Ready to upload to Supabase Storage on submit" : "Active Image URL"}
            </p>
            <div className="flex items-center space-x-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs font-bold px-2.5"
                onClick={() => fileInputRef.current?.click()}
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Change Picture
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-destructive hover:bg-destructive/10 px-2"
                onClick={clearImage}
              >
                <X className="h-3.5 w-3.5 mr-1" /> Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {mode === "file" ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-primary/60 bg-muted/30 hover:bg-muted/60 transition-colors rounded-2xl p-6 text-center cursor-pointer space-y-2 group"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-foreground">
                  Click to select or drag & drop image
                </p>
                <p className="text-[10px] text-muted-foreground font-medium">
                  JPG, JPEG, PNG, WEBP, AVIF up to 20MB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative">
                <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={urlInput}
                  onChange={handleUrlChange}
                  className="pl-9 text-xs"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
