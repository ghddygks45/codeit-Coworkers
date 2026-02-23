import { useUser } from "@/api/user";

export function useIsAdmin(groupId: number) {
  const { data: user } = useUser();
  return user?.memberships.find((m) => m.groupId === groupId)?.role === "ADMIN";
}
