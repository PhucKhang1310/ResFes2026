
import { StrictMode, Suspense, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Mentor from "./pages/mentor/Mentor.tsx";
import MentorSubmission from "./pages/mentor/MentorSubmission.tsx";
import NewsList from "./pages/news/NewsList.tsx";
import NewsDetail from "./pages/news/NewsDetail.tsx";
import PostNews from "./pages/news/postNews.tsx";
import PublicationDetail from "./pages/publications/PublicationDetail.tsx";
import PublicationSubmission from "./pages/publications/PublicationSubmission.tsx";
import PublicationsList from "./pages/publications/PublicationsList.tsx";
import SubmissionPage from "./pages/submission/SubmissionPage.tsx";
import RegistrationPage from "./components/registration/RegistrationPage.tsx";
import LoginPage from "./pages/authentication/Login.tsx";
import SignUp from "./pages/authentication/Signup.tsx";
import { PageContentProvider } from "./context/PageContentContext.tsx";
import { UserProvider } from "./hook/useUser.ts";
import AdminRoute from "./components/auth/AdminRoute.tsx";
import LoadingPage from "./components/loading/LoadingPage.tsx";
import {
  AdminDashboardPage,
  AdminPage,
  AuditLogPage,
  MediaLibraryPage,
  MentorAdminPage,
  NewsAdminPage,
  NewsEditAdminPage,
  NewsUploadAdminPage,
  PublicationAdminPage,
  SemesterAdminPage,
  SemesterCreatePage,
  SemesterEditPage,
  SubmissionReviewAdminPage,
} from "./pages/admin/lazyAdminPages.tsx";

const adminElement = (children: ReactNode) => (
  <Suspense fallback={<LoadingPage />}>
    <AdminRoute>{children}</AdminRoute>
  </Suspense>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <PageContentProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/mentors" element={<Mentor />} />
            <Route path="/news-list" element={<NewsList />} />
            <Route path="/news-list/:id" element={<NewsDetail />} />
            <Route path="/post-news" element={<PostNews />} />
            <Route path="/publications" element={<PublicationsList />} />
            <Route path="/publications/:id" element={<PublicationDetail />} />
            <Route path="/submit" element={<SubmissionPage />} />
            <Route path="/submit/publication" element={<PublicationSubmission />} />
            <Route path="/submit/mentor" element={<MentorSubmission />} />

            <Route path="/admin" element={adminElement(<AdminDashboardPage />)} />
            <Route path="/admin/layout" element={adminElement(<AdminPage />)} />
            <Route path="/admin/news" element={adminElement(<NewsAdminPage />)} />
            <Route path="/admin/news/upload" element={adminElement(<NewsUploadAdminPage />)} />
            <Route path="/admin/news/:id/edit" element={adminElement(<NewsEditAdminPage />)} />
            <Route path="/admin/submissions" element={adminElement(<SubmissionReviewAdminPage />)} />
            <Route path="/admin/mentors" element={adminElement(<MentorAdminPage />)} />
            <Route path="/admin/publications" element={adminElement(<PublicationAdminPage />)} />
            <Route path="/admin/semesters" element={adminElement(<SemesterAdminPage />)} />
            <Route path="/admin/semesters/new" element={adminElement(<SemesterCreatePage />)} />
            <Route path="/admin/semesters/:id/edit" element={adminElement(<SemesterEditPage />)} />
            <Route path="/admin/media" element={adminElement(<MediaLibraryPage />)} />
            <Route path="/admin/audit-logs" element={adminElement(<AuditLogPage />)} />

            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageContentProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
