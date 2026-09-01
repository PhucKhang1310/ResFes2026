export type CmsRole =
  | "super_admin"
  | "admin"
  | "editor"
  | "reviewer"
  | "contributor"
  | "viewer"
  | "user";

export type Permission =
  | "dashboard.read"
  | "content.read"
  | "content.update"
  | "content.publish"
  | "semesters.manage"
  | "news.manage"
  | "news.publish"
  | "submissions.review"
  | "mentors.manage"
  | "publications.manage"
  | "media.manage"
  | "audit.read"
  | "users.manage";

const allPermissions: Permission[] = [
  "dashboard.read",
  "content.read",
  "content.update",
  "content.publish",
  "semesters.manage",
  "news.manage",
  "news.publish",
  "submissions.review",
  "mentors.manage",
  "publications.manage",
  "media.manage",
  "audit.read",
  "users.manage",
];

export const rolePermissions: Record<CmsRole, Permission[]> = {
  super_admin: allPermissions,
  admin: allPermissions.filter((permission) => permission !== "users.manage"),
  editor: [
    "dashboard.read",
    "content.read",
    "content.update",
    "news.manage",
    "media.manage",
  ],
  reviewer: [
    "dashboard.read",
    "content.read",
    "submissions.review",
    "news.manage",
  ],
  contributor: ["dashboard.read", "content.read", "content.update", "news.manage"],
  viewer: ["dashboard.read", "content.read"],
  user: [],
};

export const hasPermission = (
  role: string | undefined,
  permission: Permission,
) => {
  const normalizedRole = role as CmsRole | undefined;
  return normalizedRole
    ? (rolePermissions[normalizedRole] ?? []).includes(permission)
    : false;
};
