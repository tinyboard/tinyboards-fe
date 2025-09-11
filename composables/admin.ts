import { useLoggedInUser } from "@/stores/StoreAuth";
import type { AdminPermission } from "@/types/types";

export const PERMISSIONS: { [key: string]: number } = {
  appearance: 2,
  config: 4,
  content: 8,
  users: 16,
  boards: 32,
  full: 64,
  owner: 128,
  system: 256,
};

export const requirePermission = (permission: AdminPermission) => {
  const u = useLoggedInUser();
  return (
    ((u.adminLevel ?? 0) &
      (PERMISSIONS[permission] + PERMISSIONS["full"] + PERMISSIONS["owner"])) >
    0
  );
};

export const requireFullPerms = () => {
  const u = useLoggedInUser();

  return ((u.adminLevel ?? 0) & (PERMISSIONS["full"] + PERMISSIONS["owner"])) > 0;
};

export const requireOwnerPerms = () => {
  const u = useLoggedInUser();

  return ((u.adminLevel ?? 0) & PERMISSIONS["owner"]) > 0;
};

export const createPermissionString = (adminLevel: number) => {
  if (adminLevel & PERMISSIONS["system"]) {
    return "system";
  }

  if (adminLevel & PERMISSIONS["owner"]) {
    return "owner";
  }

  if (adminLevel & PERMISSIONS["full"]) {
    return "full permissions";
  }

  let perms = [];
  for (const [permission, code] of Object.entries(PERMISSIONS)) {
    if (adminLevel & code) {
      perms.push(permission);
    }
  }

  return perms.join(",");
};
