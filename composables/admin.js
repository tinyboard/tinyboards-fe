import { useLoggedInUser } from "@/stores/StoreAuth";

export const PERMISSIONS = {
  appearance: 2,
  config: 4,
  content: 8,
  users: 16,
  boards: 32,
  full: 64,
  owner: 128,
  system: 256,
};

export const requirePermission = (permission) => {
  const u = useLoggedInUser();

  return (
    (u.adminLevel &
      (PERMISSIONS[permission] + PERMISSIONS["full"] + PERMISSIONS["owner"])) >
    0
  );
};

export const requireFullPerms = () => {
  const u = useLoggedInUser();

  return (u.adminLevel & (PERMISSIONS["full"] + PERMISSIONS["owner"])) > 0;
};

export const requireOwnerPerms = () => {
  const u = useLoggedInUser();

  return (u.adminLevel & PERMISSIONS["owner"]) > 0;
};

export const createPermissionString = (adminLevel) => {
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
