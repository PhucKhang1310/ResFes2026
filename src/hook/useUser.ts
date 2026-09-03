import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import {
  getCurrentUser,
  logout as logoutRequest,
  type CurrentUser,
} from "../api/authApi";

type UserContextValue = {
  user: CurrentUser | null;
  isLoading: boolean;
  authError: string | null;
  login: (user: CurrentUser) => void;
  logout: () => Promise<void>;
};

const UserContext = React.createContext<UserContextValue | undefined>(
  undefined,
);

const UserProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    window.sessionStorage.removeItem("resfes-user-token");

    const controller = new AbortController();

    getCurrentUser(controller.signal)
      .then((currentUser) => {
        setUser(currentUser);
        setAuthError(null);
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") {
          setUser(null);
          setAuthError("Authentication service is temporarily unavailable.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const login = useCallback((user: CurrentUser) => {
    setUser(user);
    setAuthError(null);
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
    setAuthError(null);
  }, []);

  const contextValue = useMemo(
    () => ({ user, isLoading, authError, login, logout }),
    [user, isLoading, authError, login, logout],
  );

  return React.createElement(UserContext.Provider, {
    value: contextValue,
    children,
  });
};

const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

export { UserProvider, useUser };
