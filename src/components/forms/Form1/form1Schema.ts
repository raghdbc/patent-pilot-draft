
import { z } from "zod";

export const form1Schema = z.object({
  // Basic information
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  applicantType: z.enum(["individual", "organization"]),
  applicationType: z.enum(["ordinary", "convention", "pct-np", "pph"]).default("ordinary"),
  
  // This is a simplified schema - in a real implementation, 
  // we would have more detailed validation and nested objects
  applicantName: z.string().min(2),
  applicantAddress: z.string().min(5),
  applicantNationality: z.string().min(2),
  
  inventorName: z.string().min(2),
  inventorAddress: z.string().min(5),
  inventorNationality: z.string().min(2),
  
  claimPriority: z.boolean().default(false),
  priorityDetails: z.string().optional(),
  
  additionalInfo: z.string().optional(),
});

export type Form1Values = z.infer<typeof form1Schema>;
