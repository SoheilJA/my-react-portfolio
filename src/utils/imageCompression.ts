const MAX_SOURCE_SIZE = 20 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 2560;
const MIN_IMAGE_DIMENSION = 1280;
const TARGET_WEBP_SIZE = 1_500_000;
const MIN_WEBP_QUALITY = 0.78;
const MAX_WEBP_QUALITY = 0.92;

function encodeWebp(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('تبدیل تصویر به WebP انجام نشد.'));
          return;
        }
        if (blob.type !== 'image/webp') {
          reject(new Error('مرورگر شما از تبدیل تصویر به WebP پشتیبانی نمی‌کند.'));
          return;
        }
        resolve(blob);
      },
      'image/webp',
      quality,
    );
  });
}

export async function convertImageToWebp(file: File): Promise<Blob> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('فقط تصاویر JPG، PNG یا WebP قابل بارگذاری هستند.');
  }
  if (file.size === 0) {
    throw new Error('فایل تصویر خالی است.');
  }
  if (file.size > MAX_SOURCE_SIZE) {
    throw new Error('حجم تصویر اولیه نباید بیشتر از ۲۰ مگابایت باشد.');
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new Error('فایل تصویر قابل خواندن نیست.');
  }

  try {
    const largestSide = Math.max(bitmap.width, bitmap.height);
    if (largestSide === 0) throw new Error('ابعاد تصویر معتبر نیست.');

    let targetDimension = Math.min(largestSide, MAX_IMAGE_DIMENSION);
    while (true) {
      const scale = Math.min(1, targetDimension / largestSide);
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));

      const context = canvas.getContext('2d');
      if (!context) throw new Error('آماده‌سازی تصویر برای تبدیل انجام نشد.');
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      const highestQuality = await encodeWebp(canvas, MAX_WEBP_QUALITY);
      if (highestQuality.size <= TARGET_WEBP_SIZE) return highestQuality;

      let lowerQuality = MIN_WEBP_QUALITY;
      let upperQuality = MAX_WEBP_QUALITY;
      let bestFit = await encodeWebp(canvas, lowerQuality);
      if (bestFit.size <= TARGET_WEBP_SIZE) {
        for (let attempt = 0; attempt < 7; attempt += 1) {
          const quality = (lowerQuality + upperQuality) / 2;
          const candidate = await encodeWebp(canvas, quality);
          if (candidate.size <= TARGET_WEBP_SIZE) {
            bestFit = candidate;
            lowerQuality = quality;
          } else {
            upperQuality = quality;
          }
        }
        return bestFit;
      }

      if (targetDimension <= MIN_IMAGE_DIMENSION) return bestFit;
      targetDimension = Math.max(
        MIN_IMAGE_DIMENSION,
        Math.floor(targetDimension * 0.85),
      );
    }
  } finally {
    bitmap.close();
  }
}
