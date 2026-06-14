import Link from 'next/link';
import { ConfirmSubmitButton } from '@/components/confirm-submit-button';
import { CopyButton } from '@/components/copy-button';
import { MemberFilterControls } from '@/components/admin/member-filter-controls';
import { requireAdmin } from '@/lib/auth/require-member';
import { formatKoreanPhoneNumber, normalizeDigits } from '@/lib/korean-search';
import {
  deactivateMemberAction,
  reissueClaimCodeAction,
  restoreMemberAction,
} from './actions';

type AdminMembersPageProps = {
  searchParams: Promise<{
    created?: string;
    reissued?: string;
    updated?: string;
    deactivated?: string;
    restored?: string;
    name?: string;
    phone?: string;
    code?: string;
    expires?: string;
    error?: string;
    status?: string;
  }>;
};

type MemberStatusFilter = 'active' | 'inactive';
type MemberViewFilter = 'all' | 'linked' | 'waiting' | 'needs-code';

type AdminMember = {
  id: string;
  name: string;
  phone: string | null;
  handicap: number | null;
  role: 'admin' | 'member';
  status: string;
  user_id: string | null;
  joined_on: string | null;
  claimed_at: string | null;
  claim_code_hash: string | null;
  claim_code_expires_at: string | null;
  created_at: string;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case 'auth_required': return '로그인이 필요합니다.';
    case 'admin_required': return '운영진만 회원 관리에 접근할 수 있습니다.';
    case 'invalid_name': return '회원 이름을 2자 이상 입력해 주세요.';
    case 'invalid_phone': return '연락처를 정확히 입력해 주세요.';
    case 'invalid_role': return '회원 역할이 올바르지 않습니다.';
    case 'invalid_handicap': return '핸디캡 값이 올바르지 않습니다.';
    case 'duplicate_phone': return '같은 연락처의 활성 회원이 이미 존재합니다.';
    case 'member_not_found': return '회원을 찾을 수 없습니다.';
    case 'member_already_linked': return '이미 계정 연결이 완료된 회원은 연결 코드를 재발급할 수 없습니다.';
    case 'cannot_demote_self': return '자기 자신의 운영진 권한은 해제할 수 없습니다.';
    case 'cannot_deactivate_self': return '자기 자신은 비활성화할 수 없습니다.';
    case 'last_admin_required': return '동호회에는 최소 1명의 운영진이 필요합니다.';
    case 'rpc_missing': return 'Supabase 관리자 함수가 없습니다. 최신 SQL을 먼저 실행해 주세요.';
    case 'permission_denied': return '관리자 함수 실행 권한이 없습니다. Supabase 권한 설정을 확인해 주세요.';
    case 'unknown': return '알 수 없는 오류가 발생했습니다.';
    default: return null;
  }
}

function getStatusFilter(value?: string): MemberStatusFilter {
  return value === 'inactive' ? 'inactive' : 'active';
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleString('ko-KR');
}

function getView(member: AdminMember): MemberViewFilter {
  if (member.user_id) {
    return 'linked';
  }

  if (member.claim_code_hash) {
    return 'waiting';
  }

  return 'needs-code';
}

function getCounts(members: AdminMember[], status: MemberStatusFilter) {
  const scoped = members.filter((member) => status === 'inactive' ? member.status === 'inactive' : member.status !== 'inactive');
  const linked = scoped.filter((member) => getView(member) === 'linked');
  const waiting = scoped.filter((member) => getView(member) === 'waiting');
  const needsCode = scoped.filter((member) => getView(member) === 'needs-code');

  return {
    all: scoped.length,
    linked: linked.length,
    waiting: waiting.length,
    'needs-code': needsCode.length,
  } satisfies Record<MemberViewFilter, number>;
}

export default async function AdminMembersPage({ searchParams }: AdminMembersPageProps) {
  const params = await searchParams;
  const initialStatus = getStatusFilter(params.status);
  const { supabase, member: currentMember } = await requireAdmin();

  const { data: members, error } = await supabase
    .from('members')
    .select('id, name, phone, handicap, role, status, user_id, joined_on, claimed_at, claim_code_hash, claim_code_expires_at, created_at')
    .eq('club_id', currentMember.club_id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const allMembers = (members ?? []) as AdminMember[];
  const counts = {
    active: getCounts(allMembers, 'active'),
    inactive: getCounts(allMembers, 'inactive'),
  };

  const errorMessage = getErrorMessage(params.error);
  const claimCode = params.code ? decodeURIComponent(params.code) : undefined;
  const claimName = params.name ? decodeURIComponent(params.name) : undefined;
  const claimPhone = params.phone ? decodeURIComponent(params.phone) : undefined;
  const claimExpires = params.expires ? decodeURIComponent(params.expires) : undefined;

  return (
    <main className="mx-auto max-w-7xl space-y-4 px-4 py-6 pb-32">
      <header>
        <p className="text-sm font-semibold text-emerald-600">운영진 관리</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">회원 관리</h1>
        <p className="mt-1 text-sm text-slate-500">회원 등록, 검색, 수정, 비활성화, 복구를 관리합니다.</p>
      </header>

      {errorMessage ? <section className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-700">{errorMessage}</section> : null}
      {params.updated ? <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-semibold text-emerald-700">회원 정보가 수정되었습니다.</section> : null}
      {params.deactivated ? <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-semibold text-emerald-700">회원이 비활성화되었습니다.</section> : null}
      {params.restored ? <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-semibold text-emerald-700">회원이 복구되었습니다.</section> : null}

      {claimCode ? (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-700">{params.created ? '회원이 등록되었습니다.' : '연결 코드가 재발급되었습니다.'}</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">{claimName} 회원 연결 코드</h2>
          <div className="mt-4 rounded-2xl bg-white p-4">
            <p className="text-sm text-slate-500">회원에게 전달할 정보</p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-slate-500">이름</dt><dd className="font-semibold text-slate-900">{claimName}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">연락처</dt><dd className="font-semibold text-slate-900">{formatKoreanPhoneNumber(claimPhone)}</dd></div>
              <div className="flex items-center justify-between gap-4"><dt className="text-slate-500">연결 코드</dt><dd className="flex items-center gap-2"><span className="font-mono text-lg font-bold text-emerald-700">{claimCode}</span><CopyButton value={claimCode} label="코드 복사" /></dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">만료</dt><dd className="font-semibold text-slate-900">{formatDateTime(claimExpires)}</dd></div>
            </dl>
          </div>
        </section>
      ) : null}

      <MemberFilterControls counts={counts} initialStatus={initialStatus} />

      <section className="space-y-3 pb-member-search-results-shell">
        {allMembers.length ? (
          allMembers.map((member) => {
            const isLinked = Boolean(member.user_id);
            const hasClaimCode = Boolean(member.claim_code_hash);
            const isCurrentMember = member.id === currentMember.id;
            const isInactive = member.status === 'inactive';
            const memberView = getView(member);
            const formattedPhone = formatKoreanPhoneNumber(member.phone);
            const phoneDigits = normalizeDigits(member.phone);

            return (
              <article
                key={member.id}
                data-member-card="true"
                data-member-status={isInactive ? 'inactive' : 'active'}
                data-member-view={memberView}
                data-member-name={member.name}
                data-member-phone={phoneDigits}
                hidden={initialStatus === 'active' ? isInactive : !isInactive}
                className="rounded-3xl bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={'/admin/members/' + member.id + '/edit'} className="font-bold text-slate-900 underline-offset-4 hover:underline">{member.name}</Link>
                      <span className={['rounded-full px-2 py-1 text-xs font-semibold', member.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'].join(' ')}>{member.role === 'admin' ? '운영진' : '회원'}</span>
                      {isInactive ? <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">비활성</span> : <span className={['rounded-full px-2 py-1 text-xs font-semibold', isLinked ? 'bg-emerald-100 text-emerald-700' : hasClaimCode ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'].join(' ')}>{isLinked ? '연결 완료' : hasClaimCode ? '연결 대기' : '코드 필요'}</span>}
                      {isCurrentMember ? <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700">내 계정</span> : null}
                    </div>

                    <dl className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600 lg:max-w-2xl">
                      <div className="rounded-2xl bg-slate-50 p-3"><dt className="text-xs text-slate-400">연락처</dt><dd className="mt-1 font-medium text-slate-700">{phoneDigits ? <a href={'tel:' + phoneDigits} className="underline-offset-4 hover:underline">{formattedPhone}</a> : '-'}</dd></div>
                      <div className="rounded-2xl bg-slate-50 p-3"><dt className="text-xs text-slate-400">핸디캡</dt><dd className="mt-1 font-medium text-slate-700">{member.handicap ?? 0}</dd></div>
                      <div className="rounded-2xl bg-slate-50 p-3"><dt className="text-xs text-slate-400">가입일</dt><dd className="mt-1 font-medium text-slate-700">{member.joined_on || '-'}</dd></div>
                      <div className="rounded-2xl bg-slate-50 p-3"><dt className="text-xs text-slate-400">코드 만료</dt><dd className="mt-1 font-medium text-slate-700">{member.claim_code_expires_at ? formatDateTime(member.claim_code_expires_at) : '-'}</dd></div>
                    </dl>
                  </div>

                  <div className="grid grid-cols-3 gap-2 lg:w-96 lg:self-start">
                    {isInactive ? (
                      <form action={restoreMemberAction} className="col-span-3">
                        <input type="hidden" name="memberId" value={member.id} />
                        <ConfirmSubmitButton confirmMessage={member.name + ' 회원을 복구할까요?'} className="w-full rounded-2xl bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">복구</ConfirmSubmitButton>
                      </form>
                    ) : (
                      <>
                        <Link href={'/admin/members/' + member.id + '/edit'} className="rounded-2xl bg-slate-100 px-3 py-2 text-center text-sm font-semibold text-slate-700">수정</Link>
                        {!isLinked ? (
                          <form action={reissueClaimCodeAction}>
                            <input type="hidden" name="memberId" value={member.id} />
                            <button type="submit" className="h-full w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">코드 재발급</button>
                          </form>
                        ) : <span aria-hidden />}
                        {!isCurrentMember ? (
                          <form action={deactivateMemberAction}>
                            <input type="hidden" name="memberId" value={member.id} />
                            <ConfirmSubmitButton confirmMessage={member.name + ' 회원을 비활성화할까요?'} className="w-full rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-60">비활성화</ConfirmSubmitButton>
                          </form>
                        ) : <span aria-hidden />}
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-3xl bg-white px-5 py-10 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-700">표시할 회원이 없습니다.</p>
            <p className="mt-1 text-sm text-slate-500">등록된 회원이 없습니다.</p>
          </div>
        )}
      </section>

      <nav className="parkbuddy-sticky-cta">
        <div data-parkbuddy-sticky-cta="true" className="parkbuddy-sticky-cta__inner">
          <Link href="/admin/members/new" className="flex h-12 items-center justify-center rounded-2xl bg-emerald-600 text-sm font-bold text-white shadow-sm">회원 등록</Link>
        </div>
      </nav>
    </main>
  );
}
