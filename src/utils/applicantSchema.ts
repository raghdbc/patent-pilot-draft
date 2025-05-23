
// Define the ApplicantData type for use with document generation
export interface ApplicantData {
  application_type: 'ordinary' | 'convention' | 'pct-np' | 'pph';
  application_no: string;
  filing_date: string;
  fee_paid: string;
  cbr_no: string;
  
  // Applicant details
  applicant_name: string;
  applicant_nationality: string;
  applicant_address: string;
  applicant_category: 'natural_person' | 'startup' | 'small_entity' | 'others';
  
  // Inventor details
  inventor_is_applicant: boolean;
  inventor_name: string;
  inventor_nationality: string;
  inventor_address: string;
  
  // Patent content
  title_of_invention: string;
  abstract: string;
  claims: string;
  description: string;
  background: string;
  
  // Declarations
  declaration_of_inventorship: boolean;
  declaration_of_ownership: boolean;
  
  // Attachments
  provisional_specification: boolean;
  complete_specification: boolean;
  drawings: boolean;
  sequence_listing: boolean;
  
  // Optional enhanced content fields
  enhanced_abstract?: string;
  enhanced_description?: string;
  enhanced_background?: string;
  enhanced_claims?: string;
  
  // Additional fields
  invention_field: string;
  prior_art: string;
  problem_addressed: string;
  proposed_solution: string;
  advantages: string;
}
