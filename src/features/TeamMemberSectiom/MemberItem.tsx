import Dropdown from "@/components/common/Dropdown/Dropdown";

type Member = {
  userId: number;
  userName: string;
  userEmail: string;
  userImage: string;
  role: "ADMIN" | "MEMBER";
};

type MemberItemProps = {
  member: Member;
  isAdmin: boolean | undefined;
  isSelf: boolean;
  onProfileOpen: () => void;
  onRemoveOpen: () => void;
};

export default function MemberItem({
  member,
  isAdmin,
  isSelf,
  onProfileOpen,
  onRemoveOpen,
}: MemberItemProps) {
  return (
    <li className="mt-[18px] first:mt-0">
      <div
        className="flex cursor-pointer items-center justify-between gap-[12px]"
        onClick={onProfileOpen}
      >
        {/* 프로필 이미지 */}
        <div className="bg-brand-primary h-[32px] w-[32px] flex-shrink-0 overflow-hidden rounded-[8px]">
          <img
            src={member.userImage}
            alt={member.userName + " 프로필 이미지"}
            className="h-full w-full object-cover"
          />
        </div>
        {/* 이름 + 이메일 */}
        <div className="min-w-0 flex-1">
          <p className="text-color-primary text-sm-sb truncate">
            {member.userName}
          </p>
          <p className="text-xs-r text-color-secondary truncate">
            {member.userEmail}
          </p>
        </div>

        {/* 케밥 드롭다운: 관리자일 경우만 보임 본인건 안보임 */}
        {isAdmin && !isSelf && (
          <div
            className="flex flex-shrink-0 items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button">
              <Dropdown
                listAlign="center"
                trigger="kebab"
                options={[
                  {
                    label: "멤버 내보내기",
                    value: "멤버 내보내기",
                    action: onRemoveOpen,
                  },
                ]}
              />
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
