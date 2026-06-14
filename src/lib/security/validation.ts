import { z } from 'zod';

const safeText = (min = 1, max = 100) =>
  z
    .string()
    .trim()
    .min(min, '필수 입력값입니다.')
    .max(max, `최대 ${max}자까지 입력할 수 있습니다.`)
    .refine((value) => !/[<>]/.test(value), '꺾쇠 괄호는 사용할 수 없습니다.');

export const memberFormSchema = z.object({
  name: safeText(1, 40),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9+\-\s()]*$/, '전화번호 형식이 올바르지 않습니다.')
    .optional()
    .transform((value) => value || null),
  handicap: z.coerce.number().min(-50).max(200),
  joined_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  role: z.enum(['admin', 'member']).default('member'),
});

export const eventFormSchema = z.object({
  title: safeText(1, 80),
  event_type: z.enum(['regular', 'tournament', 'casual']).default('regular'),
  starts_at: z.string().min(10).max(40),
  course_name: safeText(1, 80),
  holes: z.coerce.number().int().refine((value) => [9, 18, 27, 36].includes(value)),
  max_participants: z.coerce.number().int().min(1).max(200).optional().nullable(),
  memo: z.string().trim().max(1000).optional().transform((value) => value || null),
});

export const voteSchema = z.object({
  eventId: z.string().uuid(),
  status: z.enum(['attend', 'absent', 'maybe']),
});

export const roundFormSchema = z.object({
  title: safeText(1, 80),
  event_id: z.string().uuid().optional().nullable(),
  played_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  course_name: safeText(1, 80),
  holes: z.coerce.number().int().refine((value) => [9, 18, 27, 36].includes(value)),
  memo: z.string().trim().max(1000).optional().transform((value) => value || null),
});

export const scoreSchema = z.object({
  roundId: z.string().uuid(),
  memberId: z.string().uuid(),
  scores: z
    .array(
      z.object({
        hole_no: z.number().int().min(1).max(36),
        par: z.number().int().min(2).max(6),
        strokes: z.number().int().min(1).max(20),
      })
    )
    .min(1)
    .max(36),
});

export const postFormSchema = z.object({
  title: safeText(1, 100),
  content: z
    .string()
    .trim()
    .min(1, '필수 입력값입니다.')
    .max(5000, '최대 5000자까지 입력할 수 있습니다.')
    .refine((value) => !/[<>]/.test(value), '꺾쇠 괄호는 사용할 수 없습니다.'),
  post_type: z.enum(['notice', 'free']).default('free'),
  is_private: z
    .preprocess((value) => value === 'on' || value === 'true' || value === true, z.boolean())
    .default(false),
});

export const profileFormSchema = z.object({
  name: safeText(1, 40),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9+\-\s()]*$/, '전화번호 형식이 올바르지 않습니다.')
    .optional()
    .transform((value) => value || null),
  handicap: z.coerce.number().min(-50).max(200),
});

export function formDataToObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}
