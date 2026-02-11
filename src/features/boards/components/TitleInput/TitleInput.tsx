import { Input } from "@/components/common/Input/Input";
import { useIsMobile } from "@/hooks/useMediaQuery";

interface TitleInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * 게시글 제목 입력 컴포넌트
 */
export default function TitleInput({ value, onChange }: TitleInputProps) {
  const isMobile = useIsMobile();

  // 반응형 스타일
  const labelSize = isMobile ? "text-md-b" : "text-lg-b";
  const asteriskPadding = isMobile ? "ml-1" : "ml-1.5";
  const labelBottomPadding = isMobile ? "mb-2" : "mb-3";
  const titleInputBottomPadding = isMobile ? "mb-6" : "mb-8";

  return (
    <div className={titleInputBottomPadding}>
      <label
        className={`${labelSize} text-color-primary ${labelBottomPadding} block`}
      >
        제목
        <span className={`text-status-danger ${asteriskPadding}`}>*</span>
      </label>
      <Input
        size="title"
        variant="default"
        placeholder="제목을 입력해주세요"
        className="!border-border-primary w-full"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
