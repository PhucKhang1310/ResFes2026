import { lazy } from "react";

const loadAdminPages = () => import("./AdminComboExport.tsx");

export const AdminDashboardPage = lazy(() =>
  loadAdminPages().then((comp) => ({ default: comp.AdminDashboardPage })),
);
export const AdminPage = lazy(() =>
  loadAdminPages().then((comp) => ({ default: comp.AdminPage })),
);
export const NewsAdminPage = lazy(() =>
  loadAdminPages().then((comp) => ({ default: comp.NewsAdminPage })),
);
export const NewsEditAdminPage = lazy(() =>
  loadAdminPages().then((comp) => ({ default: comp.NewsEditAdminPage })),
);
export const NewsUploadAdminPage = lazy(() =>
  loadAdminPages().then((comp) => ({ default: comp.NewsUploadAdminPage })),
);
export const SubmissionReviewAdminPage = lazy(() =>
  loadAdminPages().then((comp) => ({ default: comp.SubmissionReviewAdminPage })),
);
export const MentorAdminPage = lazy(() =>
  loadAdminPages().then((comp) => ({ default: comp.MentorAdminPage })),
);
export const PublicationAdminPage = lazy(() =>
  loadAdminPages().then((comp) => ({ default: comp.PublicationAdminPage })),
);
export const SemesterAdminPage = lazy(() =>
  loadAdminPages().then((comp) => ({ default: comp.SemesterAdminPage })),
);
export const SemesterCreatePage = lazy(() =>
  loadAdminPages().then((comp) => ({ default: comp.SemesterCreatePage })),
);
export const SemesterEditPage = lazy(() =>
  loadAdminPages().then((comp) => ({ default: comp.SemesterEditPage })),
);
export const MediaLibraryPage = lazy(() =>
  loadAdminPages().then((comp) => ({ default: comp.MediaLibraryPage })),
);
export const AuditLogPage = lazy(() =>
  loadAdminPages().then((comp) => ({ default: comp.AuditLogPage })),
);
