import { useState } from "react";
import { useParams } from "react-router-dom";

import TaskColumn from "@/features/taskcolumn/TaskColumn";
import TeamMemberSection from "@/features/TeamMemberSectiom/TeamMemberSection";
import TodayProgressSection from "@/features/TodayProgressSection/TodayProgressSection";
export default function Team() {
  const { id } = useParams<{ id: string }>();
  const groupId = Number(id);

  // 팀원 목록 접기/펼치기 상태
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 가로선(구분선) UI
  const beforeDivider =
    "md:before:content-[''] md:before:block md:before:absolute md:before:w-[1120px] md:before:h-px md:before:bg-border-primary md:before:top-[-28px] md:before:left-0";

  // 접기/펼치기 상태에 따른 클래스
  const foldClass = isCollapsed
    ? {
        container: "md:mt-[32px] md:min-h-[calc(100vh-32px)]",
        progressGrid: "md:grid-rows-[0fr]",
        listSection: "md:pt-[0px] md:pb-[0px]",
        divider: "",
      }
    : {
        container: "md:mt-[120px] md:min-h-[calc(100vh-120px)]",
        progressGrid: "md:grid-rows-[1fr]",
        listSection: "md:pt-[64px]",
        divider: beforeDivider,
      };

  if (!groupId) {
    return <div>팀이 없는 페이지 보여줌</div>;
  }

  return (
    <>
      <div
        className={`flex min-h-[calc(100vh-59px)] flex-col md:ml-[85px] md:w-[1120px] ${foldClass.container}`}
      >
        {/* 오늘의 진행도 */}
        <div
          className={`grid transition-all duration-300 ${foldClass.progressGrid}`}
        >
          <div className="overflow-hidden">
            <TodayProgressSection groupId={groupId} />
          </div>
        </div>

        {/* 목록 */}
        <div
          className={`flex gap-[32px] px-[16px] pt-[34px] pb-[54px] md:flex-row md:gap-[24px] md:px-0 ${foldClass.listSection}`}
        >
          <div
            className={`bg-background-secondary relative flex-1 ${foldClass.divider}`}
          >
            <TaskColumn
              groupId={groupId}
              isCollapsed={isCollapsed}
              onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
            />
          </div>

          {/* 할 일 목록 펼쳐지면 안나오기 */}
          {!isCollapsed && (
            <div className="mt-[70px] hidden md:block">
              <TeamMemberSection groupId={groupId} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
