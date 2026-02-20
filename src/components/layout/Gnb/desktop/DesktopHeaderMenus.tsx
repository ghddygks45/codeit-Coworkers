import DesktopTeamSelector from "./DesktopTeamSelector";
import AddTeamButton from "../shared/AddTeamButton";
import DesktopNavLinks from "./DesktopNavLinks";
import { useGnbStore } from "../useGnbStore";
import { FetchBoundary } from "@/providers/boundary";

export default function DesktopHeaderMenus() {
  const isFolded = useGnbStore((state) => state.isFolded);

  return (
    <div>
      <FetchBoundary
        loadingFallback={
          <div className="space-y-2 px-4 pt-6">
            <div className="bg-background-tertiary h-9 w-full animate-pulse rounded-lg" />
            <div className="bg-background-tertiary h-8 w-full animate-pulse rounded-lg" />
            <div className="bg-background-tertiary h-8 w-full animate-pulse rounded-lg" />
          </div>
        }
      >
        <DesktopTeamSelector />
      </FetchBoundary>
      <div className={isFolded ? "hidden" : "mb-6 px-4"}>
        <AddTeamButton size="sm" />
      </div>
      <DesktopNavLinks />
    </div>
  );
}
