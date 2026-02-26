import Alert from "@/assets/alert.svg";
import { Button } from "../../Button/Button";

type DangerModalProps = {
  onClose: () => void;

  /** 기본 삭제(기존 호환) */
  onDelete?: () => void;

  /** (선택) 반복 삭제 시: 이번만 삭제 */
  onDeleteOnlyThis?: () => void;

  /** (선택) 반복 삭제 시: 전체 삭제 */
  onDeleteAllRecurring?: () => void;

  /** 반복 할 일인지 여부 */
  isRecurring?: boolean;
};

export default function TaskDangerModal({
  onClose,
  onDelete,
  onDeleteOnlyThis,
  onDeleteAllRecurring,
  isRecurring = false,
}: DangerModalProps) {
  const showRecurringActions = isRecurring && !!onDeleteAllRecurring;

  return (
    <div className="p-5">
      <div className="mt-2 mb-5 flex w-full justify-center">
        <Alert />
      </div>

      <div className="mt-2 flex flex-col gap-2">
        <h2 className="text-lg-m text-color-primary">
          할 일 삭제를 진행하시겠어요?
        </h2>

        <p className="text-md-r text-color-primary mb-7">
          삭제 버튼을 누르시면, 할 일이 완전히 삭제되고
          <br /> 복구할 수 없으니 신중히 선택해주세요.
          {showRecurringActions && (
            <>
              <br />
              <span className="text-color-tertiary">
                반복 할 일은 삭제 범위를 선택할 수 있어요.
              </span>
            </>
          )}
        </p>
      </div>

      {/* 버튼 영역 */}
      {showRecurringActions ? (
        <div className="flex flex-col gap-2">
          <Button
            className="w-full!"
            variant="danger"
            type="button"
            onClick={onDeleteOnlyThis}
          >
            이번만 삭제
          </Button>

          <Button
            className="w-full!"
            variant="danger"
            type="button"
            onClick={onDeleteAllRecurring}
          >
            반복 전체 삭제
          </Button>

          <Button
            className="w-full!"
            variant="close"
            type="button"
            onClick={onClose}
          >
            닫기
          </Button>
        </div>
      ) : (
        <div className="flex flex-row justify-center gap-2">
          <Button
            className="w-full"
            variant="close"
            type="button"
            onClick={onClose}
          >
            닫기
          </Button>

          <Button
            className="w-full"
            variant="danger"
            type="button"
            onClick={onDelete ?? onClose}
          >
            삭제
          </Button>
        </div>
      )}
    </div>
  );
}
