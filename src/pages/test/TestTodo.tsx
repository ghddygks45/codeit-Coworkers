import React, { useState } from "react";
import Todo from "@/components/common/Todo/todo";

const TestTodo = () => {
  const [mobileTodos, setMobileTodos] = useState([
    { id: 1, content: "법인 설립 안내 드리기", isCompleted: false },
    { id: 2, content: "법인 설립 안내 드리기", isCompleted: true },
  ]);

  const [webTodos, setWebTodos] = useState([
    { id: 1, content: "법인 설립 안내 드리기", isCompleted: false },
    { id: 2, content: "법인 설립 안내 드리기", isCompleted: true },
  ]);

  const toggleMobile = (id: number) => {
    setMobileTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t,
      ),
    );
  };

  const toggleWeb = (id: number) => {
    setWebTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t,
      ),
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-12 bg-[#444444] p-10">
      <div className="w-full max-w-100 rounded-xl border border-dashed border-indigo-500/50 bg-[#444444] p-6">
        {/* 모바일 스타일 테스트 영역 */}
        <div className="mb-5 flex flex-col border-b border-gray-600 pb-5 pl-5.75">
          <p className="mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
            Mobile Preview
          </p>
          {mobileTodos.map((todo) => (
            <Todo
              key={`mobile-${todo.id}`}
              content={todo.content}
              isCompleted={todo.isCompleted}
              onToggle={() => toggleMobile(todo.id)}
              isWeb={false} // 강제로 모바일 스타일 고정
            />
          ))}
        </div>

        {/* 웹 스타일 테스트 영역 */}
        <div className="flex flex-col pl-5">
          <p className="mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
            Web Preview
          </p>
          {webTodos.map((todo) => (
            <Todo
              key={`web-${todo.id}`}
              content={todo.content}
              isCompleted={todo.isCompleted}
              onToggle={() => toggleWeb(todo.id)}
              isWeb={true} // 강제로 웹 스타일 고정
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestTodo;
