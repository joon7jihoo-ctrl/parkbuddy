import Link from 'next/link';

type DeletedRoundOperationBlockedProps = {
  roundTitle?: string | null;
};

export function DeletedRoundOperationBlocked({
  roundTitle,
}: DeletedRoundOperationBlockedProps) {
  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <p className="text-sm font-semibold text-amber-700">삭제된 라운드</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          {roundTitle ?? '이 라운드'}는 삭제된 라운드입니다.
        </h1>
        <p className="mt-3 text-sm leading-6 text-amber-900">
          삭제된 라운드는 복구 전까지 참가자 선택, 조 편성, 스코어 입력,
          결과 보기, 수정 같은 일반 운영 작업을 할 수 없습니다. 필요한 경우
          삭제된 라운드 화면에서 먼저 복구해 주세요.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/admin/rounds/deleted"
            className="flex h-12 items-center justify-center rounded-2xl bg-amber-600 px-4 text-sm font-bold text-white"
          >
            삭제된 라운드 보기
          </Link>
          <Link
            href="/admin/rounds"
            className="flex h-12 items-center justify-center rounded-2xl bg-white px-4 text-sm font-bold text-slate-700 ring-1 ring-amber-200"
          >
            기본 라운드 목록
          </Link>
        </div>
      </section>
    </main>
  );
}
