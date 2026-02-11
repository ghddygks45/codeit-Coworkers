import { useState } from "react";
import { TaskListServer } from "@/types/tasklist";

export type ModalType = "ListCreate" | "ListEdit" | "ListDelete" | null;

export function useTaskColumnModals() {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedTaskList, setSelectedTaskList] =
    useState<TaskListServer | null>(null);

  const openModal = (
    type: ModalType,
    selectedTaskList: TaskListServer | null = null,
  ) => {
    if (selectedTaskList) {
      setSelectedTaskList(selectedTaskList);
    }
    setModalType(type);
  };

  const closeModal = () => setModalType(null);

  return { modalType, selectedTaskList, openModal, closeModal };
}
