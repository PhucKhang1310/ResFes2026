import type { SemesterStatus } from "./cms";

export type Semester = {
  id: string;
  code: string;
  name: string;
  slug: string;
  status: SemesterStatus;
  startDate: string;
  endDate: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type SemesterInput = {
  code: string;
  name: string;
  slug: string;
  status?: SemesterStatus;
  startDate: string;
  endDate: string;
  description?: string;
};
