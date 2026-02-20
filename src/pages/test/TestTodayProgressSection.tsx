import TodayProgressSection from "@/features/Team/TodayProgressSection/TodayProgressSection";
import { FetchBoundary } from "@/providers/boundary";

export default function TestProgressSection() {
  return (
    <FetchBoundary>
      <TodayProgressSection groupId={3818} />
    </FetchBoundary>
  );
}
