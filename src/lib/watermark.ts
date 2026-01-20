const WATERMARK_SRC = "/static/afe8d470-5c6b-4901-a94e-13251a6659d8.png";

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (event) => reject(event);
    img.src = src;
  });

const removeWhiteBackground = (img: HTMLImageElement) => {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return canvas;
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;
  const visited = new Uint8Array(width * height);
  const queue: number[] = [];

  const isNearWhite = (r: number, g: number, b: number, a: number) =>
    a > 0 && r >= 245 && g >= 245 && b >= 245;

  const indexFor = (x: number, y: number) => (y * width + x) * 4;

  for (let x = 0; x < width; x++) {
    queue.push(x, 0);
    queue.push(x, height - 1);
  }
  for (let y = 1; y < height - 1; y++) {
    queue.push(0, y);
    queue.push(width - 1, y);
  }

  while (queue.length) {
    const y = queue.pop() as number;
    const x = queue.pop() as number;
    const idx = y * width + x;
    if (visited[idx]) continue;
    visited[idx] = 1;

    const di = indexFor(x, y);
    const r = data[di];
    const g = data[di + 1];
    const b = data[di + 2];
    const a = data[di + 3];
    if (!isNearWhite(r, g, b, a)) continue;

    data[di + 3] = 0;

    if (x > 0) queue.push(x - 1, y);
    if (x < width - 1) queue.push(x + 1, y);
    if (y > 0) queue.push(x, y - 1);
    if (y < height - 1) queue.push(x, y + 1);
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

export const applyWatermark = async (file: File): Promise<File> => {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  const outputWidth = 1500;
  const outputHeight = 1000;

  const objectUrl = URL.createObjectURL(file);
  const baseImage = await loadImage(objectUrl);
  URL.revokeObjectURL(objectUrl);

  let watermark: HTMLCanvasElement | null = null;
  try {
    const watermarkRaw = await loadImage(WATERMARK_SRC);
    watermark = removeWhiteBackground(watermarkRaw);
  } catch (error) {
    console.warn("Watermark image not loaded, skipping watermark.", error);
  }

  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return file;
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  const sourceWidth = baseImage.naturalWidth || baseImage.width;
  const sourceHeight = baseImage.naturalHeight || baseImage.height;
  const coverScale = Math.max(outputWidth / sourceWidth, outputHeight / sourceHeight);
  const drawWidth = sourceWidth * coverScale;
  const drawHeight = sourceHeight * coverScale;
  const offsetX = (outputWidth - drawWidth) / 2;
  const offsetY = (outputHeight - drawHeight) / 2;
  ctx.drawImage(baseImage, offsetX, offsetY, drawWidth, drawHeight);

  if (watermark) {
    const padding = Math.round(canvas.width * 0.025);
    const desiredWidth = 480;
    const maxWidth = canvas.width - padding * 2;
    const targetWidth = Math.min(desiredWidth, maxWidth);
    const watermarkScale = targetWidth / watermark.width;
    const targetHeight = watermark.height * watermarkScale;
    const x = Math.round((canvas.width - targetWidth) / 2);
    const y = Math.round((canvas.height - targetHeight) / 2);

    ctx.shadowColor = "rgba(0, 0, 0, 0.28)";
    ctx.shadowBlur = Math.round(canvas.width * 0.006);
    ctx.shadowOffsetX = Math.round(canvas.width * 0.002);
    ctx.shadowOffsetY = Math.round(canvas.width * 0.002);
    ctx.globalAlpha = 0.7;
    ctx.drawImage(watermark, x, y, targetWidth, targetHeight);
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, file.type || "image/png", 0.9),
  );

  if (!blob) {
    return file;
  }

  return new File([blob], file.name, { type: blob.type, lastModified: Date.now() });
};
