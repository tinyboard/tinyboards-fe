//import { useLoggedInUser } from "@/stores/StoreAuth";

export const MOD_PERMISSIONS = {
  none: 0,
  config: 2,
  appearance: 4,
  content: 8,
  users: 16,
  full: 32
};

export const requireModPermission = (mod_permissions, permission) => {
  //const u = useLoggedInUser();

  return (
    (mod_permissions &
      (MOD_PERMISSIONS[permission] + MOD_PERMISSIONS["full"])) >
    0
  );
};

export const requireFullModPerms = (mod_permissions) => {
  //const u = useLoggedInUser();

  return (mod_permissions & (MOD_PERMISSIONS["full"])) > 0;
};

export const createModPermissionString = (mod_permissions) => {
  if (mod_permissions === 0) {
    return "no permissions";
  }

  if (mod_permissions & MOD_PERMISSIONS["full"]) {
    return "full permissions";
  }

  let perms = [];
  for (const [permission, code] of Object.entries(MOD_PERMISSIONS)) {
    if (mod_permissions & code) {
      perms.push(permission);
    }
  }

  return perms.join(",");
};
