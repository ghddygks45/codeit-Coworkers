import { create } from "zustand";

interface AuthStore {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

/**
 * 로그인 상태를 관리하는 store
 *
 * @example
 * ```tsx
 * const { isLoggedIn, login, logout } = useAuthStore();
 *
 * // 로그인 여부에 따라 UI 분기
 * return isLoggedIn ? <로그인된UI /> : <로그인버튼 />;
 *
 * // 로그인 시 호출
 * login();
 *
 * // 로그아웃 시 호출 (토큰도 함께 삭제됨)
 * logout();
 * ```
 */
export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: Boolean(localStorage.getItem("accessToken")),
  login: () => set({ isLoggedIn: true }),
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ isLoggedIn: false });
  },
}));
