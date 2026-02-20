import Logo from "@/assets/logo.svg";
import LogoMobile from "@/assets/logo-mobile.svg";
import { Link } from "react-router-dom";
import { useGnbStore } from "../useGnbStore";

export default function DesktopUserArea() {
  const isFolded = useGnbStore((state) => state.isFolded);
  if (isFolded) {
    return (
      <div className="flex h-[96px] items-center justify-center">
        <Link to="/" aria-label="홈으로 이동">
          <div className="flex h-[52px] w-[52px] items-center justify-center">
            <LogoMobile />
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-[32px]">
      <div className="flex">
        <Link to="/" aria-label="홈으로 이동">
          <Logo className="aspect-[158/32] w-[158px]" />
        </Link>
      </div>
    </div>
  );
}
