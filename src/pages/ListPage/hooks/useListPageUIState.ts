import { useRef, useState } from "react";
import type { UITask } from "../types";

export function useListPageUIState() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userSelectedListId, setUserSelectedListId] = useState<number | null>(
    null,
  );

  // 삭제 선택 모달
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UITask | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  return {
    selectedDate,
    setSelectedDate,
    showCalendar,
    setShowCalendar,

    isListModalOpen,
    setIsListModalOpen,
    isTaskModalOpen,
    setIsTaskModalOpen,

    isDropdownOpen,
    setIsDropdownOpen,
    userSelectedListId,
    setUserSelectedListId,

    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteTarget,
    setDeleteTarget,

    dropdownRef,
    calendarRef,
  };
}
