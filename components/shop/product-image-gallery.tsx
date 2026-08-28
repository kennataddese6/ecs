"use client";

import * as React from "react";
import Image from "next/image";
import { ProductImage } from "@/lib/services/products";
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductImageGallery({
  images = [],
  productName,
}: {
  images?: ProductImage[];
  productName: string;
}) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [zoomPos, setZoomPos] = React.useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);

  const displayImages = React.useMemo(() => {
    if (images && images.length > 0) return images;
    return [
      {
        id: "default-img",
        product_id: "",
        image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop",
        alt_text: productName,
        sort_order: 0,
        created_at: "",
      },
    ];
  }, [images, productName]);

  const activeImage = displayImages[selectedIndex] || displayImages[0];
  const totalImages = displayImages.length;

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % totalImages);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "Escape") setIsLightboxOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, totalImages]);

  return (
    <div className="space-y-4 select-none">
      {/* Main Image Container with Amazon-style Hover Zoom */}
      <div
        className="relative aspect-square w-full rounded-3xl overflow-hidden bg-muted border border-border shadow-md group cursor-crosshair"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsLightboxOpen(true)}
      >
        {activeImage.image_url ? (
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={activeImage.image_url}
              alt={activeImage.alt_text || `${productName} Image ${selectedIndex + 1}`}
              fill
              className={`object-cover transition-transform duration-200 ease-out ${
                isZoomed ? "scale-[2.2]" : "scale-100"
              }`}
              style={
                isZoomed
                  ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                  : undefined
              }
              priority
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-6 text-center font-bold text-muted-foreground text-lg">
            {productName}
          </div>
        )}

        {/* Amazon Hover Zoom Hint Badge */}
        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md text-amber-300 text-xs font-bold flex items-center space-x-1.5 shadow-md pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="h-3.5 w-3.5" />
          <span>Hover to Zoom &bull; Click to Expand</span>
        </div>

        {/* Image Counter Badge */}
        {totalImages > 1 && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-xs font-extrabold shadow-md pointer-events-none">
            {selectedIndex + 1} / {totalImages}
          </div>
        )}

        {/* Expand Icon */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className="absolute bottom-3 right-3 p-2.5 rounded-2xl bg-black/65 hover:bg-black/85 backdrop-blur-md text-white shadow-lg transition-transform hover:scale-110 cursor-pointer"
          title="Open Fullscreen Lightbox"
        >
          <Maximize2 className="h-4 w-4" />
        </button>

        {/* Amazon-style Prev/Next Navigation Glass Arrows */}
        {totalImages > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center shadow-lg transition-all opacity-80 hover:opacity-100 hover:scale-110 cursor-pointer z-10"
              aria-label="Previous Image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center shadow-lg transition-all opacity-80 hover:opacity-100 hover:scale-110 cursor-pointer z-10"
              aria-label="Next Image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {totalImages > 1 && (
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
          {displayImages.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedIndex(idx)}
              onMouseEnter={() => setSelectedIndex(idx)}
              className={`relative h-20 w-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                selectedIndex === idx
                  ? "border-amber-500 ring-2 ring-amber-500/30 scale-105 shadow-md"
                  : "border-border/80 opacity-70 hover:opacity-100 hover:scale-102"
              }`}
            >
              <Image
                src={img.image_url}
                alt={img.alt_text || `${productName} Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shadow-xl transition-all cursor-pointer z-50"
            title="Close Lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Lightbox Image View */}
          <div
            className="relative w-full max-w-5xl aspect-square sm:aspect-video rounded-3xl overflow-hidden flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage.image_url}
              alt={activeImage.alt_text || productName}
              fill
              className="object-contain"
              priority
            />

            {/* Lightbox Prev / Next Controls */}
            {totalImages > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}

            {/* Bottom Caption */}
            <div className="absolute bottom-4 left-4 right-4 text-center text-white/90 text-xs font-semibold px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md max-w-md mx-auto">
              {productName} &bull; Image {selectedIndex + 1} of {totalImages}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
