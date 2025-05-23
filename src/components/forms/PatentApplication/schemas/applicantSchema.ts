
import { z } from "zod";
import { nonEmptyString } from "./commonValidation";
import { ApplicantCategory } from "@/models/patentApplication";

// Applicant validation schema
export const applicantSchema = z.object({
  name: nonEmptyString,
  nationality: nonEmptyString,
  residency: nonEmptyString,
  state: z.string().optional(),
  address: nonEmptyString,
  category: z.enum([
    "natural_person", 
    "startup", 
    "small_entity", 
    "large_entity", 
    "education_institute", 
    "govt_entity", 
    "woman"
  ]),
});

export type ApplicantSchema = z.infer<typeof applicantSchema>;
