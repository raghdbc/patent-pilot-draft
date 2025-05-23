
import { z } from "zod";
import { 
  ApplicationType, 
  ApplicantCategory, 
  ApplicantMode, 
  PublicationPreference,
  ExaminationPreference,
  YesNoOption
} from "@/models/patentApplication";

// Common validation functions
const nonEmptyString = z.string().min(1, "This field is required");
const emailValidation = z.string().email("Please enter a valid email address");
const phoneValidation = z.string().min(10, "Please enter a valid phone number");

// Inventor validation schema
const inventorSchema = z.object({
  name: nonEmptyString,
  gender: z.enum(["male", "female", "others", "prefer_not_to_say"]),
  nationality: nonEmptyString,
  residency: nonEmptyString,
  state: z.string().optional(),
  address: nonEmptyString,
});

// Applicant validation schema
const applicantSchema = z.object({
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

// Agent details validation schema
const agentDetailsSchema = z.object({
  inpaNo: nonEmptyString,
  agentName: nonEmptyString,
  agentMobile: phoneValidation,
  agentEmail: emailValidation,
});

// Address for service validation schema
const serviceAddressSchema = z.object({
  serviceName: nonEmptyString,
  postalAddress: nonEmptyString,
  telephone: z.string().optional(),
  mobile: phoneValidation,
  fax: z.string().optional(),
  email: emailValidation,
});

// Sheet count validation schema
const sheetCountSchema = z.object({
  patentDocumentSheets: z.coerce.number().min(0),
  abstractSheets: z.coerce.number().min(0),
  claimsSheets: z.coerce.number().min(0),
  drawingSheets: z.coerce.number().min(0),
});

// Other details validation schema
const otherDetailsSchema = z.object({
  numberOfClaims: z.coerce.number().min(0),
  numberOfDrawings: z.coerce.number().min(0),
});

// Fee object schema
const feeSchema = z.object({
  online: z.string().optional(),
  offline: z.string().optional(),
});

// Main patent application form schema
export const patentFormSchema = z.object({
  // 1. Application Type
  applicationType: z.enum(["provisional", "complete"]),
  previousProvisionalFiled: z.enum(["yes", "no"]).optional(),
  provisionalApplicationNumber: z.string().optional(),
  
  // 2. Inventor Details
  inventors: z.array(inventorSchema).min(1, "At least one inventor is required"),
  
  // 3. Pre-Configured Applicant
  wantToPreConfigure: z.enum(["yes", "no"]).optional(),
  preConfiguredApplicant: applicantSchema.optional(),
  
  // 4. Applicant Details
  applicantMode: z.enum(["no_applicant_configured", "fixed", "fixed_plus"]),
  applicants: z.object({
    fixed: applicantSchema.optional(),
    fromInventors: z.array(z.string()).optional(),
    additionalApplicants: z.array(applicantSchema).optional(),
  }),
  
  // 5. Application Details
  title: nonEmptyString.min(5, "Title must be at least 5 characters"),
  sheetCounts: sheetCountSchema,
  
  // 6. Others
  others: otherDetailsSchema,
  
  // Fee calculation fields
  excessSheetFee: feeSchema.optional(),
  excessClaimFee: feeSchema.optional(),
  
  // 7. Publication Preference
  publicationPreference: z.enum(["ordinary", "early"]).optional(),
  earlyPublicationFee: feeSchema.optional(),
  
  // 8. Examination Preference
  examinationPreference: z.enum(["ordinary", "expedited"]).optional(),
  expeditedAllowed: z.boolean().optional(),
  expeditedReason: z.string().optional(),
  
  // 9. Agent Details
  agentDetails: agentDetailsSchema,
  
  // 10. Address for Service in India
  addressForService: serviceAddressSchema,
})
.superRefine((data, ctx) => {
  // If applicationType is complete, previousProvisionalFiled must be defined
  if (data.applicationType === "complete" && data.previousProvisionalFiled === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify if a provisional application has been filed",
      path: ["previousProvisionalFiled"],
    });
  }
  
  // If previousProvisionalFiled is yes, provisionalApplicationNumber must be defined
  if (
    data.applicationType === "complete" && 
    data.previousProvisionalFiled === "yes" &&
    !data.provisionalApplicationNumber
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Provisional application number is required",
      path: ["provisionalApplicationNumber"],
    });
  }
  
  // If applicationType is complete, publicationPreference must be defined
  if (data.applicationType === "complete" && data.publicationPreference === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Publication preference is required for complete applications",
      path: ["publicationPreference"],
    });
  }
  
  // If applicationType is complete, examinationPreference must be defined
  if (data.applicationType === "complete" && data.examinationPreference === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Examination preference is required for complete applications",
      path: ["examinationPreference"],
    });
  }
  
  // If wantToPreConfigure is yes, preConfiguredApplicant must be defined
  if (data.wantToPreConfigure === "yes" && data.preConfiguredApplicant === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please complete the pre-configured applicant details",
      path: ["preConfiguredApplicant"],
    });
  }
  
  // If applicantMode is fixed or fixed_plus, and wantToPreConfigure is yes, preConfiguredApplicant must be defined
  if (
    (data.applicantMode === "fixed" || data.applicantMode === "fixed_plus") && 
    data.wantToPreConfigure === "yes" &&
    data.preConfiguredApplicant === undefined
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Pre-configured applicant is required for Fixed or Fixed++ modes",
      path: ["preConfiguredApplicant"],
    });
  }
  
  // If applicantMode is fixed, we must have a fixed applicant
  if (data.applicantMode === "fixed" && !data.applicants.fixed) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "A fixed applicant must be selected for Fixed mode",
      path: ["applicants", "fixed"],
    });
  }
  
  // If applicantMode is fixed_plus, we must have both fixed and at least either fromInventors or additionalApplicants
  if (
    data.applicantMode === "fixed_plus" && 
    (!data.applicants.fixed || 
      ((!data.applicants.fromInventors || data.applicants.fromInventors.length === 0) && 
       (!data.applicants.additionalApplicants || data.applicants.additionalApplicants.length === 0)))
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Fixed++ mode requires a fixed applicant and at least one additional applicant selection",
      path: ["applicants"],
    });
  }
});

export type PatentFormValues = z.infer<typeof patentFormSchema>;

// Initialize empty form values
export const emptyPatentFormValues: Partial<PatentFormValues> = {
  applicationType: "provisional",
  inventors: [
    {
      name: "",
      gender: "prefer_not_to_say",
      nationality: "Indian",
      residency: "Indian",
      state: "",
      address: ""
    }
  ],
  wantToPreConfigure: "no",
  applicantMode: "no_applicant_configured",
  applicants: {
    fromInventors: [],
    additionalApplicants: []
  },
  title: "",
  sheetCounts: {
    patentDocumentSheets: 0,
    abstractSheets: 0,
    claimsSheets: 0,
    drawingSheets: 0
  },
  others: {
    numberOfClaims: 0,
    numberOfDrawings: 0
  },
  agentDetails: {
    inpaNo: "",
    agentName: "",
    agentMobile: "",
    agentEmail: ""
  },
  addressForService: {
    serviceName: "",
    postalAddress: "",
    telephone: "",
    mobile: "",
    email: ""
  }
};
