import { menuSlideDownProps } from "../utils/menuSlideDown";
import TeamListItem from "../shared/TeamListItem";
import { GroupSummaryServer } from "@/types/group";
import { useParams } from "react-router-dom";

interface MobileTeamSelectorProps {
  isMenuOpen: boolean;
  groupsData?: GroupSummaryServer[];
}

export default function MobileTeamSelector({
  isMenuOpen,
  groupsData,
}: MobileTeamSelectorProps) {
  const teamItems =
    groupsData?.map((group) => ({ type: "team" as const, data: group })) || [];

  const { id: teamId } = useParams();

  return (
    <ul className="mb-2 min-w-0 space-y-2 overflow-hidden">
      {teamItems.map((item, index) => {
        const isSelected = Number(teamId) === item.data.id;
        const animationProps = menuSlideDownProps(index, isMenuOpen);

        return (
          <li
            key={item.data.id}
            className={animationProps.className}
            style={animationProps.style}
          >
            <TeamListItem
              id={item.data.id}
              name={item.data.name}
              isSelected={isSelected}
            />
          </li>
        );
      })}
    </ul>
  );
}
