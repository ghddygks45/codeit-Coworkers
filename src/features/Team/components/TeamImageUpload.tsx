import { useRef } from "react";
import { useUploadImage } from "@/api/image";
import { useToastStore } from "@/stores/useToastStore";
import ImageIcon from "@/assets/image-icon.svg";
import TeamImageEditIcon from "@/assets/team-image-edit.svg";

interface TeamImageUploadProps {
  imageUrl?: string;
  onImageChange?: (url: string) => void;
}

export default function TeamImageUpload({
  imageUrl,
  onImageChange,
}: TeamImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useUploadImage();
  const toast = useToastStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

  return (
    <div>
      <button
        type="button"
        disabled={isPending}
        className="border-border-primary bg-background-primary hover:bg-background-secondary relative h-[64px] w-[64px] cursor-pointer rounded-[20px] border-1 transition-colors disabled:opacity-50 md:h-[100px] md:w-[100px] md:rounded-[32px]"
        onClick={() => fileInputRef.current?.click()}
      >
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt="팀 이미지"
              className="h-full w-full rounded-[20px] object-cover"
            />
            <span className="border-background-primary bg-background-tertiary absolute right-[-5px] bottom-[-5px] flex h-[18px] w-[18px] items-center justify-center rounded-full border-1 md:right-[-12px] md:bottom-[-12px] md:h-[32px] md:w-[32px]">
              <TeamImageEditIcon className="md:scale-180" />
            </span>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="text-icon-primary md:h-[30px] md:w-[30px]" />
          </div>
        )}
      </button>
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
