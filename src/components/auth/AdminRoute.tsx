import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import LoadingPage from "../loading/LoadingPage";
import { useUser } from "../../hook/useUser";

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <LoadingPage label="Checking login status" />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default AdminRoute;
