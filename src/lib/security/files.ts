const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const JPEG_MAGIC = [0xff, 0xd8, 0xff];
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const RIFF_MAGIC = [0x52, 0x49, 0x46, 0x46];
const WEBP_MAGIC = [0x57, 0x45, 0x42, 0x50];

export async function validateImageFile(file: File | null) {
  if (!file || file.size === 0) {
    return { ok: true as const, file: null };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return { ok: false as const, message: '이미지는 최대 5MB까지 업로드할 수 있습니다.' };
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { ok: false as const, message: 'jpg, png, webp 이미지만 업로드할 수 있습니다.' };
  }

  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());

  if (!matchesImageSignature(file.type, bytes)) {
    return { ok: false as const, message: '이미지 파일 형식이 올바르지 않습니다.' };
  }

  const extension = getSafeImageExtension(file.type);
  return { ok: true as const, file, extension };
}

function startsWith(bytes: Uint8Array, signature: number[]) {
  return signature.every((value, index) => bytes[index] === value);
}

function matchesImageSignature(contentType: string, bytes: Uint8Array) {
  if (contentType === 'image/jpeg') {
    return startsWith(bytes, JPEG_MAGIC);
  }

  if (contentType === 'image/png') {
    return startsWith(bytes, PNG_MAGIC);
  }

  if (contentType === 'image/webp') {
    return startsWith(bytes, RIFF_MAGIC) && WEBP_MAGIC.every((value, index) => bytes[index + 8] === value);
  }

  return false;
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
