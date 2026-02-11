import { useState } from "react";
import { Input } from "../../components/common/Input/Input";

export default function TestInput() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 커스텀 버튼 클릭 핸들러
  const handleVerify = () => {
    alert("버튼이 클릭됨");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 bg-gray-50 p-10">
      <h1 className="mb-4 text-2xl font-bold">컴포넌트 사용 가이드</h1>
      <h2 className="mb-4 text-lg font-bold text-red-500">
        ★부모에 width값으로 input의 크기를 조절할 수 있습니다.★ (현재 1024px)
      </h2>

      {/* 1. 기본 로그인 스타일 (auth size) */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-gray-500 underline">
          1. Auth 스타일
        </h2>
        <Input
          label="이메일"
          type="email"
          placeholder="example@email.com"
          size="auth"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </section>

      {/* 2. 비밀번호 토글 (isPassword 내장 로직 확인) */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-gray-500 underline">
          2. 비밀번호 토글
        </h2>
        <Input
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
          size="auth"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </section>

      {/* 3. 검색 스타일 (search variant + search icon) */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-gray-500 underline">
          3. 검색바 스타일
        </h2>
        <Input
          variant="search"
          size="search"
          withSearchIcon={true}
          placeholder="통합 검색"
        />
      </section>

      {/* 4. 우측 커스텀 요소 (rightElement) - 인증번호 전송 등 */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-gray-500 underline">
          4. 우측 커스텀 버튼
        </h2>
        <Input
          label="우측 버튼 예시"
          placeholder="버튼 예시"
          rightElement={
            <button
              onClick={handleVerify}
              className="bg-brand-primary rounded-lg px-3 py-1.5 text-xs text-white transition-opacity hover:opacity-90"
            >
              인증 요청
            </button>
          }
        />
      </section>

      {/* 5. 대용량 입력 (content size) */}
      <section className="flex w-full flex-col gap-2">
        <h2 className="text-sm font-semibold text-gray-500 underline">
          5. 대용량 입력 (Textarea 대용)
        </h2>
        <Input
          label="상세 내용"
          size="content"
          placeholder="내용을 상세히 적어주세요 (height: 200px)"
        />
      </section>

      {/* 6. 외부 클래스 주입 (className) */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-gray-500 underline">
          6. 외부 스타일 커스텀
        </h2>
        <Input
          label="외곽선 강조 버전"
          className="border-none ring-2 ring-blue-300"
          placeholder="Tailwind 클래스 추가 가능"
        />
      </section>
    </div>
  );
}
