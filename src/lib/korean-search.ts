const CHOSEONG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
] as const;

const JUNGSEONG = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ',
] as const;

const JONGSEONG = [
  '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
] as const;

const KOREAN_DIAL: Record<string, string> = {
  ㄱ: '2', ㄲ: '2', ㅋ: '2',
  ㄴ: '3', ㄹ: '3',
  ㄷ: '4', ㄸ: '4', ㅌ: '4',
  ㅁ: '5',
  ㅂ: '6', ㅃ: '6', ㅍ: '6',
  ㅅ: '7', ㅆ: '7', ㅎ: '7',
  ㅈ: '8', ㅉ: '8', ㅊ: '8',
  ㅇ: '9',
};

const INITIAL_JAMO = new Set<string>(CHOSEONG);
const VOWEL_JAMO = new Set<string>(JUNGSEONG);

export function normalizeDigits(value?: string | null) {
  return String(value ?? '').replace(/\D/g, '');
}

export function normalizeSearchValue(value?: string | null) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[\s_.()\-]/g, '');
}

export function decomposeHangul(value?: string | null) {
  let choseong = '';
  let jamo = '';

  for (const char of normalizeSearchValue(value)) {
    const code = char.charCodeAt(0);

    if (code >= 0xac00 && code <= 0xd7a3) {
      const offset = code - 0xac00;
      const cho = Math.floor(offset / 588);
      const jung = Math.floor((offset % 588) / 28);
      const jong = offset % 28;
      const c = CHOSEONG[cho] ?? '';
      const m = JUNGSEONG[jung] ?? '';
      const f = JONGSEONG[jong] ?? '';
      choseong += c;
      jamo += c + m + f;
    } else {
      choseong += char;
      jamo += char;
    }
  }

  return { choseong, jamo };
}

export function formatKoreanPhoneNumber(value?: string | null) {
  const digits = normalizeDigits(value);

  if (!digits) {
    return '-';
  }

  if (digits.startsWith('02')) {
    if (digits.length === 9) {
      return digits.replace(/^(02)(\d{3})(\d{4})$/, '$1-$2-$3');
    }

    if (digits.length === 10) {
      return digits.replace(/^(02)(\d{4})(\d{4})$/, '$1-$2-$3');
    }
  }

  if (digits.length === 10) {
    return digits.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
  }

  if (digits.length === 11) {
    return digits.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
  }

  return digits;
}

export function toKoreanDialDigits(value?: string | null) {
  const { choseong } = decomposeHangul(value);

  return Array.from(choseong)
    .map((char) => KOREAN_DIAL[char] ?? (/[0-9]/.test(char) ? char : ''))
    .join('');
}

function isInitialOnly(value: string) {
  return Array.from(value).every((char) => INITIAL_JAMO.has(char));
}

function hasKoreanJamo(value: string) {
  return Array.from(value).some((char) => INITIAL_JAMO.has(char) || VOWEL_JAMO.has(char));
}

type MemberSearchTarget = {
  name?: string | null;
  phone?: string | null;
};

export function matchesMemberSearch(target: MemberSearchTarget, query: string) {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return true;
  }

  const queryDigits = normalizeDigits(query);
  const normalizedName = normalizeSearchValue(target.name);
  const phoneDigits = normalizeDigits(target.phone);
  const nameParts = decomposeHangul(target.name);
  const queryParts = decomposeHangul(normalizedQuery);

  if (/^\d+$/.test(normalizedQuery)) {
    if (phoneDigits.includes(normalizedQuery)) {
      return true;
    }

    // 스마트 다이얼은 한 글자 숫자에서는 너무 넓게 잡히므로 2자리 이상부터 이름 초성에 적용한다.
    return normalizedQuery.length >= 2 && toKoreanDialDigits(target.name).includes(normalizedQuery);
  }

  if (normalizedName.includes(normalizedQuery)) {
    return true;
  }

  if (hasKoreanJamo(normalizedQuery)) {
    if (isInitialOnly(normalizedQuery)) {
      return nameParts.choseong.includes(normalizedQuery);
    }

    return nameParts.jamo.includes(queryParts.jamo);
  }

  if (queryDigits) {
    return phoneDigits.includes(queryDigits);
  }

  return false;
}

export function createKoreanSearchTokens(values: Array<string | number | null | undefined>) {
  const source = values.map((value) => String(value ?? '')).join(' ');
  const normalized = normalizeSearchValue(source);
  const decomposed = decomposeHangul(source);
  const digits = normalizeDigits(source);
  const dial = toKoreanDialDigits(source);

  return [normalized, decomposed.choseong, decomposed.jamo, digits, dial].filter(Boolean);
}

export function matchesKoreanSmartSearch(values: Array<string | number | null | undefined>, query: string) {
  const target = {
    name: values.map((value) => String(value ?? '')).join(' '),
    phone: values.map((value) => String(value ?? '')).join(' '),
  };

  return matchesMemberSearch(target, query);
}
