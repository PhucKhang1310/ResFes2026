import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoadingPage from "./components/loading/LoadingPage.tsx";
import type { Permission } from "./config/permissions.ts";
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

const App = lazy(() => import("./App.tsx"));
const Mentor = lazy(() => import("./pages/mentor/Mentor.tsx"));
const MentorSubmission = lazy(() => import("./pages/mentor/MentorSubmission.tsx"));
const NewsList = lazy(() => import("./pages/news/NewsList.tsx"));
const NewsDetail = lazy(() => import("./pages/news/NewsDetail.tsx"));
const PostNews = lazy(() => import("./pages/news/postNews.tsx"));
const PublicationDetail = lazy(() => import("./pages/publications/PublicationDetail.tsx"));
const PublicationSubmission = lazy(() => import("./pages/publications/PublicationSubmission.tsx"));
const PublicationsList = lazy(() => import("./pages/publications/PublicationsList.tsx"));
const SubmissionPage = lazy(() => import("./pages/submission/SubmissionPage.tsx"));
const RegistrationPage = lazy(() => import("./components/registration/RegistrationPage.tsx"));
const LoginPage = lazy(() => import("./pages/authentication/Login.tsx"));
const SignUp = lazy(() => import("./pages/authentication/Signup.tsx"));
const AdminRoute = lazy(() => import("./components/auth/AdminRoute.tsx"));

const protectedRoute = (permission: Permission, page: React.ReactNode) => (
  <AdminRoute permission={permission}>{page}</AdminRoute>
);

const AppRouter = () => (
  <div id="main-content" tabIndex={-1}>
    <Suspense fallback={<LoadingPage label="Loading page" />}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/mentors" element={<Mentor />} />
        <Route path="/news-list" element={<NewsList />} />
        <Route path="/news-list/:id" element={<NewsDetail />} />
        <Route path="/post-news" element={protectedRoute("news.manage", <PostNews />)} />
        <Route path="/publications" element={<PublicationsList />} />
        <Route path="/publications/:id" element={<PublicationDetail />} />
        <Route path="/submit" element={<SubmissionPage />} />
        <Route path="/submit/publication" element={<PublicationSubmission />} />
        <Route path="/submit/mentor" element={<MentorSubmission />} />
        <Route path="/admin" element={protectedRoute("dashboard.read", <AdminDashboardPage />)} />
        <Route path="/admin/layout" element={protectedRoute("content.read", <AdminPage />)} />
        <Route path="/admin/news" element={protectedRoute("news.manage", <NewsAdminPage />)} />
        <Route path="/admin/news/upload" element={protectedRoute("news.manage", <NewsUploadAdminPage />)} />
        <Route path="/admin/news/:id/edit" element={protectedRoute("news.manage", <NewsEditAdminPage />)} />
        <Route path="/admin/submissions" element={protectedRoute("submissions.review", <SubmissionReviewAdminPage />)} />
        <Route path="/admin/mentors" element={protectedRoute("mentors.manage", <MentorAdminPage />)} />
        <Route path="/admin/publications" element={protectedRoute("publications.manage", <PublicationAdminPage />)} />
        <Route path="/admin/semesters" element={protectedRoute("semesters.manage", <SemesterAdminPage />)} />
        <Route path="/admin/semesters/new" element={protectedRoute("semesters.manage", <SemesterCreatePage />)} />
        <Route path="/admin/semesters/:id/edit" element={protectedRoute("semesters.manage", <SemesterEditPage />)} />
        <Route path="/admin/media" element={protectedRoute("media.manage", <MediaLibraryPage />)} />
        <Route path="/admin/audit-logs" element={protectedRoute("audit.read", <AuditLogPage />)} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signupabcd" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </div>
);

export default AppRouter;
