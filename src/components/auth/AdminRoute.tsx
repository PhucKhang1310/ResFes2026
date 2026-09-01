import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import LoadingPage from "../loading/LoadingPage";
import { useUser } from "../../hook/useUser";
import { hasPermission, type Permission } from "../../config/permissions";
import ForbiddenMessage from "./ForbiddenMessage";

const AdminRoute = ({
  children,
  permission,
}: {
  children: ReactNode;
  permission: Permission;
}) => {
  const { user, isLoading, authError } = useUser();

  if (isLoading) {
    return <LoadingPage label="Checking login status" />;
  }

  if (authError) {
    return (
      <main className="min-h-screen bg-black p-8 text-amber-50">
        <ForbiddenMessage message={authError} />
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!hasPermission(user.role, permission)) {
    return (
      <main className="min-h-screen bg-black p-8 text-amber-50">
        <ForbiddenMessage />
      </main>
    );
  }

  return children;
};

export default AdminRoute;
