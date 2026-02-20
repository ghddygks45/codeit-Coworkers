import { Input } from "@/components/common/Input/Input";
import { useIsMobile } from "@/hooks/useMediaQuery";

interface ContentInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * 게시글 내용 입력 컴포넌트 (Textarea)
 */
export default function ContentInput({ value, onChange }: ContentInputProps) {
  const isMobile = useIsMobile();

  // 반응형 스타일
  const labelSize = isMobile ? "text-md-b" : "text-lg-b";
  const asteriskPadding = isMobile ? "ml-1" : "ml-1.5";
  const labelBottomPadding = isMobile ? "mb-2" : "mb-3";
  const contentBottomPadding = isMobile ? "mb-2" : "mb-3";
  const contentHeight = isMobile ? 200 : 240;

  return (
    <div className={contentBottomPadding}>
      <label
        className={`${labelSize} text-color-primary ${labelBottomPadding} block`}
      >
        내용
        <span className={`text-status-danger ${asteriskPadding}`}>*</span>
      </label>
      <Input
        size="content"
        variant="default"
        placeholder="내용을 입력하세요"
        className="!border-border-primary w-full"
        style={{ height: contentHeight }}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
