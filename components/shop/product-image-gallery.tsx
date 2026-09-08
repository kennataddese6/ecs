"use client";

import * as React from "react";
import Image from "next/image";
import { ProductImage } from "@/lib/services/products";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ZoomIn,
  Play,
  Video,
} from "lucide-react";

export type GalleryMediaItem =
  | {
      type: "image";
      id: string;
      url: string;
      alt: string;
    }
  | {
      type: "video";
      id: string;
      url: string;
      alt: string;
    };

interface ProductImageGalleryProps {
  images?: ProductImage[];
  productName: string;
  videoUrl?: string | null;
}

export function ProductImageGallery({
  images = [],
  productName,
  videoUrl,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [zoomPos, setZoomPos] = React.useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const lightboxVideoRef = React.useRef<HTMLVideoElement>(null);

  // Assemble gallery items: images come first, video is placed at the end as the last item
  const galleryItems = React.useMemo<GalleryMediaItem[]>(() => {
    const items: GalleryMediaItem[] = [];

    if (images && images.length > 0) {
      images.forEach((img, idx) => {
        if (img.image_url) {
          items.push({
            type: "image",
            id: img.id || `img-${idx}`,
            url: img.image_url,
            alt: img.alt_text || `${productName} Image ${idx + 1}`,
          });
        }
      });
    }

    // If no images exist and no video, provide default placeholder image
    if (items.length === 0 && !videoUrl) {
      items.push({
        type: "image",
        id: "default-img",
        url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop",
        alt: productName,
      });
    }

    // Video is always appended LAST after all images
    if (videoUrl && videoUrl.trim().length > 0) {
      items.push({
        type: "video",
        id: "product-video-item",
        url: videoUrl.trim(),
        alt: `${productName} Showcase Video`,
      });
    }

    return items;
  }, [images, productName, videoUrl]);

  // First image for video thumbnail backdrop preview
  const firstImageUrl = React.useMemo(() => {
    const firstImg = galleryItems.find((it) => it.type === "image");
    return firstImg ? firstImg.url : "";
  }, [galleryItems]);

  // Ensure selectedIndex is bounded
  const totalItems = galleryItems.length;
  const safeIndex = selectedIndex >= totalItems ? 0 : selectedIndex;
  const activeItem = galleryItems[safeIndex] || galleryItems[0];
  const isCurrentVideo = activeItem?.type === "video";

  // Pause video when switching away from video slide
  React.useEffect(() => {
    if (!isCurrentVideo && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isCurrentVideo]);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % totalItems);
    setIsZoomed(false);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
    setIsZoomed(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCurrentVideo) return;
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
  }, [isLightboxOpen, totalItems]);

  return (
    <div className="space-y-4 select-none">
      {/* Main Display Container */}
      <div
        className={`relative aspect-square w-full rounded-3xl overflow-hidden bg-muted border border-border shadow-md group ${
          isCurrentVideo ? "cursor-default" : "cursor-crosshair"
        }`}
        onMouseEnter={() => {
          if (!isCurrentVideo) setIsZoomed(true);
        }}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onClick={() => {
          if (!isCurrentVideo) setIsLightboxOpen(true);
        }}
      >
        {isCurrentVideo ? (
          /* Video Player Item (Last Slide) */
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              src={activeItem.url}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain"
            />
          </div>
        ) : activeItem?.url ? (
          /* Image Item with Amazon-style Hover Zoom */
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={activeItem.url}
              alt={activeItem.alt}
              fill
              className={`object-cover transition-transform duration-200 ease-out ${
                isZoomed ? "scale-[2.2]" : "scale-100"
              }`}
              style={
                isZoomed
                  ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                  : undefined
              }
              priority={safeIndex === 0}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-6 text-center font-bold text-muted-foreground text-lg">
            {productName}
          </div>
        )}

        {/* Badge: Zoom Hint for Images vs Video Badge for Video */}
        {isCurrentVideo ? (
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-emerald-400 text-xs font-bold flex items-center space-x-1.5 shadow-md pointer-events-none z-20">
            <Video className="h-3.5 w-3.5" />
            <span>Product Showcase Video</span>
          </div>
        ) : (
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md text-amber-300 text-xs font-bold flex items-center space-x-1.5 shadow-md pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity z-20">
            <ZoomIn className="h-3.5 w-3.5" />
            <span>Hover to Zoom &bull; Click to Expand</span>
          </div>
        )}

        {/* Item Counter Badge */}
        {totalItems > 1 && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-xs font-extrabold shadow-md pointer-events-none z-20">
            {safeIndex + 1} / {totalItems}
          </div>
        )}

        {/* Expand Icon for Lightbox (Images & Video) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className="absolute bottom-3 right-3 p-2.5 rounded-2xl bg-black/65 hover:bg-black/85 backdrop-blur-md text-white shadow-lg transition-transform hover:scale-110 cursor-pointer z-20"
          title="Open Fullscreen View"
          aria-label="Open Fullscreen View"
        >
          <Maximize2 className="h-4 w-4" />
        </button>

        {/* Glass Prev / Next Navigation Arrows */}
        {totalItems > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center shadow-lg transition-all opacity-80 hover:opacity-100 hover:scale-110 cursor-pointer z-20"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center shadow-lg transition-all opacity-80 hover:opacity-100 hover:scale-110 cursor-pointer z-20"
              aria-label="Next Slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {totalItems > 1 && (
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none pt-1">
          {galleryItems.map((item, idx) => {
            const isSelected = safeIndex === idx;

            if (item.type === "video") {
              // Video Thumbnail (Last item in strip)
              return (
                <button
                  key={item.id || "video-thumb"}
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative h-20 w-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer bg-zinc-900 flex flex-col items-center justify-center group ${
                    isSelected
                      ? "border-emerald-500 ring-2 ring-emerald-500/40 scale-105 shadow-md"
                      : "border-border/80 opacity-80 hover:opacity-100 hover:scale-102"
                  }`}
                  aria-label="View Product Video"
                  title="Watch Product Video"
                >
                  {/* Subtle poster backdrop if image available */}
                  {firstImageUrl && (
                    <Image
                      src={firstImageUrl}
                      alt="Video Poster"
                      fill
                      className="object-cover opacity-25 filter blur-[1px]"
                    />
                  )}

                  <div className="relative z-10 flex flex-col items-center justify-center space-y-1">
                    <div className="h-7 w-7 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Play className="h-3.5 w-3.5 fill-white ml-0.5" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                      Video
                    </span>
                  </div>
                </button>
              );
            }

            // Image Thumbnail
            return (
              <button
                key={item.id || idx}
                onClick={() => setSelectedIndex(idx)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`relative h-20 w-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? "border-amber-500 ring-2 ring-amber-500/30 scale-105 shadow-md"
                    : "border-border/80 opacity-70 hover:opacity-100 hover:scale-102"
                }`}
                aria-label={`View Image ${idx + 1}`}
              >
                <Image
                  src={item.url}
                  alt={item.alt}
                  fill
                  className="object-cover"
                />
              </button>
            );
          })}
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

          {/* Lightbox Content View */}
          <div
            className="relative w-full max-w-5xl aspect-square sm:aspect-video rounded-3xl overflow-hidden flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {isCurrentVideo ? (
              <video
                ref={lightboxVideoRef}
                src={activeItem.url}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain max-h-[85vh] rounded-2xl"
              />
            ) : (
              <Image
                src={activeItem.url}
                alt={activeItem.alt}
                fill
                className="object-contain"
                priority
              />
            )}

            {/* Lightbox Prev / Next Controls */}
            {totalItems > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer z-30"
                  aria-label="Previous Item"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer z-30"
                  aria-label="Next Item"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}

            {/* Bottom Caption */}
            <div className="absolute bottom-4 left-4 right-4 text-center text-white/90 text-xs font-semibold px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md max-w-md mx-auto pointer-events-none">
              {productName} &bull; {isCurrentVideo ? "Product Video" : `Image ${safeIndex + 1}`} ({safeIndex + 1} of {totalItems})
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
