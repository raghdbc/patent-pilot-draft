
import { z } from "zod";
import { nonEmptyString, emailValidation, phoneValidation } from "./commonValidation";

// Agent details validation schema
export const agentDetailsSchema = z.object({
  inpaNo: nonEmptyString,
  agentName: nonEmptyString,
  agentMobile: phoneValidation,
  agentEmail: emailValidation,
});

// Address for service validation schema
export const serviceAddressSchema = z.object({
  serviceName: nonEmptyString,
  postalAddress: nonEmptyString,
  telephone: z.string().optional(),
  mobile: phoneValidation,
  fax: z.string().optional(),
  email: emailValidation,
});

export type AgentDetailsSchema = z.infer<typeof agentDetailsSchema>;
export type ServiceAddressSchema = z.infer<typeof serviceAddressSchema>;
