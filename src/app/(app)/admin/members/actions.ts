'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/require-member';

function getRpcErrorCode(message?: string) {
  if (!message) {
    return 'unknown';
  }

  if (message.includes('AUTH_REQUIRED')) {
    return 'auth_required';
  }

  if (message.includes('ADMIN_REQUIRED')) {
    return 'admin_required';
  }

  if (message.includes('INVALID_NAME')) {
    return 'invalid_name';
  }

  if (message.includes('INVALID_PHONE')) {
    return 'invalid_phone';
  }

  if (message.includes('INVALID_ROLE')) {
    return 'invalid_role';
  }

  if (message.includes('INVALID_HANDICAP')) {
    return 'invalid_handicap';
  }

  if (message.includes('DUPLICATE_PHONE')) {
    return 'duplicate_phone';
  }

  if (message.includes('MEMBER_NOT_FOUND')) {
    return 'member_not_found';
  }

  if (message.includes('MEMBER_ALREADY_LINKED')) {
    return 'member_already_linked';
  }

  if (message.includes('CANNOT_DEMOTE_SELF')) {
    return 'cannot_demote_self';
  }

  if (message.includes('CANNOT_DEACTIVATE_SELF')) {
    return 'cannot_deactivate_self';
  }

  if (message.includes('LAST_ADMIN_REQUIRED')) {
    return 'last_admin_required';
  }

  if (message.includes('Could not find the function')) {
    return 'rpc_missing';
  }

  if (message.includes('permission denied')) {
    return 'permission_denied';
  }

  return 'unknown';
}

function sanitizeRedirectValue(value: unknown) {
  return encodeURIComponent(String(value ?? '').slice(0, 120));
}

function getMemberFormValues(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const role = String(formData.get('role') ?? 'member');
  const handicapValue = String(formData.get('handicap') ?? '0').trim();
  const handicap = Number(handicapValue || 0);

  return {
    name,
    phone,
    role,
    handicap,
  };
}

function validateMemberForm({
  name,
  phone,
  role,
  handicap,
  redirectBasePath,
}: {
  name: string;
  phone: string;
  role: string;
  handicap: number;
  redirectBasePath: string;
}) {
  if (name.length < 2) {
    redirect(`${redirectBasePath}?error=invalid_name`);
  }

  if (phone.replace(/\D/g, '').length < 8) {
    redirect(`${redirectBasePath}?error=invalid_phone`);
  }

  if (!Number.isFinite(handicap)) {
    redirect(`${redirectBasePath}?error=invalid_handicap`);
  }

  if (!['member', 'admin'].includes(role)) {
    redirect(`${redirectBasePath}?error=invalid_role`);
  }
}

export async function createMemberAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const values = getMemberFormValues(formData);

  validateMemberForm({
    ...values,
    redirectBasePath: '/admin/members/new',
  });

  const { data, error } = await supabase.rpc('admin_create_member', {
    p_name: values.name,
    p_phone: values.phone,
    p_handicap: values.handicap,
    p_role: values.role,
  });

  if (error) {
    console.error('admin_create_member failed', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    redirect(`/admin/members/new?error=${getRpcErrorCode(error.message)}`);
  }

  const created = Array.isArray(data) ? data[0] : data;

  if (!created) {
    redirect('/admin/members/new?error=unknown');
  }

  revalidatePath('/members');
  revalidatePath('/admin/members');

  const params = new URLSearchParams({
    created: '1',
    name: String(created.member_name),
    phone: String(created.member_phone),
    code: String(created.claim_code),
    expires: String(created.claim_code_expires_at),
  });

  redirect(`/admin/members?${params.toString()}`);
}

export async function updateMemberAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const memberId = String(formData.get('memberId') ?? '').trim();

  if (!memberId) {
    redirect('/admin/members?error=member_not_found');
  }

  const editPath = `/admin/members/${memberId}/edit`;
  const values = getMemberFormValues(formData);

  validateMemberForm({
    ...values,
    redirectBasePath: editPath,
  });

  const { error } = await supabase.rpc('admin_update_member', {
    p_member_id: memberId,
    p_name: values.name,
    p_phone: values.phone,
    p_handicap: values.handicap,
    p_role: values.role,
  });

  if (error) {
    console.error('admin_update_member failed', {
      memberId,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    redirect(`${editPath}?error=${getRpcErrorCode(error.message)}`);
  }

  revalidatePath('/members');
  revalidatePath('/admin/members');
  revalidatePath(editPath);

  redirect('/admin/members?updated=1');
}

export async function deactivateMemberAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const memberId = String(formData.get('memberId') ?? '').trim();

  if (!memberId) {
    redirect('/admin/members?error=member_not_found');
  }

  const { error } = await supabase.rpc('admin_deactivate_member', {
    p_member_id: memberId,
  });

  if (error) {
    console.error('admin_deactivate_member failed', {
      memberId,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    redirect(`/admin/members?error=${getRpcErrorCode(error.message)}`);
  }

  revalidatePath('/members');
  revalidatePath('/admin/members');

  redirect('/admin/members?deactivated=1');
}

export async function restoreMemberAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const memberId = String(formData.get('memberId') ?? '').trim();

  if (!memberId) {
    redirect('/admin/members?status=inactive&error=member_not_found');
  }

  const { error } = await supabase.rpc('admin_restore_member', {
    p_member_id: memberId,
  });

  if (error) {
    console.error('admin_restore_member failed', {
      memberId,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    redirect(
      `/admin/members?status=inactive&error=${getRpcErrorCode(error.message)}`,
    );
  }

  revalidatePath('/members');
  revalidatePath('/admin/members');

  redirect('/admin/members?status=inactive&restored=1');
}

export async function reissueClaimCodeAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const memberId = String(formData.get('memberId') ?? '').trim();

  if (!memberId) {
    redirect('/admin/members?error=member_not_found');
  }

  const { data, error } = await supabase.rpc('admin_reissue_member_claim_code', {
    p_member_id: memberId,
  });

  if (error) {
    console.error('admin_reissue_member_claim_code failed', {
      memberId,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    redirect(`/admin/members?error=${getRpcErrorCode(error.message)}`);
  }

  const result = Array.isArray(data) ? data[0] : data;

  if (!result) {
    redirect('/admin/members?error=unknown');
  }

  revalidatePath('/members');
  revalidatePath('/admin/members');

  const params = new URLSearchParams({
    reissued: '1',
    name: sanitizeRedirectValue(result.member_name),
    phone: sanitizeRedirectValue(result.member_phone),
    code: sanitizeRedirectValue(result.claim_code),
    expires: sanitizeRedirectValue(result.claim_code_expires_at),
  });

  redirect(`/admin/members?${params.toString()}`);
}
