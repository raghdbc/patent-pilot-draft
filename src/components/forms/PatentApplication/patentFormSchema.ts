
// Re-export everything from our schema files
export * from "./schemas/patentFormSchema";
export * from "./schemas/inventorSchema";
export * from "./schemas/applicantSchema";
export * from "./schemas/serviceSchema";
export * from "./schemas/documentSchema";
export * from "./schemas/commonValidation";

// Fix for duplicate export - import and re-export with explicit name
import { emptyValuesFactory } from "./schemas/initialValues";
export { emptyValuesFactory };
