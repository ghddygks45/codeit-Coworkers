import { useGroup, useAllTasks } from "@/api/group";
import { useUser } from "@/api/user";
import GroupHeader from "./components/GroupHeader";
import ProgressStats from "./components/ProgressStats";
import ProgressBar from "./components/ProgressBar";

type TodayProgressSectionProps = {
  groupId: number;
};

export default function TodayProgressSection({
  groupId,
}: TodayProgressSectionProps) {
  // 데이터 조회
  const { data: groupData } = useGroup(groupId);
  const { data: user } = useUser();
  const { data: allTasks } = useAllTasks(groupId);

  console.log(groupData);

  // 관리자 여부 확인
  const isAdmin =
    user?.memberships.find((m) => m.groupId === groupData.id)?.role === "ADMIN";

  // 진행도 계산
  const totalCount = allTasks.length;
  const doneCount = allTasks.filter((task) => task.doneAt).length;
  const progressPercentage =
    totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="bg-background-inverse relative rounded-[20px] shadow-[0_15px_50px_-12px_rgba(0,0,0,0.05)]">
      <GroupHeader
        groupName={groupData.name}
        members={groupData.members}
        isAdmin={isAdmin}
      />
      <ProgressStats
        progressPercentage={progressPercentage}
        totalCount={totalCount}
        doneCount={doneCount}
      />
      <ProgressBar percentage={progressPercentage} />
    </div>
  );
}
