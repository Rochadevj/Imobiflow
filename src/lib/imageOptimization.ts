const STORAGE_PUBLIC_SEGMENT = "/storage/v1/object/public/";
const STORAGE_RENDER_SEGMENT = "/storage/v1/render/image/public/";

interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
}

export const getOptimizedImageUrl = (
  imageUrl?: string | null,
  { width, height, quality }: ImageOptimizationOptions = {},
) => {
  if (!imageUrl) return "";

  try {
    const url = new URL(imageUrl);

    if (!url.pathname.includes(STORAGE_PUBLIC_SEGMENT)) {
      return imageUrl;
    }

    url.pathname = url.pathname.replace(STORAGE_PUBLIC_SEGMENT, STORAGE_RENDER_SEGMENT);

    if (width) {
      url.searchParams.set("width", String(Math.round(width)));
    }

    if (height) {
      url.searchParams.set("height", String(Math.round(height)));
    }

    if (quality) {
      url.searchParams.set("quality", String(Math.round(quality)));
    }

    url.searchParams.set("format", "origin");

    return url.toString();
  } catch {
    return imageUrl;
  }
};
