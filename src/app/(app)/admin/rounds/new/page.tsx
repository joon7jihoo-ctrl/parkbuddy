import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/require-member';
import { SubmitButton } from '@/components/SubmitButton';
import { createRoundAction } from '../actions';


function getKoreanDateInputValue() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function getKoreanTimeInputValue() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());

  const hour = parts.find((part) => part.type === 'hour')?.value ?? '00';
  const minute = parts.find((part) => part.type === 'minute')?.value ?? '00';

  return `${hour}:${minute}`;
}

type NewRoundPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case 'invalid_title':
      return '라운드명을 2자 이상 입력해 주세요.';
    case 'invalid_course_name':
      return '골프장명을 2자 이상 입력해 주세요.';
    case 'invalid_play_date':
      return '라운드 날짜를 입력해 주세요.';
    case 'admin_required':
      return '운영진만 라운드를 생성할 수 있습니다.';
    case 'rpc_missing':
      return 'Supabase 라운드 생성 함수가 없습니다. 0011 SQL을 먼저 실행해 주세요.';
    case 'permission_denied':
      return '라운드 생성 권한이 없습니다.';
    case 'unknown':
      return '알 수 없는 오류가 발생했습니다.';
    default:
      return null;
  }
}

export default async function NewRoundPage({
  searchParams,
}: NewRoundPageProps) {
  const defaultPlayDate = getKoreanDateInputValue();
  const defaultStartTime = getKoreanTimeInputValue();
  await requireAdmin();

  const params = await searchParams;
  const errorMessage = getErrorMessage(params.error);

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl items-center px-4 py-6 pb-32">
      <section className="w-full rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              라운드 관리
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              라운드 생성
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              라운드 기본 정보를 먼저 등록합니다. 참가자 선택과 조 편성은
              다음 단계에서 연결됩니다.
            </p>
          </div>

          <Link
            href="/admin/rounds"
            className="shrink-0 rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
          >
            목록
          </Link>
        </div>

        {errorMessage && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {errorMessage}
          </div>
        )}

        <form action={createRoundAction} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              라운드명
            </span>
            <input
              name="title"
              type="text"
              required
              minLength={2}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="예: 6월 정기 라운드"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              골프장
            </span>
            <input
              name="courseName"
              type="text"
              required
              minLength={2}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="예: 남서울CC"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                날짜
              </span>
              <input
                name="playDate"
                type="date"
                required
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  defaultValue={defaultPlayDate} />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                시작 시간
              </span>
              <input
                name="startTime"
                type="time"
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  defaultValue={defaultStartTime} />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">메모</span>
            <textarea
              name="memo"
              rows={4}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="준비물, 집합 장소, 기타 안내사항"
            />
          </label>

          <SubmitButton label="라운드 생성" pendingLabel="생성 중..." />
        </form>
      </section>
    </main>
  );
}
