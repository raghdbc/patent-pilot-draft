
import { z } from "zod";

export const form1Schema = z.object({
  // Basic information
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  applicantType: z.enum(["individual", "organization", "startup", "small_entity"]),
  applicationType: z.enum(["ordinary", "convention", "pct-np", "pph"]).default("ordinary"),
  
  // Applicant details
  applicantName: z.string().min(2, { message: "Applicant name is required." }),
  applicantAddress: z.string().min(5, { message: "Complete address is required." }),
  applicantNationality: z.string().min(2, { message: "Nationality is required." }),
  
  // Inventor details
  inventorName: z.string().min(2, { message: "Inventor name is required." }),
  inventorAddress: z.string().min(5, { message: "Complete address is required." }),
  inventorNationality: z.string().min(2, { message: "Nationality is required." }),
  inventorAsApplicant: z.boolean().default(true),
  
  // Priority claims
  claimPriority: z.boolean().default(false),
  priorityDetails: z.string().optional(),
  priorityCountry: z.string().optional(),
  priorityApplicationNumber: z.string().optional(),
  priorityFilingDate: z.string().optional(),
  
  // Fee calculation fields
  claimCount: z.string().default("1"),
  drawingCount: z.string().default("0"),
  sheetCount: z.number().default(0),
  fees: z.number().default(0),
  feeDetails: z.object({
    baseFee: z.number(),
    excessClaimFee: z.number(),
    excessSheetFee: z.number(),
    online: z.boolean(),
    excessClaims: z.number(),
    excessSheets: z.number(),
  }).optional(),
  
  // Publication preference
  publicationPreference: z.enum(["ordinary", "expedited"]).default("ordinary"),
  
  // Additional information
  additionalInfo: z.string().optional(),
  
  // Declarations
  declarationOfInventorship: z.boolean().default(false),
  declarationOfOwnership: z.boolean().default(false),
  
  // Attachments
  provisionalSpecification: z.boolean().default(false),
  completeSpecification: z.boolean().default(false),
  drawings: z.boolean().default(false),
  sequenceListing: z.boolean().default(false),
});

export type Form1Values = z.infer<typeof form1Schema>;
