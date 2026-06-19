# ParkBuddy KakaoTalk Attendance Share Copy

## Purpose

This patch adds the first safe version of KakaoTalk sharing for rounding notices.

It does not integrate the Kakao API yet. Instead, it gives operators copy buttons so they can paste a prepared attendance notice into an existing KakaoTalk group chat.

## Scope

Changed behavior:

- Operators can copy a KakaoTalk-ready attendance notice from each rounding notice card.
- Operators can copy the direct attendance link separately.
- The copied message asks members to choose only `참석` or `불참`.
- The link points to the schedule page with an event-specific hash anchor.

No database changes are included.
No authentication changes are included.
No Kakao API integration is included.
No scorecard logic is included.

## User Flow

1. Operator creates a rounding notice.
2. Operator opens the rounding notice list.
3. Operator taps `카카오톡 공지 복사`.
4. Operator pastes the copied message into the KakaoTalk group chat.
5. Members open the link and choose `참석` or `불참`.
6. Operator later creates a confirmed round from attending members.

## Copied Message Shape

```text
[ParkBuddy 라운딩 공지]

일자: 2026.06.20 오후 1:00
장소: ○○ 파크골프장

참석 여부를 아래 링크에서 선택해주세요.
선택지는 참석 / 불참 두 가지입니다.

참석 확인 링크:
https://parkbuddy-five.vercel.app/schedule#event-{eventId}
```

## Security Notes

- This copy feature only shares an attendance page link.
- It does not create anonymous score editing access.
- Scorecard input links should remain login-based in the first implementation.
- Expiring signed scorecard links can be considered later.

## Implementation Notes

The schedule page builds a public schedule URL using this priority:

1. `NEXT_PUBLIC_SITE_URL`
2. `NEXT_PUBLIC_VERCEL_URL`
3. `https://parkbuddy-five.vercel.app`

Recommended future environment variable:

```text
NEXT_PUBLIC_SITE_URL=https://parkbuddy-five.vercel.app
```

## Next Step

After this patch is verified, the next recommended phase is event-to-round flow hardening:

- Make attendance-based confirmed round creation clearer.
- Prevent duplicate creation.
- Preserve linked event context.
- Review attendees before creating the confirmed round.
