import { useState } from "react";

export type ModalType = "ListCreate" | "ListEdit" | "ListDelete" | null;
export type TaskListClient = { id: number; name: string };

export function useTaskListModals() {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedTaskList, setSelectedTaskList] =
    useState<TaskListClient | null>(null);

  const openModal = (
    type: ModalType,
    selectedTaskList: TaskListClient | null = null,
  ) => {
    if (selectedTaskList) {
      setSelectedTaskList(selectedTaskList);
    }
    setModalType(type);
  };

  const closeModal = () => setModalType(null);

  return { modalType, selectedTaskList, openModal, closeModal };
}
