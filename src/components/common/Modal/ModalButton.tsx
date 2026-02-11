/**
 * ModalButton 컴포넌트 Props
 *
 * @property {() => void} onClick - 버튼 클릭 시 실행되는 콜백 함수
 * @property {string} buttonText - 버튼에 표시될 텍스트
 */

type ModalButtonProps = {
  onClick: () => void;
  buttonText: string;
};

/**
 * 모달을 테스트 하기 위해 사용하는 버튼 컴포넌트
 *
 * ## 역할
 * - 모달 내부에서 **확인 / 생성 / 실행**과 같은 주요 액션을 수행하는 버튼
 * - 디자인과 크기가 고정된 공용 버튼
 *
 * ## 특징
 * - 높이: 48px
 * - 너비: 332px
 * - 브랜드 메인 컬러 사용
 * - `type="button"`으로 폼 제출 방지
 *
 * ## 사용 예시
 * @example
 * import ModalButton from "components/common/ModalButton";
 *
 * function Example() {
 *   const handleClick = () => {
 *     console.log("버튼 클릭");
 *   };
 *
 *   return (
 *     <ModalButton
 *       buttonText="확인"
 *       onClick={handleClick}
 *     />
 *   );
 * }
 *
 * ## 주의사항
 * - 이 컴포넌트는 **모달 테스트 전용 버튼** 목적으로 설계되었습니다.
 * - 일반 페이지 버튼이 필요한 경우에는 별도의 Button 컴포넌트를 사용하는 것을 권장합니다.
 * - 내부 상태를 가지지 않는 **순수 UI 컴포넌트**입니다.
 */

export default function ModalButton({ onClick, buttonText }: ModalButtonProps) {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className="bg-brand-primary text-lg-b text-color-inverse h-[48px] w-[332px] rounded-[12px] text-center"
      >
        {buttonText}
      </button>
    </>
  );
}
