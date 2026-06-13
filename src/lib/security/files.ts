const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function validateImageFile(file: File | null) {
  if (!file || file.size === 0) {
    return { ok: true as const, file: null };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return { ok: false as const, message: '이미지는 최대 5MB까지 업로드할 수 있습니다.' };
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { ok: false as const, message: 'jpg, png, webp 이미지만 업로드할 수 있습니다.' };
  }

  const extension = getSafeImageExtension(file.type);
  return { ok: true as const, file, extension };
}

export function getSafeImageExtension(contentType: string) {
  switch (contentType) {
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    default:
      return 'jpg';
  }
}
