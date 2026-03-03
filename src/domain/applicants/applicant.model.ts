import { z } from "zod";

export const applicantStatusSchema = z.enum(["new", "in_work", "done"]);

export const applicantSchema = z.object({
  id: z.number(),
  fullName: z.string().min(1),
  phone: z.string(),
  status: applicantStatusSchema,
  createdAt: z.string(),
});

export type ApplicantStatus = z.infer<typeof applicantStatusSchema>;
export type Applicant = z.infer<typeof applicantSchema>;
