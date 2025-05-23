import { z } from "zod";

// Sheet count validation schema
export const sheetCountSchema = z.object({
  patentDocumentSheets: z.coerce.number().min(0),
  abstractSheets: z.coerce.number().min(0),
  claimsSheets: z.coerce.number().min(0),
  drawingSheets: z.coerce.number().min(0),
});

// Other details validation schema
export const otherDetailsSchema = z.object({
  numberOfClaims: z.coerce.number().min(0),
  numberOfDrawings: z.coerce.number().min(0),
});

// Fee object schema
export const feeSchema = z.object({
  online: z.string().optional(),
  offline: z.string().optional(),
});

export type SheetCountSchema = z.infer<typeof sheetCountSchema>;
export type OtherDetailsSchema = z.infer<typeof otherDetailsSchema>;
export type FeeSchema = z.infer<typeof feeSchema>;
