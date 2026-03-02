import { http, HttpResponse } from "msw";
import {
  applicants,
  createApplicant,
  updateApplicant,
  deleteApplicant,
} from "../data/applicantsDb";
import type {
  Applicant,
  ApplicantStatus,
} from "@/domain/applicants/applicant.model";

type ApplicantsListResponse = {
  data: Applicant[];
  meta: {
    total: number;
    page: number;
    perPage: number;
  };
};

const parseNumber = (value: string | null, fallback: number): number => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const normalize = (s: string) =>
  s.toLowerCase().replace(/ё/g, "е").replace(/й/g, "и");

export const applicantsHandlers = [
  http.get<never, never, ApplicantsListResponse>(
    "/api/applicants",
    ({ request }) => {
      const url = new URL(request.url);

      const search = normalize(url.searchParams.get("search") || "");
      const status = url.searchParams.get("status") as ApplicantStatus | null;
      const sortBy = url.searchParams.get("sortBy") || "createdAt";
      const sortOrder =
        url.searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
      const page = parseNumber(url.searchParams.get("page"), 1);
      const perPage = parseNumber(url.searchParams.get("perPage"), 10);

      let items = [...applicants];

      if (search) {
        items = items.filter((item) =>
          normalize(item.fullName).includes(search)
        );
      }

      if (status) {
        items = items.filter((item) => item.status === status);
      }

      items.sort((a, b) => {
        const direction = sortOrder === "asc" ? 1 : -1;

        if (sortBy === "fullName") {
          return a.fullName.localeCompare(b.fullName) * direction;
        }

        if (sortBy === "createdAt") {
          return (
            (a.createdAt || "").localeCompare(b.createdAt || "") * direction
          );
        }

        return 0;
      });

      const total = items.length;
      const start = (page - 1) * perPage;
      const end = start + perPage;
      const paginated = items.slice(start, end);

      const response: ApplicantsListResponse = {
        data: paginated,
        meta: {
          total,
          page,
          perPage,
        },
      };

      return HttpResponse.json<ApplicantsListResponse>(response);
    }
  ),

  http.post<never, Partial<Applicant>, Applicant | { message: string }>(
    "/api/applicants",
    async ({ request }) => {
      const body = (await request.json()) as Partial<Applicant>;

      if (!body.fullName || !body.phone || !body.status) {
        return HttpResponse.json<{ message: string }>(
          { message: "fullName, phone и status обязательны" },
          { status: 400 }
        );
      }

      const applicant = createApplicant({
        fullName: body.fullName,
        phone: body.phone,
        status: body.status as ApplicantStatus,
      });

      return HttpResponse.json<Applicant>(applicant, { status: 201 });
    }
  ),

  http.put<{ id: string }, Partial<Applicant>, Applicant | { message: string }>(
    "/api/applicants/:id",
    async ({ params, request }) => {
      const id = Number(params.id);

      if (!Number.isFinite(id)) {
        return HttpResponse.json<{ message: string }>(
          { message: "Некорректный id" },
          { status: 400 }
        );
      }

      const body = (await request.json()) as Partial<Applicant>;

      const patch: Partial<Applicant> = {};

      if (body.fullName !== undefined) {
        patch.fullName = body.fullName;
      }

      if (body.phone !== undefined) {
        patch.phone = body.phone;
      }

      if (body.status !== undefined) {
        patch.status = body.status as ApplicantStatus;
      }

      const updated = updateApplicant(id, patch);

      if (!updated) {
        return HttpResponse.json<{ message: string }>(
          { message: "Заявитель не найден" },
          { status: 404 }
        );
      }

      return HttpResponse.json<Applicant>(updated);
    }
  ),

  http.delete<{ id: string }, never, { success: boolean; message?: string }>(
    "/api/applicants/:id",
    ({ params }) => {
      const id = Number(params.id);

      if (!Number.isFinite(id)) {
        return HttpResponse.json<{ success: boolean; message?: string }>(
          { success: false, message: "Некорректный id" },
          { status: 400 }
        );
      }

      const removed = deleteApplicant(id);

      if (!removed) {
        return HttpResponse.json<{ success: boolean; message?: string }>(
          { success: false, message: "Заявитель не найден" },
          { status: 404 }
        );
      }

      return HttpResponse.json<{ success: boolean; message?: string }>({
        success: true,
      });
    }
  ),
];
