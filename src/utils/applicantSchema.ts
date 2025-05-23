
// This is a re-export file to maintain backward compatibility
// with existing imports in other files
import { applicantSchema } from "@/components/forms/PatentApplication/schemas/applicantSchema";
export { applicantSchema };
export * from "@/components/forms/PatentApplication/schemas/applicantSchema";

// Define the ApplicantData type needed by various services
export interface ApplicantData {
  application_type: 'ordinary' | 'convention' | 'pct-np' | 'pph';
  application_no: string;
  filing_date: string;
  fee_paid: string;
  cbr_no: string;
  
  applicant_name: string;
  applicant_nationality: string;
  applicant_address: string;
  applicant_category: 'natural_person' | 'startup' | 'small_entity' | 'others';
  
  inventor_is_applicant: boolean;
  inventor_name: string;
  inventor_nationality: string;
  inventor_address: string;
  
  title_of_invention: string;
  abstract: string;
  claims: string;
  description: string;
  background: string;
  
  declaration_of_inventorship: boolean;
  declaration_of_ownership: boolean;
  
  provisional_specification: boolean;
  complete_specification: boolean;
  drawings: boolean;
  sequence_listing: boolean;
  
  invention_field: string;
  prior_art: string;
  problem_addressed: string;
  proposed_solution: string;
  advantages: string;
  
  enhanced_abstract?: string;
  enhanced_description?: string;
  enhanced_background?: string;
  enhanced_claims?: string;
}
