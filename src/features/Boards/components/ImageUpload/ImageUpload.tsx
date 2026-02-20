import { useRef } from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useUploadImage } from "@/api/image";
import { useToastStore } from "@/stores/useToastStore";
import ImageIcon from "@/assets/image-icon.svg";
import CloseIcon from "@/assets/close.svg";

interface ImageUploadProps {
  /** 업로드된 이미지 URL */
  imageUrl?: string;
  /** 이미지 URL 변경 핸들러 */
  onImageChange?: (url: string | undefined) => void;
  maxImages?: number;
}

/**
 * 이미지 업로드 컴포넌트
 *
 * @description
 * 이미지를 선택하면 서버에 업로드 후 URL을 반환합니다.
 * 최대 10MB까지 업로드 가능합니다.
 */
export default function ImageUpload({
  imageUrl,
  onImageChange,
  maxImages = 1,
}: ImageUploadProps) {
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useUploadImage();
  const toast = useToastStore();

  const imageCount = imageUrl ? 1 : 0;

  // 반응형 스타일
  const labelSize = isMobile ? "text-md-b" : "text-lg-b";
  const labelBottomPadding = isMobile ? "mb-2" : "mb-3";
  const imageBoxSize = isMobile ? "w-20 h-20" : "w-[120px] h-[120px]";
  const iconTextGap = isMobile ? "gap-1" : "gap-4";
  const imageBottomPadding = isMobile ? "mb-12" : "mb-[57px]";

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 10MB 제한 확인
    if (file.size > 10 * 1024 * 1024) {
      toast.show("이미지 파일은 최대 10MB까지 업로드 가능합니다.");
      return;
    }

    mutate(file, {
      onSuccess: (url) => onImageChange?.(url),
      onError: () =>
        toast.show("이미지 업로드에 실패했습니다. 다시 시도해주세요."),
      onSettled: () => {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
    });
  };

  const handleRemove = () => {
    onImageChange?.(undefined);
  };

  return (
    <div className={imageBottomPadding}>
      <label
        className={`${labelSize} text-color-primary ${labelBottomPadding} block`}
      >
        이미지
      </label>

      <div className="flex items-start gap-3">
        {/* 업로드 버튼 */}
        {!imageUrl && (
          <button
            type="button"
            disabled={isPending}
            className={`border-border-primary rounded-xl border ${imageBoxSize} flex flex-col items-center justify-center ${iconTextGap} bg-background-primary hover:bg-background-secondary transition-colors disabled:opacity-50`}
            onClick={handleClick}
          >
            {isPending ? (
              <span className="text-color-default text-xs">업로드 중...</span>
            ) : (
              <>
                <ImageIcon className="text-slate-400" />
                <span className="text-color-default text-sm">
                  {imageCount}/{maxImages}
                </span>
              </>
            )}
          </button>
        )}

        {/* 업로드된 이미지 미리보기 */}
        {imageUrl && (
          <div className={`relative ${imageBoxSize}`}>
            <img
              src={imageUrl}
              alt="업로드된 이미지"
              className={`${imageBoxSize} rounded-xl object-cover`}
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-700"
            >
              <CloseIcon className="h-3 w-3 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* 숨겨진 파일 인풋 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
