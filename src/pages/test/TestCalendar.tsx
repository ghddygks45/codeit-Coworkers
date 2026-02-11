import { useState } from "react";
import Calendar from "@/components/common/Calendar/Calendar";
import CalendarTime from "@/components/common/Calendar/CalendarTime";
import CalendarDate from "@/components/common/Calendar/CalendarDate";

export default function TestCalendar() {
  // 1. 단독 테스트용 상태
  const [soloDate, setSoloDate] = useState<Date | null>(null);
  const [soloTime, setSoloTime] = useState<string | null>(null);

  return (
    <div className="bg-background-secondary font-pretendard min-h-screen p-8">
      <div className="mx-auto flex max-w-250 flex-col gap-12">
        {/* 섹션 1: 단독 컴포넌트 테스트 */}
        <section className="space-y-6">
          <h2 className="text-2xl-b text-color-tertiary border-border-primary border-b pb-2">
            Step 1. 단독 컴포넌트 테스트
          </h2>

          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
            {/* 날짜 단독 */}
            <div className="bg-background-primary flex flex-col items-center gap-4 rounded-3xl p-6 shadow-sm">
              <span className="text-md-b text-brand-primary">📅 Date Only</span>
              <CalendarDate
                selectedDate={soloDate}
                onSelectDate={setSoloDate}
              />
              <div className="text-sm-m text-color-default mt-2">
                선택값: {soloDate ? soloDate.toLocaleDateString() : "없음"}
              </div>
            </div>

            {/* 시간 단독 */}
            <div className="bg-background-primary flex flex-col items-center gap-4 rounded-3xl p-6 shadow-sm">
              <span className="text-md-b text-brand-primary">⏰ Time Only</span>
              <CalendarTime
                selectedTime={soloTime}
                onSelectTime={setSoloTime}
              />
              <div className="text-sm-m text-color-default mt-2">
                선택값: {soloTime || "없음"}
              </div>
            </div>
          </div>
        </section>

        {/* 섹션 2: 최종 합체 컴포넌트 테스트 */}
        <section className="space-y-6">
          <h2 className="text-2xl-b text-color-tertiary border-border-primary border-b pb-2">
            Step 2. 최종 합체 캘린더 테스트
          </h2>

          <div className="border-brand-primary/30 flex flex-col items-center justify-center rounded-[40px] border-2 border-dashed bg-white p-10">
            <p className="text-sm-m text-color-disabled mb-6">
              실제 서비스에 들어갈 최종 형태입니다 (세로 정렬)
            </p>
            <Calendar />
          </div>
        </section>
      </div>
    </div>
  );
}
