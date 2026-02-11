export type UserMembership = {
  group: {
    teamId: string;
    updatedAt: string;
    createdAt: string;
    image: string;
    name: string;
    id: number;
  };
  role: "ADMIN" | "MEMBER";
  userImage: string;
  userEmail: string;
  userName: string;
  groupId: number;
  userId: number;
};

export type User = {
  teamId: string;
  image: string;
  nickname: string;
  updatedAt: string;
  createdAt: string;
  email: string;
  id: number;
  memberships: UserMembership[];
};

// 완료한 할 일 (user/history 응답)
export interface TaskDone {
  displayIndex: number;
  writerId: number;
  userId: number;
  deletedAt: string | null;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "ONCE";
  description: string;
  name: string;
  recurringId: number;
  doneAt: string;
  date: string;
  updatedAt: string;
  id: number;
}

export interface TaskDoneResponse {
  tasksDone: TaskDone[];
}

// 완료한 할 일 (클라이언트용)
export interface TaskDoneClient extends TaskDone {
  title: string;
  isCompleted: boolean;
}
// 완료한 할 일 (클라이언트용)
export interface TaskDoneClientResponse {
  tasksDone: TaskDoneClient[];
}
