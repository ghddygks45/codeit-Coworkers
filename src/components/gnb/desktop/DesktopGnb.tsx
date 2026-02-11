import DesktopUserArea from "./DesktopUserArea";
import DesktopHeaderMenus from "./DesktopHeaderMenus";
import FoldIcon from "@/assets/fold-true.svg";
import UnFoldIcon from "@/assets/fold-false.svg";
import GnbUserProfile from "../shared/GnbUserProfile";
import { useGnbStore } from "../useGnbStore";
import { useAuthStore } from "@/stores/useAuthStore";
import UserProfile from "@/assets/user.svg";
import { Link } from "react-router-dom";

export default function DesktopGnb() {
  const { isFolded, toggleFolded } = useGnbStore();

  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    return (
      <header
        className={`border-border-primary relative z-10 flex h-screen shrink-0 flex-col border-r border-solid shadow-[2px_0_8px_rgba(0,0,0,0.02)] transition-all duration-200 ${
          isFolded ? "w-[72px]" : "w-[270px]"
        }`}
      >
        <DesktopUserArea />
        <div
          className={`border-border-primary mt-auto border-t pb-6 ${
            isFolded ? "mx-0 px-[20px]" : "mx-4"
          }`}
        >
          <div className="mt-[20px]">
            <Link
              to="/login"
              aria-label="로그인 페이지로 이동"
              className="group inline-flex"
            >
              <span className="inline-flex items-center gap-2">
                <UserProfile
                  className={`flex-shrink-0 ${isFolded ? "h-8 w-8" : "h-10 w-10"}`}
                />
                <span
                  className={`text-color-primary text-lg-m min-w-0 transition-opacity group-hover:underline ${isFolded ? "pointer-events-none scale-0 opacity-0" : "flex scale-100 opacity-100 duration-500"}`}
                >
                  로그인
                </span>
              </span>
            </Link>
          </div>
        </div>

        <div
          className={`absolute ${
            isFolded
              ? "top-8 right-0 translate-x-1/2"
              : "top-[34px] right-[24px]"
          }`}
        >
          <button type="button" onClick={toggleFolded}>
            {isFolded ? (
              <div className="bg-background-primary border-border-primary flex h-8 w-8 items-center justify-center rounded-full border shadow-[2px_0_8px_rgba(0,0,0,0.04)]">
                <UnFoldIcon className="h-6 w-6" />
              </div>
            ) : (
              <FoldIcon />
            )}
          </button>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`border-border-primary relative z-10 flex h-screen shrink-0 flex-col border-r border-solid shadow-[2px_0_8px_rgba(0,0,0,0.02)] transition-all duration-200 ${
        isFolded ? "w-[72px]" : "w-[270px]"
      }`}
    >
      <DesktopUserArea />
      <DesktopHeaderMenus />
      <div
        className={`border-border-primary mt-auto border-t pb-6 ${
          isFolded ? "mx-0 px-[20px]" : "mx-4"
        }`}
      >
        <div className="mt-[20px]">
          <GnbUserProfile />
        </div>
      </div>

      <div
        className={`absolute ${
          isFolded ? "top-8 right-0 translate-x-1/2" : "top-[34px] right-[24px]"
        }`}
      >
        <button type="button" onClick={toggleFolded}>
          {isFolded ? (
            <div className="bg-background-primary border-border-primary flex h-8 w-8 items-center justify-center rounded-full border shadow-[2px_0_8px_rgba(0,0,0,0.04)]">
              <UnFoldIcon className="h-6 w-6" />
            </div>
          ) : (
            <FoldIcon />
          )}
        </button>
      </div>
    </header>
  );
}
