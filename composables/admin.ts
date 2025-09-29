import { useLoggedInUser } from "@/stores/StoreAuth";
import type { AdminPermission } from "@/types/types";

export const PERMISSIONS: { [key: string]: number } = {
  appearance: 1,
  config: 2,
  content: 3,
  users: 4,
  boards: 5,
  emoji: 2,
  full: 6,
  owner: 7,
  system: 8,
};

export const requirePermission = (permission: AdminPermission) => {
  const u = useLoggedInUser();
  return (u.adminLevel ?? 0) >= PERMISSIONS[permission];
};

export const requireFullPerms = () => {
  const u = useLoggedInUser();
  return (u.adminLevel ?? 0) >= PERMISSIONS["full"];
};

export const requireOwnerPerms = () => {
  const u = useLoggedInUser();
  return (u.adminLevel ?? 0) >= PERMISSIONS["owner"];
};

export const createPermissionString = (adminLevel: number) => {
  if (adminLevel >= PERMISSIONS["system"]) {
    return "system";
  }

  if (adminLevel >= PERMISSIONS["owner"]) {
    return "owner";
  }

  if (adminLevel >= PERMISSIONS["full"]) {
    return "full permissions";
  }

  if (adminLevel === 0) {
    return "no permissions";
  }

  let perms = [];
  for (const [permission, level] of Object.entries(PERMISSIONS)) {
    if (adminLevel >= level) {
      perms.push(permission);
    }
  }

  return perms.join(", ");
};
