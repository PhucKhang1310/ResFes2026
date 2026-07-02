import {
  FaBoxArchive,
  FaFileLines,
  FaImages,
  FaInbox,
  FaLayerGroup,
  FaNewspaper,
  FaTableColumns,
  FaUserTie,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import type { Permission } from "./permissions";

export type AdminNavigationItem = {
  label: string;
  path: string;
  icon: IconType;
  permission: Permission;
};

export const adminNavigation: AdminNavigationItem[] = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: FaTableColumns,
    permission: "dashboard.read",
  },
  {
    label: "Layout",
    path: "/admin/layout",
    icon: FaLayerGroup,
    permission: "content.read",
  },
  {
    label: "News",
    path: "/admin/news",
    icon: FaNewspaper,
    permission: "news.manage",
  },
  {
    label: "Submissions",
    path: "/admin/submissions",
    icon: FaInbox,
    permission: "submissions.review",
  },
  {
    label: "Mentors",
    path: "/admin/mentors",
    icon: FaUserTie,
    permission: "mentors.manage",
  },
  {
    label: "Publications",
    path: "/admin/publications",
    icon: FaFileLines,
    permission: "publications.manage",
  },
  {
    label: "Semesters",
    path: "/admin/semesters",
    icon: FaBoxArchive,
    permission: "semesters.manage",
  },
  {
    label: "Media",
    path: "/admin/media",
    icon: FaImages,
    permission: "media.manage",
  },
  {
    label: "Audit Logs",
    path: "/admin/audit-logs",
    icon: FaFileLines,
    permission: "audit.read",
  },
];
