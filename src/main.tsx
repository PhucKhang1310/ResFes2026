import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import AppRouter from "./AppRouter.tsx";
import AppAccessibility from "./components/accessibility/AppAccessibility.tsx";
import { PageContentProvider } from "./context/PageContentContext.tsx";
import { UserProvider } from "./hook/useUser.ts";
import AppErrorBoundary from "./components/errors/AppErrorBoundary.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <AppAccessibility />
        <UserProvider>
          <PageContentProvider>
            <AppRouter />
          </PageContentProvider>
        </UserProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  </StrictMode>,
);
