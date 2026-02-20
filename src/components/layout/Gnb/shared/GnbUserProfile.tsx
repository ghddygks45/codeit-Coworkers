import { useState } from "react";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import { useGnbStore } from "../useGnbStore";
import { useUser } from "@/api/user";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate, useParams } from "react-router-dom";
import UserDefaultProfile from "@/assets/user.svg";
import { useToastStore } from "@/stores/useToastStore";
import Spinner from "@/components/common/Spinner/Spinner";

export default function GnbUserProfile() {
  const { data: user } = useUser();

  const { logout } = useAuthStore();
  const { isFolded } = useGnbStore();
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const { show: showToast } = useToastStore();

  // 로그아웃 상태 관리
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      navigate("/login");
    }, 1000);
  };

  const handleMyHistoryNavigate = () => {
    if (!groupId) {
      showToast("현재 속한 팀이 없습니다.");
      return;
    }

    navigate(`/team/${groupId}/my-history`);
  };

  // 현재 선택된 그룹 정보 가져오기
  const selectedGroup = user?.memberships.find(
    (member) => member.groupId === Number(groupId),
  );

  // 현재 선택된 팀 이름 (없으면 첫 번째 팀)
  const teamName =
    selectedGroup?.group.name ?? user?.memberships[0]?.group.name;

  if (isLoggingOut) {
    return <Spinner message="로그아웃 중..." />;
  }

  return (
    <>
      <div>
        {/* 모바일 */}
        <div className="relative md:hidden">
          <Dropdown
            optionsKey="myHistory"
            listAlign="center"
            trigger="user"
            options={[
              {
                label: "마이 히스토리",
                value: "마이 히스토리",
                action: handleMyHistoryNavigate,
              },
              {
                label: "계정 설정",
                value: "계정 설정",
                link: "/my-settings",
              },
              {
                label: "팀 참여",
                value: "팀 참여",
                link: "/team/join",
              },
              {
                label: "로그아웃",
                value: "로그아웃",
                action: handleLogout,
              },
            ]}
            keepSelected={false}
            listClassName="right-0"
            icon={
              <>
                <span className="block h-[28px] w-[28px] flex-shrink-0 overflow-hidden rounded-full">
                  {user.image && (
                    <img
                      src={user.image}
                      alt={`${user.nickname} 프로필 이미지`}
                      className="h-full w-full object-cover"
                    />
                  )}
                  {!user.image && (
                    <UserDefaultProfile className="h-full w-full object-cover" />
                  )}
                </span>
              </>
            }
          />
        </div>

        {/* 데스크탑 */}
        <div className="relative hidden md:block">
          <Dropdown
            optionsKey="myHistory"
            listAlign="center"
            trigger="user"
            keepSelected={false}
            options={[
              {
                label: "마이 히스토리",
                value: "마이 히스토리",
                action: handleMyHistoryNavigate,
              },
              {
                label: "계정 설정",
                value: "계정 설정",
                link: "/my-settings",
              },
              {
                label: "팀 참여",
                value: "팀 참여",
                link: "/team/join",
              },
              {
                label: "로그아웃",
                value: "로그아웃",
                action: handleLogout,
              },
            ]}
            listClassName={` ${isFolded ? "bottom-0 left-[42px]" : "-top-[20px] translate-y-[-100%] left-[48px]"}`}
            icon={
              <div
                className={`flex ${isFolded ? "h-[32px]" : "h-auto"} items-center gap-3`}
              >
                <div
                  className={`flex-shrink-0 ${isFolded ? "h-8 w-8" : "h-10 w-10"}`}
                >
                  {user.image && (
                    <img
                      src={user.image}
                      alt={`${user.nickname} 프로필 이미지`}
                      className="h-full w-full rounded-[12px] object-cover"
                    />
                  )}
                  {!user.image && (
                    <UserDefaultProfile className="h-full w-full rounded-[12px] object-cover" />
                  )}
                </div>
                <div
                  className={`min-w-0 flex-1 flex-col gap-1 text-left transition-opacity ${isFolded ? "pointer-events-none scale-0 opacity-0" : "flex scale-100 opacity-100 duration-200"}`}
                >
                  <span className="text-lg-m text-color-primary block max-w-full truncate">
                    {user.nickname}
                  </span>
                  <span className="text-md-m text-color-disabled block max-w-full truncate">
                    {teamName}
                  </span>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
}
