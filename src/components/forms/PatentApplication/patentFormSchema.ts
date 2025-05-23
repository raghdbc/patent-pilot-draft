
// Re-export everything from our schema files
export * from "./schemas/patentFormSchema";
export * from "./schemas/inventorSchema";
export * from "./schemas/applicantSchema";
export * from "./schemas/serviceSchema";
export * from "./schemas/documentSchema";
export * from "./schemas/commonValidation";

// Import and re-export with explicit name to avoid duplicate exports
import { emptyValuesFactory } from "./schemas/initialValues";
export { emptyValuesFactory };

// Export emptyPatentFormValues as a constant created from the factory function
export const emptyPatentFormValues = emptyValuesFactory();
