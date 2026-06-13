'use client';

type ConfirmSubmitButtonProps = {
  confirmMessage: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Server Action form 안에서 사용하는 확인 버튼입니다.
 *
 * 핵심 로직:
 * - 취소를 누르면 form 제출을 막습니다.
 * - 확인을 누르면 브라우저의 기본 form 제출 흐름을 그대로 둡니다.
 */
export function ConfirmSubmitButton({
  confirmMessage,
  children,
  className,
}: ConfirmSubmitButtonProps) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        const confirmed = window.confirm(confirmMessage);

        if (!confirmed) {
          event.preventDefault();
        }
      }}
      className={
        className ??
        'rounded-2xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-700'
      }
    >
      {children}
    </button>
  );
}
