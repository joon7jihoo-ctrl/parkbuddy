import Link from 'next/link';
import { ConfirmSubmitButton } from '@/components/confirm-submit-button';
import { CopyButton } from '@/components/copy-button';
import { requireAdmin } from '@/lib/auth/require-member';
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
    q?: string;
    status?: string;
  }>;
};

type MemberStatusFilter = 'active' | 'inactive';

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

type AdminActionLog = {
  id: string;
  action: string;
  created_at: string;
  metadata: Record<string, unknown>;
  actor: {
    name: string | null;
  } | null;
  target: {
    name: string | null;
  } | null;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case 'auth_required':
      return '로그인이 필요합니다.';
    case 'admin_required':
      return '운영진만 회원 관리에 접근할 수 있습니다.';
    case 'invalid_name':
      return '회원 이름을 2자 이상 입력해 주세요.';
    case 'invalid_phone':
      return '연락처를 정확히 입력해 주세요.';
    case 'invalid_role':
      return '회원 역할이 올바르지 않습니다.';
    case 'invalid_handicap':
      return '핸디캡 값이 올바르지 않습니다.';
    case 'duplicate_phone':
      return '같은 연락처의 활성 회원이 이미 존재합니다.';
    case 'member_not_found':
      return '회원을 찾을 수 없습니다.';
    case 'member_already_linked':
      return '이미 계정 연결이 완료된 회원은 연결 코드를 재발급할 수 없습니다.';
    case 'cannot_demote_self':
      return '자기 자신의 운영진 권한은 해제할 수 없습니다.';
    case 'cannot_deactivate_self':
      return '자기 자신은 비활성화할 수 없습니다.';
    case 'last_admin_required':
      return '동호회에는 최소 1명의 운영진이 필요합니다.';
    case 'rpc_missing':
      return 'Supabase 관리자 함수가 없습니다. 최신 SQL을 먼저 실행해 주세요.';
    case 'permission_denied':
      return '관리자 함수 실행 권한이 없습니다. Supabase 권한 설정을 확인해 주세요.';
    case 'unknown':
      return '알 수 없는 오류가 발생했습니다.';
    default:
      return null;
  }
}

function getActionLabel(action: string) {
  switch (action) {
    case 'member.create':
      return '회원 등록';
    case 'member.update':
      return '회원 수정';
    case 'member.deactivate':
      return '회원 비활성화';
    case 'member.restore':
      return '회원 복구';
    case 'member.claim_code.reissue':
      return '연결 코드 재발급';
    default:
      return action;
  }
}

function getStatusFilter(value?: string): MemberStatusFilter {
  return value === 'inactive' ? 'inactive' : 'active';
}

function formatDateTime(value?: string) {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleString('ko-KR');
}

function normalizeSearchText(value: string) {
  return value.toLowerCase().replace(/\s/g, '');
}

function filterMembers(members: AdminMember[], query: string) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return members;
  }

  return members.filter((member) => {
    const searchableText = normalizeSearchText(
      [
        member.name,
        member.phone ?? '',
        member.role === 'admin' ? '운영진 관리자 admin' : '회원 member',
        member.user_id ? '연결완료 연결 완료' : '미연결 연결대기 연결 대기',
        member.status === 'inactive' ? '비활성 inactive' : '활성 active',
      ].join(' '),
    );

    return searchableText.includes(normalizedQuery);
  });
}

function getSearchHref(status: MemberStatusFilter, query: string) {
  const params = new URLSearchParams();

  if (status === 'inactive') {
    params.set('status', 'inactive');
  }

  if (query) {
    params.set('q', query);
  }

  const queryString = params.toString();

  return queryString ? `/admin/members?${queryString}` : '/admin/members';
}

export default async function AdminMembersPage({
  searchParams,
}: AdminMembersPageProps) {
  const params = await searchParams;
  const statusFilter = getStatusFilter(params.status);
  const { supabase, member: currentMember } = await requireAdmin();

  let membersQuery = supabase
    .from('members')
    .select(
      `
      id,
      name,
      phone,
      handicap,
      role,
      status,
      user_id,
      joined_on,
      claimed_at,
      claim_code_hash,
      claim_code_expires_at,
      created_at
    `,
    )
    .order('created_at', { ascending: false });

  // Core query logic: active and inactive members are intentionally separated
  // to reduce the risk of editing inactive rows by mistake.
  if (statusFilter === 'inactive') {
    membersQuery = membersQuery.eq('status', 'inactive');
  } else {
    membersQuery = membersQuery.neq('status', 'inactive');
  }

  const { data: members, error } = await membersQuery;

  if (error) {
    throw new Error(error.message);
  }

  const { data: logs, error: logsError } = await supabase
    .from('admin_action_logs')
    .select(
      `
      id,
      action,
      metadata,
      created_at,
      actor:actor_member_id(name),
      target:target_member_id(name)
    `,
    )
    .order('created_at', { ascending: false })
    .limit(8);

  if (logsError && logsError.code !== '42P01') {
    throw new Error(logsError.message);
  }

  const allMembers = (members ?? []) as AdminMember[];
  const recentLogs = (logs ?? []) as unknown as AdminActionLog[];
  const searchQuery = String(params.q ?? '').trim();
  const filteredMembers = filterMembers(allMembers, searchQuery);

  const errorMessage = getErrorMessage(params.error);
  const claimCode = params.code ? decodeURIComponent(params.code) : undefined;
  const claimName = params.name ? decodeURIComponent(params.name) : undefined;
  const claimPhone = params.phone ? decodeURIComponent(params.phone) : undefined;
  const claimExpires = params.expires
    ? decodeURIComponent(params.expires)
    : undefined;

  return (
    <main className="mx-auto max-w-5xl space-y-5 px-4 py-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            운영진 관리
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            회원 관리
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            회원 등록, 검색, 수정, 비활성화, 복구, 작업 로그를 관리합니다.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/members"
            className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            회원 목록
          </Link>
          <Link
            href="/admin/members/new"
            className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            회원 등록
          </Link>
        </div>
      </header>

      {errorMessage && (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-700">
          {errorMessage}
        </section>
      )}

      {params.updated && (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-semibold text-emerald-700">
          회원 정보가 수정되었습니다.
        </section>
      )}

      {params.deactivated && (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-semibold text-emerald-700">
          회원이 비활성화되었습니다.
        </section>
      )}

      {params.restored && (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-semibold text-emerald-700">
          회원이 복구되었습니다.
        </section>
      )}

      {claimCode && (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-700">
            {params.created
              ? '회원이 등록되었습니다.'
              : '연결 코드가 재발급되었습니다.'}
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-900">
            {claimName} 회원 연결 코드
          </h2>

          <div className="mt-4 rounded-2xl bg-white p-4">
            <p className="text-sm text-slate-500">회원에게 전달할 정보</p>

            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">이름</dt>
                <dd className="font-semibold text-slate-900">{claimName}</dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">연락처</dt>
                <dd className="font-semibold text-slate-900">{claimPhone}</dd>
              </div>

              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">연결 코드</dt>
                <dd className="flex items-center gap-2">
                  <span className="font-mono text-lg font-bold text-emerald-700">
                    {claimCode}
                  </span>
                  <CopyButton value={claimCode} label="코드 복사" />
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">만료</dt>
                <dd className="font-semibold text-slate-900">
                  {formatDateTime(claimExpires)}
                </dd>
              </div>
            </dl>
          </div>
        </section>
      )}

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="mb-4 grid gap-2 sm:grid-cols-2">
          <Link
            href={getSearchHref('active', searchQuery)}
            className={[
              'rounded-2xl px-4 py-3 text-center text-sm font-bold',
              statusFilter === 'active'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700',
            ].join(' ')}
          >
            활성 회원
          </Link>

          <Link
            href={getSearchHref('inactive', searchQuery)}
            className={[
              'rounded-2xl px-4 py-3 text-center text-sm font-bold',
              statusFilter === 'inactive'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700',
            ].join(' ')}
          >
            비활성 회원
          </Link>
        </div>

        <form
          action="/admin/members"
          className="grid gap-3 sm:grid-cols-[1fr_auto_auto]"
        >
          <input type="hidden" name="status" value={statusFilter} />

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              회원 검색
            </span>
            <input
              name="q"
              type="search"
              defaultValue={searchQuery}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="이름, 연락처, 운영진, 연결 완료 등"
            />
          </label>

          <button
            type="submit"
            className="h-12 self-end rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white"
          >
            검색
          </button>

          <Link
            href={
              statusFilter === 'inactive'
                ? '/admin/members?status=inactive'
                : '/admin/members'
            }
            className="flex h-12 items-center justify-center self-end rounded-2xl bg-slate-100 px-5 text-sm font-semibold text-slate-700"
          >
            초기화
          </Link>
        </form>

        <p className="mt-3 text-sm text-slate-500">
          {searchQuery
            ? `검색 결과 ${filteredMembers.length}명 / 현재 보기 ${allMembers.length}명`
            : `현재 보기 ${allMembers.length}명`}
        </p>
      </section>

      <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-900">
            {statusFilter === 'inactive' ? '비활성 회원' : '활성 회원'}{' '}
            {filteredMembers.length}명
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredMembers.length ? (
            filteredMembers.map((member) => {
              const isLinked = Boolean(member.user_id);
              const hasClaimCode = Boolean(member.claim_code_hash);
              const isCurrentMember = member.id === currentMember.id;
              const isInactive = member.status === 'inactive';

              return (
                <article
                  key={member.id}
                  className="grid gap-4 px-5 py-4 md:grid-cols-[1fr_auto]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900">
                        {member.name}
                      </h3>

                      <span
                        className={[
                          'rounded-full px-2 py-1 text-xs font-semibold',
                          member.role === 'admin'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600',
                        ].join(' ')}
                      >
                        {member.role === 'admin' ? '운영진' : '회원'}
                      </span>

                      {isInactive ? (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                          비활성
                        </span>
                      ) : (
                        <span
                          className={[
                            'rounded-full px-2 py-1 text-xs font-semibold',
                            isLinked
                              ? 'bg-emerald-100 text-emerald-700'
                              : hasClaimCode
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-red-100 text-red-700',
                          ].join(' ')}
                        >
                          {isLinked
                            ? '연결 완료'
                            : hasClaimCode
                              ? '연결 대기'
                              : '코드 필요'}
                        </span>
                      )}

                      {isCurrentMember && (
                        <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700">
                          내 계정
                        </span>
                      )}
                    </div>

                    <dl className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <dt className="text-xs text-slate-400">연락처</dt>
                        <dd className="font-medium text-slate-700">
                          {member.phone || '-'}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs text-slate-400">핸디캡</dt>
                        <dd className="font-medium text-slate-700">
                          {member.handicap ?? 0}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs text-slate-400">가입일</dt>
                        <dd className="font-medium text-slate-700">
                          {member.joined_on || '-'}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs text-slate-400">코드 만료</dt>
                        <dd className="font-medium text-slate-700">
                          {member.claim_code_expires_at
                            ? formatDateTime(member.claim_code_expires_at)
                            : '-'}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    {isInactive ? (
                      <form action={restoreMemberAction}>
                        <input
                          type="hidden"
                          name="memberId"
                          value={member.id}
                        />

                        <ConfirmSubmitButton
                          confirmMessage={`${member.name} 회원을 복구할까요? 복구 후 활성 회원 목록에 다시 표시됩니다.`}
                          className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          복구
                        </ConfirmSubmitButton>
                      </form>
                    ) : (
                      <>
                        <Link
                          href={`/admin/members/${member.id}/edit`}
                          className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
                        >
                          수정
                        </Link>

                        {!isLinked && (
                          <form action={reissueClaimCodeAction}>
                            <input
                              type="hidden"
                              name="memberId"
                              value={member.id}
                            />

                            <button
                              type="submit"
                              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                            >
                              코드 재발급
                            </button>
                          </form>
                        )}

                        {!isCurrentMember && (
                          <form action={deactivateMemberAction}>
                            <input
                              type="hidden"
                              name="memberId"
                              value={member.id}
                            />

                            <ConfirmSubmitButton
                              confirmMessage={`${member.name} 회원을 비활성화할까요? 비활성화된 회원은 일반 목록에서 숨겨집니다.`}
                            >
                              비활성화
                            </ConfirmSubmitButton>
                          </form>
                        )}
                      </>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="px-5 py-10 text-center">
              <p className="text-sm font-semibold text-slate-700">
                표시할 회원이 없습니다.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                다른 보기 또는 검색어를 확인해 주세요.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-900">최근 관리자 작업</h2>
            <p className="mt-1 text-sm text-slate-500">
              회원 관리와 관련된 최근 작업 이력입니다.
            </p>
          </div>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {recentLogs.length ? (
            recentLogs.map((log) => (
              <article key={log.id} className="py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-slate-900">
                    {getActionLabel(log.action)}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatDateTime(log.created_at)}
                  </p>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  처리자: {log.actor?.name ?? '-'} · 대상:{' '}
                  {log.target?.name ?? '-'}
                </p>
              </article>
            ))
          ) : (
            <p className="py-4 text-sm text-slate-500">
              아직 기록된 관리자 작업이 없습니다.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
