import { Button } from "../../components/common/Button/Button";
import PlusBlue from "../../assets/plus_blue.svg";

export default function TestButton() {
  return (
    <div className="flex flex-col gap-8 p-6">
      {/* ================= 기본 버튼 ================= */}
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Default</h2>
        <Button size="landing">시작하기</Button>
        <Button size="normal">기본 버튼</Button>
      </section>

      {/* ================= Outline ================= */}
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Outline Blue</h2>
        <Button size="landing" variant="outline_blue">
          시작하기
        </Button>
        <Button size="teamMedium" variant="outline_blue">
          팀 참여
        </Button>
      </section>

      {/* ================= Danger ================= */}
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Danger</h2>
        <Button size="landing" variant="danger">
          삭제하기
        </Button>
        <Button size="normal" variant="danger">
          탈퇴
        </Button>
      </section>

      {/* ================= Close ================= */}
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Close</h2>
        <Button size="normal" variant="close">
          닫기
        </Button>
        <Button size="smallAction" variant="close">
          취소
        </Button>
      </section>

      {/* ================= Icon Button ================= */}
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Icon Button</h2>
        <Button
          size="teamAdd"
          variant="outline_blue"
          icon={<PlusBlue className="h-4 w-4" />}
        >
          팀 생성하기
        </Button>

        <Button
          size="todoAdd"
          variant="default"
          icon={<PlusBlue className="h-4 w-4" />}
        >
          할 일 추가
        </Button>
      </section>

      {/* ================= Disabled ================= */}
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Disabled</h2>
        <Button size="landing" disabled>
          비활성 버튼
        </Button>
      </section>
    </div>
  );
}
