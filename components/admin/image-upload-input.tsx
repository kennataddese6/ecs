"use client";

import * as React from "react";
import Image from "next/image";
import { UploadCloud, X, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageUploadInputProps {
  name?: string;
  fileInputName?: string;
  defaultValue?: string;
  label?: string;
}

export function ImageUploadInput({
  name = "imageUrl",
  fileInputName = "imageFile",
  defaultValue = "",
  label = "Product Image",
}: ImageUploadInputProps) {
  const [previewUrl, setPreviewUrl] = React.useState<string>(defaultValue);
  const [mode, setMode] = React.useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = React.useState<string>(defaultValue);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

      {/* Hidden value field for form submission */}
      <input type="hidden" name={name} value={urlInput || (previewUrl.startsWith("http") ? previewUrl : "")} />

      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-border bg-card p-2 group shadow-sm flex items-center space-x-4">
          <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-muted border border-border flex-shrink-0">
            <Image
              src={previewUrl}
              alt="Image Preview"
              fill
              className="object-cover"
              unoptimized={previewUrl.startsWith("blob:") || previewUrl.startsWith("data:")}
            />
          </div>
          <div className="flex-1 space-y-1 overflow-hidden pr-8">
            <p className="text-xs font-semibold text-foreground truncate">
              {previewUrl.startsWith("blob:") ? "Local File Selected" : previewUrl}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {previewUrl.startsWith("blob:") ? "Ready to upload to Supabase Storage on submit" : "Image URL active"}
            </p>
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-3 right-3 h-7 w-7 rounded-full shadow"
            onClick={clearImage}
            title="Remove Image"
          >
            <X className="h-4 w-4" />
          </Button>
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
                <p className="text-[10px] text-muted-foreground">
                  PNG, JPG, WEBP up to 10MB (Stores in Supabase Storage)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                name={fileInputName}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
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
