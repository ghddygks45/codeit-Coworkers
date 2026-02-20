import { useState, useRef, useEffect } from "react";
import { useBlocker } from "react-router-dom";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { FetchBoundary } from "@/providers/boundary";
import { useUser, useUpdateUser } from "@/api/user";
import { useUploadImage } from "@/api/image";
import { Input } from "@/components/common/Input/Input";
import PasswordChangeModal from "@/features/MySettings/components/PasswordChangeModal";
import WithdrawModal from "@/features/MySettings/components/WithdrawModal";
import AlertIcon from "@/assets/alert-white.svg";
import PencilIcon from "@/assets/pencil.svg";
import SecessionIcon from "@/assets/secession.svg";

/**
 * 계정 설정 페이지
 *
 * - 데스크톱: 카드 max-w 940px, h 725px, 내부 가로 패딩 74px, 왼쪽 여백은 글쓰기 페이지와 동일(gnb + 패딩)
 * - 타블렛: 카드 h 745px, 가운데 정렬·가로 축소, 내부 가로 패딩 45px
 * - 모바일: 흰 카드 h 566px, 프로필 이미지 64x64 (데스크/타블렛 100x100, 둥글기 8)
 * - 미저장 시 하단 파란 바(Toast 스타일) 노출
 */
function MySettingsContent() {
  const isMobile = useIsMobile();
  const isTabletOrSmaller = useIsMobile("lg");
  const isTablet = !isMobile && isTabletOrSmaller;

  const { data: user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateUserMutation = useUpdateUser();
  const uploadImageMutation = useUploadImage();

  const [nickname, setNickname] = useState(user.nickname);
  const [nicknameError, setNicknameError] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(user.image);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  const hasUnsavedChanges =
    nickname !== user.nickname || profileImageUrl !== user.image;

  // 미저장 시 다른 탭/나가기 시도 시 경고: 이동 차단 + 하단 파란 바는 이미 노출됨
  useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // 카드 레이아웃 (BoardWrite와 동일한 왼쪽 여백)
  // 타블렛: GNB와 흰 카드 사이 최소 56px, 모바일: 최소 16px
  const outerWrapperClass = isMobile
    ? "px-4 pt-6" // 16px
    : isTablet
      ? "px-[56px] mx-auto pt-10"
      : "ml-[184px] pt-14";

  const cardWidth = isMobile || isTablet ? "w-full" : "w-[940px]";
  const cardMaxWidth = "max-w-[940px]";
  const cardHeight = isMobile
    ? "min-h-[566px]"
    : isTablet
      ? "min-h-[745px]"
      : "h-[725px]";
  const cardInnerPaddingX = isMobile
    ? "px-4"
    : isTablet
      ? "px-[45px]"
      : "px-[74px]";

  const profileSize = isMobile ? "h-16 w-16" : "h-[100px] w-[100px]";
  const profileRadius = "rounded-[8px]";

  const handleProfileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("이미지 파일은 최대 10MB까지 업로드 가능합니다.");
      e.target.value = "";
      return;
    }
    uploadImageMutation.mutate(file, {
      onSuccess: (url) => setProfileImageUrl(url),
      onError: () => alert("이미지 업로드에 실패했습니다. 다시 시도해주세요."),
    });
    e.target.value = "";
  };

  const handleNicknameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setNickname(e.target.value);
    if (nicknameError) setNicknameError("");
  };

  // 이름 입력란 블러 시 유효성 검사
  const handleNicknameBlur = () => {
    if (nickname.trim().length === 0) {
      setNicknameError("이름을 입력해주세요.");
    } else if (nickname.trim().length < 2) {
      setNicknameError("이름은 최소 2자 이상이어야 합니다.");
    }
  };

  const handleSave = () => {
    if (updateUserMutation.isPending) return;

    // 닉네임 유효성 검사 강제 실행
    if (nickname.trim().length === 0) {
      setNicknameError("이름을 입력해주세요.");
      return;
    }
    if (nickname.trim().length < 2) {
      setNicknameError("이름은 최소 2자 이상이어야 합니다.");
      return;
    }

    if (!hasUnsavedChanges) return;
    const payload: { nickname?: string; image?: string } = {};
    if (nickname.trim() !== user.nickname) payload.nickname = nickname.trim();
    if (profileImageUrl !== user.image) payload.image = profileImageUrl;
    if (Object.keys(payload).length === 0) return;
    updateUserMutation.mutate(payload, { onSuccess: () => {} });
  };

  return (
    <div className="bg-background-secondary min-h-screen pb-24">
      <div className={outerWrapperClass}>
        <div
          className={`relative ${isMobile || isTablet ? "w-full" : "w-fit"}`}
        >
          <article
            className={`bg-background-primary rounded-[20px] ${cardWidth} ${cardMaxWidth} ${cardHeight} ${cardInnerPaddingX} pt-10 pb-10 ${isTablet ? "mx-auto" : ""}`}
          >
            <h1 className="text-xl-b text-color-primary mb-8">계정 설정</h1>

            {/* 프로필 이미지: 클릭 시 변경, 우측 하단 연필 아이콘 */}
            <div className="mb-8 flex justify-center">
              <button
                type="button"
                onClick={handleProfileClick}
                disabled={uploadImageMutation.isPending}
                className="relative inline-block disabled:opacity-70"
                aria-label="프로필 이미지 변경"
              >
                <img
                  src={profileImageUrl}
                  alt="프로필"
                  className={`${profileSize} ${profileRadius} object-cover ${uploadImageMutation.isPending ? "animate-pulse" : ""}`}
                />
                <span
                  className={`bg-background-secondary [&_path]:!fill-icon-primary absolute right-[-9px] bottom-[-9px] flex items-center justify-center rounded-full shadow md:right-[-16px] md:bottom-[-16px] ${isMobile ? "h-[18px] w-[18px]" : "h-8 w-8"}`}
                >
                  <PencilIcon
                    className={`shrink-0 ${isMobile ? "h-3.5 w-3.5" : "h-5 w-5"}`}
                  />
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </button>
            </div>

            {/* 이름 */}
            <div className="relative mb-9">
              <Input
                label="이름"
                size="auth"
                variant="default"
                value={nickname}
                onChange={handleNicknameChange}
                onBlur={handleNicknameBlur}
                className={`!h-12 ${nicknameError ? "border-status-danger" : ""}`}
              />
              {nicknameError && (
                <p className="text-status-danger absolute mt-[8px] text-xs">
                  {nicknameError}
                </p>
              )}
            </div>

            {/* 이메일 (읽기 전용) */}
            <div className="mb-5">
              <Input
                label="이메일"
                size="auth"
                variant="default"
                value={user.email}
                disabled
                className="bg-background-secondary !h-12"
              />
            </div>

            {/* 비밀번호 (비활성) + 변경하기 */}
            <div className="mb-8">
              <Input
                label="비밀번호"
                type="password"
                size="auth"
                variant="default"
                placeholder="··········"
                disabled
                rightElement={
                  <button
                    type="button"
                    className="bg-brand-primary text-color-inverse text-md-sb hover:bg-interaction-hover h-9 rounded-lg px-3 transition-colors"
                    onClick={() => setPasswordModalOpen(true)}
                  >
                    변경하기
                  </button>
                }
                className="bg-background-secondary !h-12"
              />
            </div>

            {/* 회원 탈퇴하기 */}
            <button
              type="button"
              className="text-status-danger flex items-center gap-2"
              onClick={() => setWithdrawModalOpen(true)}
            >
              <SecessionIcon className="h-5 w-5" />
              <span className="text-md-m">회원 탈퇴하기</span>
            </button>
          </article>

          {/* 미저장 시: 흰 카드 아래 32px 간격으로 표시 (디자인: 하얀 네모 아래) */}
          {hasUnsavedChanges && (
            <div
              className={`mt-8 flex items-center justify-between gap-3 rounded-2xl px-4 py-2.5 shadow-lg md:px-5 md:py-3 ${cardWidth} ${cardMaxWidth} bg-brand-primary`}
            >
              <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
                <div className="shrink-0">
                  <AlertIcon
                    width="20"
                    height="20"
                    className="text-color-inverse md:h-6 md:w-6"
                  />
                </div>
                <span className="text-color-inverse md:text-md-sb text-sm text-ellipsis whitespace-nowrap">
                  저장하지 않은 변경사항이 있어요!
                </span>
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={updateUserMutation.isPending}
                className="bg-background-inverse text-brand-primary text-sm-sb hover:bg-opacity-90 h-8 shrink-0 rounded-lg px-3 transition-colors disabled:opacity-50 md:px-4"
              >
                {updateUserMutation.isPending
                  ? "저장 중..."
                  : "변경사항 저장하기"}
              </button>
            </div>
          )}
        </div>
      </div>

      <PasswordChangeModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
      <WithdrawModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
      />
    </div>
  );
}

/** 계정 설정 페이지 로딩 스켈레톤 */
function MySettingsSkeleton() {
  return (
    <div className="bg-background-secondary min-h-screen pb-24">
      <div className="px-4 pt-6 md:px-[56px] md:pt-10 lg:ml-[184px] lg:pt-14">
        <div className="bg-background-primary mx-auto w-full max-w-[940px] rounded-[20px] px-4 pt-10 pb-10 md:px-[45px] lg:w-[940px] lg:px-[74px]">
          {/* 타이틀 */}
          <div className="bg-background-tertiary mb-8 h-7 w-24 animate-pulse rounded" />

          {/* 프로필 이미지 */}
          <div className="mb-8 flex justify-center">
            <div className="bg-background-tertiary h-16 w-16 animate-pulse rounded-[8px] md:h-[100px] md:w-[100px]" />
          </div>

          {/* 이름 필드 */}
          <div className="mb-5 space-y-2">
            <div className="bg-background-tertiary h-4 w-10 animate-pulse rounded" />
            <div className="bg-background-tertiary h-12 w-full animate-pulse rounded-lg" />
          </div>

          {/* 이메일 필드 */}
          <div className="mb-5 space-y-2">
            <div className="bg-background-tertiary h-4 w-12 animate-pulse rounded" />
            <div className="bg-background-tertiary h-12 w-full animate-pulse rounded-lg" />
          </div>

          {/* 비밀번호 필드 */}
          <div className="mb-8 space-y-2">
            <div className="bg-background-tertiary h-4 w-14 animate-pulse rounded" />
            <div className="bg-background-tertiary h-12 w-full animate-pulse rounded-lg" />
          </div>

          {/* 회원 탈퇴 */}
          <div className="bg-background-tertiary h-5 w-24 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}

export default function MySettings() {
  return (
    <FetchBoundary loadingFallback={<MySettingsSkeleton />}>
      <MySettingsContent />
    </FetchBoundary>
  );
}
