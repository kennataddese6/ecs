"use client";

import * as React from "react";
import Image from "next/image";
import { UploadCloud, X, Plus, ImageIcon, Link as LinkIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface ExistingImage {
  id: string;
  image_url: string;
  alt_text?: string | null;
}

interface MultiImageUploadInputProps {
  existingImages?: ExistingImage[];
  label?: string;
}

interface ImageItem {
  id: string;
  url: string;
  file?: File;
  isExisting?: boolean;
}

export function MultiImageUploadInput({
  existingImages = [],
  label = "Product Gallery Images",
}: MultiImageUploadInputProps) {
  const [items, setItems] = React.useState<ImageItem[]>(() => {
    return existingImages.map((img) => ({
      id: img.id,
      url: img.image_url,
      isExisting: true,
    }));
  });

  const [urlInput, setUrlInput] = React.useState("");
  const [showUrlInput, setShowUrlInput] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Sync state if existingImages prop updates
  React.useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      setItems((prev) => {
        // Keep any newly added local file items, but update existing URLs
        const localFileItems = prev.filter((i) => i.file);
        const existingItems = existingImages.map((img) => ({
          id: img.id,
          url: img.image_url,
          isExisting: true,
        }));
        return [...existingItems, ...localFileItems];
      });
    }
  }, [existingImages]);

  // Sync DataTransfer to fileInputRef whenever items change
  React.useEffect(() => {
    try {
      const dt = new DataTransfer();
      items.forEach((item) => {
        if (item.file) {
          dt.items.add(item.file);
        }
      });
      if (fileInputRef.current) {
        fileInputRef.current.files = dt.files;
      }
    } catch (e) {
      // Graceful fallback for environments without DataTransfer constructor
    }
  }, [items]);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: ImageItem[] = Array.from(files).map((file) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      url: URL.createObjectURL(file),
      file,
      isExisting: false,
    }));

    setItems((prev) => [...prev, ...newItems]);
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    const newItem: ImageItem = {
      id: `url-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      url: urlInput.trim(),
      isExisting: false,
    };
    setItems((prev) => [...prev, newItem]);
    setUrlInput("");
    setShowUrlInput(false);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold flex items-center space-x-2">
          <ImageIcon className="h-4 w-4 text-primary" />
          <span>{label}</span>
        </label>
        <span className="text-xs font-semibold text-muted-foreground">
          {items.length} {items.length === 1 ? "image" : "images"} selected
        </span>
      </div>

      {/* Hidden input outputs for URL strings */}
      {items.map((item) => (
        <React.Fragment key={item.id}>
          {!item.file && <input type="hidden" name="imageUrls" value={item.url} />}
        </React.Fragment>
      ))}

      {/* Hidden File Input carrying actual File objects for form submission */}
      <input
        ref={fileInputRef}
        type="file"
        name="imageFiles"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />

      {/* Grid of Product Gallery Previews */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-border bg-card shadow-sm p-1.5 flex flex-col justify-between"
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-muted">
              <Image
                src={item.url}
                alt={`Product Image ${idx + 1}`}
                fill
                className="object-cover"
                unoptimized={item.url.startsWith("blob:") || item.url.startsWith("data:")}
              />
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-extrabold text-amber-400 z-10">
                #{idx + 1} {idx === 0 ? "(Primary)" : ""}
              </span>
            </div>

            {/* Red Delete X Icon Button */}
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="absolute top-2 right-2 h-7 w-7 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg flex items-center justify-center border border-white/50 transition-all z-20 cursor-pointer hover:scale-110"
              title="Delete Image"
            >
              <X className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        ))}

        {/* Upload Button Box */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square rounded-2xl border-2 border-dashed border-border hover:border-primary/60 bg-muted/30 hover:bg-muted/60 transition-colors flex flex-col items-center justify-center p-3 text-center cursor-pointer space-y-1 group"
        >
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <UploadCloud className="h-5.5 w-5.5" />
          </div>
          <span className="text-xs font-bold text-foreground">Upload Photos</span>
          <span className="text-[10px] text-muted-foreground">PNG, JPG, WEBP</span>
        </div>
      </div>

      {/* Optional URL addition bar */}
      {showUrlInput ? (
        <div className="flex items-center space-x-2 pt-1">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
          <Button type="button" size="sm" onClick={handleAddUrl}>
            Add URL
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setShowUrlInput(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowUrlInput(true)}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary hover:underline pt-1"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Image via External URL</span>
        </button>
      )}
    </div>
  );
}
