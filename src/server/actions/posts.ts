'use server';

import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { formDataToObject, postFormSchema } from '@/lib/security/validation';
import { validateImageFile } from '@/lib/security/files';
import { requireCurrentMember } from '@/server/auth';

export async function createPost(formData: FormData) {
  const { supabase, member } = await requireCurrentMember();
  const parsed = postFormSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다.');
  if (parsed.data.post_type === 'notice' && member.role !== 'admin') throw new Error('공지사항은 운영진만 작성할 수 있습니다.');

  const imageResult = await validateImageFile(formData.get('image') as File | null);
  if (!imageResult.ok) throw new Error(imageResult.message);

  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      club_id: member.club_id,
      author_id: member.id,
      post_type: parsed.data.post_type,
      title: parsed.data.title,
      content: parsed.data.content,
      is_pinned: parsed.data.post_type === 'notice',
      is_private: parsed.data.is_private,
    })
    .select('id')
    .single();

  if (error || !post) throw new Error(error?.message ?? '게시글 저장 실패');

  if (imageResult.file) {
    const path = `${member.club_id}/${post.id}/${randomUUID()}.${imageResult.extension}`;
    const { error: uploadError } = await supabase.storage.from('post-images').upload(path, imageResult.file, {
      contentType: imageResult.file.type,
      cacheControl: '3600',
      upsert: false,
    });

    if (uploadError) throw new Error(uploadError.message);

    const { error: attachmentError } = await supabase.from('post_attachments').insert({
      post_id: post.id,
      file_path: path,
      content_type: imageResult.file.type,
    });

    if (attachmentError) throw new Error(attachmentError.message);
  }

  revalidatePath('/board');
  redirect(`/board/${post.id}`);
}
