
import { z } from "zod";

// Common validation functions used across multiple schemas
export const nonEmptyString = z.string().min(1, "This field is required");
export const emailValidation = z.string().email("Please enter a valid email address");
export const phoneValidation = z.string().min(10, "Please enter a valid phone number");
