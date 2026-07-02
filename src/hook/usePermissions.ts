import { hasPermission, type Permission } from "../config/permissions";
import { useUser } from "./useUser";

export const usePermissions = () => {
  const { user } = useUser();

  return {
    role: user?.role,
    can: (permission: Permission) => hasPermission(user?.role, permission),
  };
};
