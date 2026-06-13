import { TopBar } from '@/components/TopBar';

export default function LinkMemberPage() {
  return (
    <main className="space-y-5">
      <TopBar title="회원 정보 연결 필요" />
      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">운영진에게 계정 연결을 요청해 주세요</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          보안을 위해 로그인만으로는 동호회 내부 데이터에 접근할 수 없습니다. 운영진이 회원 목록에서 현재 로그인 계정의 user_id를 연결해야 합니다.
        </p>
      </section>
    </main>
  );
}
