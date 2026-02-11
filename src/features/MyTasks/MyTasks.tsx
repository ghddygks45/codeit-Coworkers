import { useCompletedTasks } from "@/api/user";
import Todo from "@/components/common/Todo/todo";
import CalendarIcon from "@/assets/calendar.svg";
import RepeatIcon from "@/assets/repeat.svg";

const FREQUENCY_LABEL = {
  ONCE: "한번",
  DAILY: "매일 반복",
  WEEKLY: "주 반복",
  MONTHLY: "월 반복",
} as const;

export default function MyTasks() {
  const { data: completedTasks } = useCompletedTasks();

  console.log(completedTasks);

  // 할일 만들기 쪽에서, description에 tasklist id와 group id를 담아서 각각의 id를 화면에선 숨겨서 같이 post함.

  // 나중에 done된 task를 불러오고 각각 description안에 있는 group id와 tasklist id를 뽑아서, 현재 done된 task가 어떤 그룹의 어떤 tasklist에 속하는지 알 수 있게한다.

  // 그리고 group/id/tasklist/id로 해당 tasklist의 이름을 불러오고, tasklist에 속한 task들이 card를 그 taslkist의 이름과 함께 보여지게 한다.

  // 완료된 태스크가 없을 경우 처리
  if (!completedTasks || completedTasks.tasksDone.length === 0) {
    return <div>완료된 태스크가 없습니다.</div>;
  }

  // doneAt 날짜별로 그룹핑
  const groupedByDate = completedTasks.tasksDone.reduce<
    Record<string, typeof completedTasks.tasksDone>
  >((acc, task) => {
    const date = new Date(task.doneAt);
    const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    // acc객체에 프로퍼티 추가
    if (acc[dateKey]) {
      acc[dateKey].push(task);
    } else {
      acc[dateKey] = [task];
    }

    return acc;
  }, {});

  const formatDate = (dateKey: string, showWeekday = true) => {
    const date = new Date(dateKey);
    const datePart = date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // 요일 표시가 필요 없으면 날짜 부분만 반환
    if (!showWeekday) return datePart;

    const weekday = date.toLocaleDateString("ko-KR", {
      weekday: "short",
    });
    return `${datePart} (${weekday})`;
  };

  return (
    <div style={{ padding: "50px" }}>
      <div className="space-y-[48px]">
        {Object.entries(groupedByDate).map(([dateKey, tasks]) => (
          <div key={dateKey}>
            <div className="relative flex items-center justify-center before:absolute before:top-[50%] before:left-0 before:block before:h-px before:w-full before:bg-[#E2E8F0] before:content-['']">
              <p className="text-md-r md:text-lg-m text-color-default bg-background-primary z-10 px-[20px]">
                {formatDate(dateKey, true)}
              </p>
            </div>
            <div className="mt-[12px] space-y-[12px]">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="group border-border-primary hover:border-brand-primary font-pretendard relative flex items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm transition-all"
                >
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center">
                      <div className="flex-none">
                        <Todo
                          content={task.title}
                          isCompleted={task.isCompleted}
                        />
                      </div>
                    </div>

                    <div className="text-xs-m text-color-disabled mt-1.5 flex flex-wrap items-center gap-3 px-0.5">
                      {/* 날짜 및 시간 표시 */}
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{formatDate(task.date, false)}</span>
                        <span>
                          {new Date(task.doneAt).toLocaleTimeString("ko-KR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* 반복 설정 정보 표시 */}
                      {task.frequency !== "ONCE" && (
                        <>
                          <span className="text-gray-300">|</span>
                          <div className="flex items-center gap-1.5">
                            <RepeatIcon className="h-4 w-4" />
                            <span>{FREQUENCY_LABEL[task.frequency]}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
