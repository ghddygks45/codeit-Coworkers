import { useParams } from "react-router-dom";
import { useMyHistory } from "@/features/MyHistory/useMyHistory";
import { useMyHistoryData } from "@/features/MyHistory/useMyHistoryData";
import MyHistoryHeader from "@/features/MyHistory/MyHistoryHeader";
import MyHistorySidebar from "@/features/MyHistory/MyHistorySidebar";
import MyHistoryContent from "@/features/MyHistory/MyHistoryContent";

export default function MyHistory() {
  const { id: groupId } = useParams();
  const {
    selectedDate,
    showCalendar,
    setShowCalendar,
    selectedTaskListId,
    isDayFilter,
    handlePrevMonth,
    handleNextMonth,
    handleDateSelect,
    handleTaskListSelect,
  } = useMyHistory();

  const { activeTaskLists, taskListCounts, processedData } = useMyHistoryData({
    groupId: Number(groupId),
    selectedDate,
    selectedTaskListId,
    isDayFilter,
  });

  return (
    <div className="bg-background-secondary min-h-screen px-[16px] pt-[17px] pb-[40px] md:px-[26px] md:py-[70px] lg:px-[85px] lg:pt-[90px]">
      <MyHistoryHeader groupId={Number(groupId)} />
      <div className="flex gap-[40px]">
        <MyHistorySidebar
          selectedDate={selectedDate}
          selectedTaskListId={selectedTaskListId}
          onTaskListSelect={handleTaskListSelect}
          activeTaskLists={activeTaskLists}
          taskListCounts={taskListCounts}
        />
        <MyHistoryContent
          selectedDate={selectedDate}
          selectedTaskListId={selectedTaskListId}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onDateSelect={handleDateSelect}
          onTaskListSelect={handleTaskListSelect}
          activeTaskLists={activeTaskLists}
          taskListCounts={taskListCounts}
          processedData={processedData}
        />
      </div>
    </div>
  );
}
