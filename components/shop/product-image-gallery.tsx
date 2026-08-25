"use client";

import * as React from "react";
import Image from "next/image";
import { ProductImage } from "@/lib/services/products";

export function ProductImageGallery({
  images,
  productName,
}: {
  images?: ProductImage[];
  productName: string;
}) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const activeImage = images?.[selectedIndex]?.image_url;

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-muted border border-border flex items-center justify-center">
        {activeImage && activeImage.startsWith("http") ? (
          <Image
            src={activeImage}
            alt={images?.[selectedIndex]?.alt_text || productName}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <span className="text-muted-foreground font-semibold text-lg">{productName}</span>
        )}
      </div>

      {images && images.length > 1 && (
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-16 w-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                selectedIndex === idx ? "border-primary ring-2 ring-primary/20" : "border-border opacity-70 hover:opacity-100"
              }`}
            >
              {img.image_url.startsWith("http") ? (
                <Image src={img.image_url} alt={img.alt_text || productName} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-xs font-semibold">
                  {idx + 1}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
