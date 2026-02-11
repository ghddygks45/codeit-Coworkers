import { useState } from "react";
import Chess from "@/assets/chess.svg";
import ArrowDown from "@/assets/arrow-down.svg";
import TeamListItem from "../shared/TeamListItem";
import { useGnbStore } from "../useGnbStore";
import { useGroups } from "@/api/user";
import { Link, useParams } from "react-router-dom";

export default function DesktopTeamSelector() {
  const isFolded = useGnbStore((state) => state.isFolded);
  const [isOpen, setIsOpen] = useState(true);

  const { id: teamId } = useParams();
  const isTeamSelected = teamId !== undefined;

  const { data: group } = useGroups();

  if (isFolded) {
    const firstGroupId = group[0]?.id;

    return (
      <div className="flex justify-center">
        <Link
          to={`/team/${firstGroupId}`}
          className={`group hover:bg-brand-secondary flex h-[52px] w-[52px] items-center justify-center rounded-[12px] ${isTeamSelected ? "bg-brand-secondary" : ""}`}
        >
          <Chess
            className={`group-hover:text-brand-primary h-[24px] w-[24px] ${isTeamSelected ? "text-brand-primary" : "text-icon-gnb"}`}
          />
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group hover:bg-brand-secondary flex h-[36px] w-full items-center gap-3 px-4"
      >
        <Chess
          className={`group-hover:text-brand-primary text-icon-gnb h-[20px] w-[20px] ${isOpen ? "text-brand-primary" : "text-icon-gnb"}`}
        />
        <span
          className={`text-lg-sb group-hover:text-brand-primary flex-1 text-left ${isOpen ? "text-brand-primary" : "text-color-disabled"} transition-opacity duration-1000 ${isFolded ? "opacity-0" : "opacity-100"}`}
        >
          팀 선택
        </span>
        <ArrowDown
          className={`h-[20px] w-[20px] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`mt-2 grid transition-all duration-200 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <ul className="mb-2 min-w-0 space-y-2 overflow-hidden">
          {group.map((group) => {
            const isSelected = Number(teamId) === group.id;
            return (
              <li key={group.id}>
                <TeamListItem
                  name={group.name}
                  id={group.id}
                  isSelected={isSelected}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
