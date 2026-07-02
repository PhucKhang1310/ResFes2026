
import { StrictMode } from "react";
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
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.tsx";
import AdminPage from "./pages/admin/AdminPage.tsx";
import NewsAdminPage from "./pages/admin/NewsAdminPage.tsx";
import NewsEditAdminPage from "./pages/admin/NewsEditAdminPage.tsx";
import NewsUploadAdminPage from "./pages/admin/NewsUploadAdminPage.tsx";
import SubmissionReviewAdminPage from "./pages/admin/SubmissionReviewAdminPage.tsx";
import MentorAdminPage from "./pages/admin/MentorAdminPage.tsx";
import PublicationAdminPage from "./pages/admin/PublicationAdminPage.tsx";
import SemesterAdminPage from "./pages/admin/SemesterAdminPage.tsx";
import SemesterCreatePage from "./pages/admin/SemesterCreatePage.tsx";
import SemesterEditPage from "./pages/admin/SemesterEditPage.tsx";
import MediaLibraryPage from "./pages/admin/MediaLibraryPage.tsx";
import AuditLogPage from "./pages/admin/AuditLogPage.tsx";
import RegistrationPage from "./components/registration/RegistrationPage.tsx";
import LoginPage from "./pages/authentication/Login.tsx";
import SignUp from "./pages/authentication/Signup.tsx";
import { PageContentProvider } from "./context/PageContentContext.tsx";
import { UserProvider } from "./hook/useUser.ts";
import AdminRoute from "./components/auth/AdminRoute.tsx";

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

            <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
            <Route path="/admin/layout" element={<AdminRoute><AdminPage /></AdminRoute>} />
            <Route path="/admin/news" element={<AdminRoute><NewsAdminPage /></AdminRoute>} />
            <Route path="/admin/news/upload" element={<AdminRoute><NewsUploadAdminPage /></AdminRoute>} />
            <Route path="/admin/news/:id/edit" element={<AdminRoute><NewsEditAdminPage /></AdminRoute>} />
            <Route path="/admin/submissions" element={<AdminRoute><SubmissionReviewAdminPage /></AdminRoute>} />
            <Route path="/admin/mentors" element={<AdminRoute><MentorAdminPage /></AdminRoute>} />
            <Route path="/admin/publications" element={<AdminRoute><PublicationAdminPage /></AdminRoute>} />
            <Route path="/admin/semesters" element={<AdminRoute><SemesterAdminPage /></AdminRoute>} />
            <Route path="/admin/semesters/new" element={<AdminRoute><SemesterCreatePage /></AdminRoute>} />
            <Route path="/admin/semesters/:id/edit" element={<AdminRoute><SemesterEditPage /></AdminRoute>} />
            <Route path="/admin/media" element={<AdminRoute><MediaLibraryPage /></AdminRoute>} />
            <Route path="/admin/audit-logs" element={<AdminRoute><AuditLogPage /></AdminRoute>} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signupabc" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageContentProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
