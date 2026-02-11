// ========================================
// Group Types
// ========================================

import type { TaskListServer } from "./tasklist";

// 그룹 멤버
export interface GroupMemberServer {
  role: "ADMIN" | "MEMBER";
  userImage: string;
  userEmail: string;
  userName: string;
  groupId: number;
  userId: number;
}

// 그룹 목록 아이템
export interface GroupSummaryServer {
  teamId: string;
  updatedAt: string;
  createdAt: string;
  image: string;
  name: string;
  id: number;
}

// 그룹 상세
export interface GroupServer extends GroupSummaryServer {
  members: GroupMemberServer[];
  taskLists: TaskListServer[];
}
