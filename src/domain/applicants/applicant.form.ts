import { z } from "zod";
import { fullNameSchema, phoneRuSchema } from "@/shared/validation";
import { applicantStatusSchema } from "./applicant.model";

export const applicantFormSchema = z.object({
  fullName: fullNameSchema,
  phone: phoneRuSchema,
  status: applicantStatusSchema,
});

export type ApplicantFormInput = z.input<typeof applicantFormSchema>;

export type ApplicantFormOutput = z.output<typeof applicantFormSchema>;
