import type { ReactNode } from "react";
import type { Permission } from "../../config/permissions";
import { usePermissions } from "../../hook/usePermissions";

const PermissionGate = ({
  children,
  fallback = null,
  permission,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  permission: Permission;
}) => {
  const { can } = usePermissions();

  return can(permission) ? children : fallback;
};

export default PermissionGate;
