import DesktopTeamSelector from "./DesktopTeamSelector";
import AddTeamButton from "../shared/AddTeamButton";
import DesktopNavLinks from "./DesktopNavLinks";
import { useGnbStore } from "../useGnbStore";

export default function DesktopHeaderMenus() {
  const isFolded = useGnbStore((state) => state.isFolded);

  return (
    <div>
      <DesktopTeamSelector />
      <div className={isFolded ? "hidden" : "mb-6 px-4"}>
        <AddTeamButton size="sm" />
      </div>
      <DesktopNavLinks />
    </div>
  );
}
