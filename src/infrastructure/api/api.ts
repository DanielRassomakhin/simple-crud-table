import { http } from "./httpClient";
import type {
  Applicant,
  ApplicantStatus,
} from "@/domain/applicants/applicant.model";

export type ApplicantsQuery = {
  page?: number;
  perPage?: number;
  search?: string;
  status?: ApplicantStatus | "";
  sortBy?: "fullName" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export type ApplicantsListResponse = {
  data: Applicant[];
  meta: {
    total: number;
    page: number;
    perPage: number;
  };
};

export async function fetchApplicants(
  params: ApplicantsQuery = {},
): Promise<ApplicantsListResponse> {
  const { data } = await http.get<ApplicantsListResponse>("/applicants", {
    params,
  });
  return data;
}

export type ApplicantCreatePayload = {
  fullName: string;
  phone: string;
  status: ApplicantStatus;
};

export async function createApplicantApi(
  payload: ApplicantCreatePayload,
): Promise<Applicant> {
  const { data } = await http.post<Applicant>("/applicants", payload);
  return data;
}

export async function updateApplicantApi(
  id: number,
  payload: Partial<ApplicantCreatePayload>,
): Promise<Applicant> {
  const { data } = await http.put<Applicant>(`/applicants/${id}`, payload);
  return data;
}

export async function deleteApplicantApi(id: number): Promise<void> {
  await http.delete(`/applicants/${id}`);
}
