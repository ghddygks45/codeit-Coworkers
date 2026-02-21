import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/api/config";
import { fetchClient } from "@/lib/fetchClient";
import { useToastStore } from "@/stores/useToastStore";

export function useGroupSettingsMenu(selectedTeamId: number) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();
  const { show: showToast } = useToastStore();

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(t)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const updateGroupName = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    await fetchClient(`${BASE_URL}/groups/${selectedTeamId}`, {
      method: "PATCH",
      body: JSON.stringify({ name: trimmed }),
    });

    queryClient.invalidateQueries({ queryKey: ["groups"] });
    queryClient.invalidateQueries({ queryKey: ["taskLists", selectedTeamId] });
    showToast("그룹 이름이 수정되었습니다.");
    setOpen(false);
  };

  const deleteGroup = async () => {
    await fetchClient(`${BASE_URL}/groups/${selectedTeamId}`, {
      method: "DELETE",
    });

    queryClient.invalidateQueries({ queryKey: ["groups"] });
    showToast("그룹이 삭제되었습니다.");
    setOpen(false);
  };

  return {
    open,
    setOpen,
    menuRef,
    updateGroupName,
    deleteGroup,
  };
}
