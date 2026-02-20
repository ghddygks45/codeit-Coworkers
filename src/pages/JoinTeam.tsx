import { FetchBoundary } from "@/providers/boundary";
import { useAcceptGroupInvitation } from "@/api/group";
import { useUser } from "@/api/user";
import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { HttpError } from "@/lib/fetchClient";
import { useToastStore } from "@/stores/useToastStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/** 카드 폼 스켈레톤 (입력 + 버튼) */
function JoinTeamSkeleton() {
  return (
    <div className="flex h-[100vh] flex-col items-center justify-center">
      <div className="bg-background-primary w-[calc(100%-20px)] max-w-[550px] rounded-[20px] px-[20px] pt-[52px] pb-[74px] md:px-[45px] md:pt-[61px] md:pb-[64px]">
        <div className="bg-background-tertiary mb-[32px] h-8 w-32 animate-pulse rounded md:mb-[48px]" />
        <div className="mt-[12px] space-y-2 md:mt-[32px]">
          <div className="bg-background-tertiary h-4 w-16 animate-pulse rounded" />
          <div className="bg-background-tertiary h-12 w-full animate-pulse rounded-lg" />
        </div>
        <div className="mt-[40px]">
          <div className="bg-background-tertiary h-12 w-full animate-pulse rounded-lg" />
        </div>
        <div className="mt-[20px] flex justify-center md:mt-[24px]">
          <div className="bg-background-tertiary h-4 w-64 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}

/** 데이터 의존 콘텐츠 (useSuspenseQuery 사용) */
function JoinTeamContent() {
  // 상태 관리
  const [teamLink, setTeamLink] = useState<string>("");
  const [teamLinkError, setTeamLinkError] = useState<string>("");

  // 훅
  const { data: user } = useUser();
  const { mutate, isPending } = useAcceptGroupInvitation();
  const navigate = useNavigate();
  const toast = useToastStore();

  const handleBlur = () => {
    if (!teamLink) {
      setTeamLinkError("팀 링크를 입력해주세요.");
    }
  };

  const handleSubmit = () => {
    if (!teamLink || isPending) {
      if (!teamLink) setTeamLinkError("팀 링크를 입력해주세요.");
      return;
    }

    mutate(
      { userEmail: user.email, token: teamLink },
      {
        onSuccess: (data) => {
          toast.show("팀에 성공적으로 참여했습니다.");
          navigate(`/team/${data.groupId}`);
        },

        // 서버에서 온 에러메세지 화면에 보여주기
        onError: (error) => {
          const message =
            error instanceof HttpError && error.data?.message
              ? error.data.message
              : "유효하지 않은 팀 링크입니다.";
          toast.show(message);
          setTeamLinkError(message);
        },
      },
    );
  };

  return (
    <>
      <div className="flex h-[100vh] flex-col items-center justify-center">
        <div className="bg-background-primary w-[calc(100%-20px)] max-w-[550px] rounded-[20px] px-[20px] pt-[52px] pb-[74px] md:px-[45px] md:pt-[61px] md:pb-[64px]">
          <h3 className="text-color-primary text-xl-b md:text-2xl-b mb-[32px] md:mb-[48px]">
            팀 참여하기
          </h3>
          <div className="mt-[12px] md:mt-[32px]">
            <div className="space-y-1">
              <Input
                label="팀 링크"
                placeholder="팀 링크를 입력해주세요"
                value={teamLink}
                onChange={(e) => {
                  setTeamLink(e.target.value);
                  if (teamLinkError) setTeamLinkError("");
                }}
                onBlur={handleBlur}
                className={`focus:ring-2 focus:outline-none ${teamLinkError ? "border-status-danger" : ""}`}
              />
              {teamLinkError && (
                <p className="text-status-danger text-xs">{teamLinkError}</p>
              )}
            </div>
          </div>
          <div className="mt-[40px]">
            <Button
              size="authWide"
              onClick={handleSubmit}
              disabled={!teamLink || isPending}
              className="disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "참여 중..." : "참여하기"}
            </Button>
          </div>
          <p className="text-color-default text-xs-r md:text-lg-r mt-[20px] text-center md:mt-[24px]">
            공유받은 팀링크를 이용해 참여할 수 있어요.
          </p>
        </div>
      </div>
    </>
  );
}

export default function JoinTeam() {
  return (
    <FetchBoundary loadingFallback={<JoinTeamSkeleton />}>
      <JoinTeamContent />
    </FetchBoundary>
  );
}
