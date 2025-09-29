//import { useLoggedInUser } from "@/stores/StoreAuth";
import type { ModPermission } from "@/types/types";

export const MOD_PERMISSIONS: { [key: string]: number } = {
  none: 0,
  config: 2,
  appearance: 4,
  content: 8,
  users: 16,
  emoji: 32,
  full: 64
};

/**
 * Check if a user has the given moderator permission.
 * @param modPermissions The mod permissions of the user.
 * @param permission The permission to check for.
 * @returns Whether the user has the permission.
 */
export const requireModPermission = (modPermissions: number, permission: ModPermission): boolean => {
  return (
    (modPermissions &
      (MOD_PERMISSIONS[permission] + MOD_PERMISSIONS["full"])) >
    0
  );
};

/**
 * Check if a user has full mod permissions.
 * @param modPermissions The mod permissions of the user.
 * @returns Whether the user has full mod permissions.
 */
export const requireFullModPerms = (modPermissions: number): boolean => {
  return (modPermissions & (MOD_PERMISSIONS["full"])) > 0;
};

/**
 * Create a string describing the mod permissions of a user.
 * @param modPermissions The user's mod permissions.
 * @returns A string listing the user's mod permissions. Can also be "no permissions" and "full permissions".
 */
export const createModPermissionString = (modPermissions: number): string => {
  if (modPermissions === 0) {
    return "no permissions";
  }

  if (modPermissions & MOD_PERMISSIONS["full"]) {
    return "full permissions";
  }

  let perms = [];
  for (const [permission, code] of Object.entries(MOD_PERMISSIONS)) {
    if (modPermissions & code) {
      perms.push(permission);
    }
  }

  return perms.join(",");
};
