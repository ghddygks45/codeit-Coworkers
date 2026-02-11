type Member = {
  userId: number;
  userImage: string;
  userName: string;
};

type MemberAvatarsProps = {
  members: Member[];
  maxDisplay?: number;
};

export default function MemberAvatars({
  members,
  maxDisplay = 3,
}: MemberAvatarsProps) {
  return (
    <div className="border-border-primary align-center bg-background-inverse flex gap-[6px] rounded-[8px] border p-1 pr-[8px]">
      <div className="flex">
        {members.slice(0, maxDisplay).map((member, index) => (
          <div
            className="border-color-inverse relative -ml-[7px] h-[20px] w-[20px] overflow-hidden rounded-[6px] border first:ml-0 md:h-[24px] md:w-[24px]"
            style={{ zIndex: maxDisplay - index }}
            key={member.userId}
          >
            <img
              src={member.userImage}
              alt={member.userName}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="text-sm-m text-color-default leading-[20px] md:leading-[24px]">
        {members.length}
      </div>
    </div>
  );
}
