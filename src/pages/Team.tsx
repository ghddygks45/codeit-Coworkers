import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { FetchBoundary } from "@/providers/boundary";
import { useGroups } from "@/api/user";
import TaskColumn from "@/features/Team/TaskColumn/TaskColumn";
import TaskColumnSkeleton from "@/features/Team/TaskColumn/TaskColumnSkeleton";
import TeamMemberSection from "@/features/Team/TeamMemberSection/TeamMemberSection";
import TeamMemberSkeleton from "@/features/Team/TeamMemberSection/TeamMemberSkeleton";
import TodayProgressSection from "@/features/Team/TodayProgressSection/TodayProgressSection";
import TodayProgressSkeleton from "@/features/Team/TodayProgressSection/TodayProgressSkeleton";
import NothingTeamImage from "@/assets/nothingTeam.svg";
import { Button } from "@/components/common/Button/Button";

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
        container: "md:pt-[32px] md:min-h-[calc(100vh-32px)]",
        progressGrid: "md:grid-rows-[0fr]",
        listSection: "md:pt-[0px] md:pb-[0px]",
        divider: "",
      }
    : {
        container: "md:pt-[120px] md:min-h-[calc(100vh-120px)]",
        progressGrid: "md:grid-rows-[1fr]",
        listSection: "md:pt-[64px]",
        divider: beforeDivider,
      };

  // groupId 없으면 그룹 목록 조회 후 첫 번째 팀으로 리다이렉트
  const { data: groups } = useGroups();

  if (!groupId) {
    if (groups.length > 0) {
      return <Navigate to={`/team/${groups[0].id}`} replace />;
    }

    return (
      <div>
        <div className="flex h-[100vh] flex-col items-center justify-center">
          <NothingTeamImage className="h-[136px] w-[300px] md:h-[211px] md:w-[323px] lg:h-[264px] lg:w-[404px]" />
          <p className="text-md-m text-color-default lg:text-lg-m mt-[24px] text-center md:mt-[32px]">
            아직 소속된 팀이 없습니다.
            <br />
            팀을 생성하거나 팀에 참여해보세요.
          </p>
          <div className="mt-[47px] flex flex-col gap-[8px] md:mt-[80px] lg:gap-[16px]">
            <Link to="add">
              <Button size="teamMedium">팀 생성하기</Button>
            </Link>
            <Link to="join">
              <Button size="teamMedium" variant="outline_blue">
                팀 참여하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-background-secondary">
        <div
          className={`flex min-h-[calc(100vh-59px)] flex-col md:w-[1205px] md:pl-[85px] ${foldClass.container}`}
        >
          {/* 오늘의 진행도 */}
          <div
            className={`grid transition-all duration-300 ${foldClass.progressGrid}`}
          >
            <div className="overflow-hidden">
              <FetchBoundary loadingFallback={<TodayProgressSkeleton />}>
                <TodayProgressSection groupId={groupId} />
              </FetchBoundary>
            </div>
          </div>

          {/* 목록 */}
          <div
            className={`flex gap-[32px] px-[16px] pt-[34px] pb-[54px] md:flex-row md:gap-[24px] md:px-0 ${foldClass.listSection}`}
          >
            <div
              className={`bg-background-secondary relative flex-1 ${foldClass.divider}`}
            >
              <FetchBoundary loadingFallback={<TaskColumnSkeleton />}>
                <TaskColumn
                  groupId={groupId}
                  isCollapsed={isCollapsed}
                  onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
                />
              </FetchBoundary>
            </div>

            {/* 할 일 목록 펼쳐지면 안나오기 */}
            {!isCollapsed && (
              <div className="mt-[70px] hidden md:block">
                <FetchBoundary loadingFallback={<TeamMemberSkeleton />}>
                  <TeamMemberSection groupId={groupId} />
                </FetchBoundary>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
