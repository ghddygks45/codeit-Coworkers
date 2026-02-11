import React, { useState } from "react";
import Gnb from "@/components/gnb/Gnb";
import Todo from "@/components/common/Todo/todo";
import Badge from "@/components/common/Badge/Badge";
import { Button } from "@/components/common/Button/Button";

export default function TestListPage() {
  // 1. 테스트 데이터 설정
  const [todoItems, setTodoItems] = useState([
    {
      id: 1,
      content: "법인 설립 비용 안내 드리기",
      isCompleted: false,
      date: "2024년 7월 29일",
      comments: 3,
    },
    {
      id: 2,
      content: "법인 설립 혹은 변경 등기 비용 안내 드리기",
      isCompleted: true,
      date: "2024년 7월 29일",
      comments: 3,
    },
    {
      id: 3,
      content: "법인 설립 혹은 변경 등기 비용 안내 드리기",
      isCompleted: false,
      date: "2024년 7월 29일",
      comments: 3,
    },
  ]);

  // 2. 오류 수정: 함수 이름을 toggleTodo로 통일
  const toggleTodo = (id: number) => {
    setTodoItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item,
      ),
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8FA] font-sans">
      <div className="sticky top-0 h-screen shrink-0">
        <Gnb />
      </div>

      <main className="flex flex-1 flex-col items-center gap-6 p-6 md:p-10">
        {/* 상단 헤더 */}
        <header className="flex w-full max-w-[1200px] items-center justify-between rounded-[20px] border border-gray-100 bg-white px-8 py-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
            경영관리팀 ⚙️
          </h2>
        </header>

        <div className="flex w-full max-w-[1200px] flex-col gap-8 lg:flex-row">
          {/* 좌측 할 일 목록 */}
          <aside className="flex w-full flex-col gap-4 lg:w-[260px]">
            <h3 className="ml-1 font-bold text-gray-700">할 일</h3>
            <div className="flex flex-col gap-3">
              {[
                { name: "법인 설립", cur: 3, tot: 5, state: "ongoing" },
                { name: "법인 등기", cur: 5, tot: 5, state: "done" },
                { name: "정기 주주", cur: 3, tot: 5, state: "ongoing" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <span className="text-sm font-semibold text-gray-600">
                    {item.name}
                  </span>
                  <Badge
                    state={item.state as "done" | "ongoing" | "start"}
                    size="small"
                    current={item.cur}
                    total={item.tot}
                  />
                </div>
              ))}
            </div>
            <Button
              size="teamAdd"
              variant="outline_blue"
              className="mt-2 w-full font-bold"
            >
              + 팀 추가하기
            </Button>
          </aside>

          {/* 우측 메인 대시보드 */}
          <section className="relative flex-1 rounded-[32px] border border-gray-50 bg-white p-8 shadow-sm">
            <div className="mb-10 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">법인 등기</h3>
              <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                <span className="text-gray-600">2025년 5월</span>
                <div className="flex gap-2 rounded-lg border px-2 py-1">
                  <button className="hover:text-gray-600">{"<"}</button>
                  <button className="hover:text-gray-600">{">"}</button>
                </div>
                <button className="text-gray-400">📅</button>
              </div>
            </div>

            {/* 시안의 주간 캘린더 바 */}
            <div className="mb-10 flex justify-between border-b border-gray-50 px-2 pb-8">
              {[
                { d: "월", n: 18 },
                { d: "화", n: 19 },
                { d: "수", n: 20 },
                { d: "목", n: 21, active: true },
                { d: "금", n: 22 },
                { d: "토", n: 23 },
                { d: "일", n: 24 },
              ].map((item) => (
                <div key={item.n} className="flex flex-col items-center gap-3">
                  <span className="text-xs font-bold text-gray-400">
                    {item.d}
                  </span>
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold ${item.active ? "bg-[#334155] text-white shadow-lg" : "border border-gray-100 text-gray-600"}`}
                  >
                    {item.n}
                  </div>
                </div>
              ))}
            </div>

            {/* 투두 리스트 */}
            <div className="flex flex-col gap-4">
              {todoItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative border-b border-gray-50 pb-4 last:border-none"
                >
                  {/* 3. 오류 수정: toggleToggle 대신 toggleTodo 사용 */}
                  <Todo
                    content={item.content}
                    isCompleted={item.isCompleted}
                    onToggle={() => toggleTodo(item.id)}
                    isWeb={true}
                  />
                  <div className="mt-1 ml-9 flex items-center gap-4 text-[11px] font-medium text-gray-400">
                    <span>📅 {item.date}</span>
                    <span>💬 {item.comments}</span>
                    <span>🔁 매일 반복</span>
                  </div>
                  <button className="absolute top-2 right-0 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100">
                    ⋮
                  </button>
                </div>
              ))}
            </div>

            {/* 플로팅 버튼 및 수정/삭제 팝업 */}
            <div className="absolute top-1/2 -right-6 flex translate-y-[-50%] flex-col items-end gap-3">
              <button className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-3xl text-white shadow-2xl hover:bg-indigo-600">
                +
              </button>
              <div className="animate-in fade-in zoom-in flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-3 text-[11px] font-bold text-gray-500 shadow-2xl duration-200">
                <button className="text-left hover:text-indigo-600">
                  수정하기
                </button>
                <button className="border-t border-gray-50 pt-2 text-left hover:text-red-500">
                  삭제하기
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
