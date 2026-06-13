import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatKoreanDateTime(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function formatKoreanDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
  }).format(date);
}

export function normalizePhone(value: string) {
  return value.replace(/[^0-9+]/g, '').slice(0, 20);
}

export function getInitial(name: string) {
  return name.trim().slice(0, 1) || '?';
}

export function toNumber(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
