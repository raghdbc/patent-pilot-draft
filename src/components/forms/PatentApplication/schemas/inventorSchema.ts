
import { z } from "zod";
import { nonEmptyString } from "./commonValidation";

// Inventor validation schema
export const inventorSchema = z.object({
  name: nonEmptyString,
  gender: z.enum(["male", "female", "others", "prefer_not_to_say"]),
  nationality: nonEmptyString,
  residency: nonEmptyString,
  state: z.string().optional(),
  address: nonEmptyString,
});

export type InventorSchema = z.infer<typeof inventorSchema>;
