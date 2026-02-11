import { create } from "zustand";

type OrderBy = "recent" | "like";

interface BoardListState {
  keyword: string;
  orderBy: OrderBy;
  setKeyword: (keyword: string) => void;
  setOrderBy: (orderBy: OrderBy) => void;
}

/** 자유게시판 목록 검색/정렬 전역 상태 (목록 ↔ 상세 이동 시 유지) */
export const useBoardListStore = create<BoardListState>((set) => ({
  keyword: "",
  orderBy: "recent",
  setKeyword: (keyword) => set({ keyword }),
  setOrderBy: (orderBy) => set({ orderBy }),
}));
