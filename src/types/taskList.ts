// ========================================
// TaskList Types
// ========================================

import type { TaskServer } from "./task";

// TaskList 상세 (tasks 포함)
export interface TaskListServer {
  displayIndex: number;
  groupId: number;
  updatedAt: string;
  createdAt: string;
  name: string;
  id: number;
  tasks: TaskServer[];
}
