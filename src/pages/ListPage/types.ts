import { TaskServer } from "@/types/task";

export interface TaskListResponse {
  id: number;
  name: string;
  displayIndex: number;
  tasks: TaskServer[];
}

export interface UITask extends Omit<TaskServer, "name"> {
  title: string;
  isCompleted: boolean;
}

export interface GroupDetailResponse {
  id: number;
  teamId: string;
  name: string;
  members: unknown[];
  taskLists: TaskListResponse[];
}

export const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const KOREAN_WEEKDAY_TO_JS: Record<string, number> = {
  일: 0,
  월: 1,
  화: 2,
  수: 3,
  목: 4,
  금: 5,
  토: 6,
};
