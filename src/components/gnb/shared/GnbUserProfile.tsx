import Dropdown from "@/components/common/Dropdown/Dropdown";
import { useGnbStore } from "../useGnbStore";
import { useUser } from "@/api/user";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate, useParams } from "react-router-dom";

export default function GnbUserProfile() {
  const { data: user } = useUser();

  const { logout } = useAuthStore();
  const { isFolded } = useGnbStore();
  const { id: teamId } = useParams();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 현재 선택된 그룹 정보 가져오기
  const selectedGroup = user?.memberships.find(
    (member) => member.groupId === Number(teamId),
  );

  // 현재 선택된 팀 이름 (없으면 첫 번째 팀)
  const teamName =
    selectedGroup?.group.name ?? user?.memberships[0]?.group.name;

  return (
    <>
      <div>
        <div className="relative md:hidden">
          <Dropdown
            optionsKey="myHistory"
            listAlign="center"
            trigger="user"
            options={[
              {
                label: "마이 히스토리",
                value: "마이 히스토리",
                link: "/my-history",
              },
              {
                label: "계정 설정",
                value: "계정 설정",
                link: "/my-settings",
              },
              {
                label: "팀 참여",
                value: "팀 참여",
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
              <span className="block h-[28px] w-[28px] flex-shrink-0 overflow-hidden rounded-full">
                <img
                  src={user.image}
                  alt={`${user.nickname} 프로필 이미지`}
                  className="h-full w-full object-cover"
                />
              </span>
            }
          />
        </div>
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
                link: "/my-history",
              },
              {
                label: "계정 설정",
                value: "계정 설정",
                link: "/my-settings",
              },
              {
                label: "팀 참여",
                value: "팀 참여",
                link: "/join-team",
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
                  <img
                    src={user.image}
                    alt={`${user.nickname} 프로필 이미지`}
                    className="h-full w-full rounded-[12px] object-cover"
                  />
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
