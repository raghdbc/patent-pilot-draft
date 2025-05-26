
// This file defines the schema for applicant data that will be collected
// and used for document generation

export interface ApplicantData {
  // Form 1 - Basic Application Details
  application_type: 'ordinary' | 'convention' | 'pct-np' | 'pph';
  application_no: string;
  filing_date: string;
  fee_paid: string;
  cbr_no: string;

  // Applicant Information
  applicant_name: string;
  applicant_nationality: string;
  applicant_address: string;
  applicant_category: 'natural_person' | 'startup' | 'small_entity' | 'others';
  
  // Inventor Information
  inventor_is_applicant: boolean;
  inventor_name: string;
  inventor_address: string;
  inventor_nationality: string;
  
  // Patent Information
  title_of_invention: string;
  abstract: string;
  claims: string;
  description: string;
  background: string;
  
  // Declaration Fields
  declaration_of_inventorship: boolean;
  declaration_of_ownership: boolean;
  
  // Attachments
  provisional_specification: boolean;
  complete_specification: boolean;
  drawings: boolean;
  sequence_listing: boolean;
  
  // Draft Specific Fields
  invention_field: string;
  prior_art: string;
  problem_addressed: string;
  proposed_solution: string;
  advantages: string;
  
  // Generated Content (to be filled by OpenAI)
  enhanced_abstract?: string;
  enhanced_description?: string;
  enhanced_background?: string;
  enhanced_claims?: string;
}

export const emptyApplicantData: ApplicantData = {
  application_type: 'ordinary',
  application_no: '',
  filing_date: new Date().toISOString().split('T')[0],
  fee_paid: '',
  cbr_no: '',
  
  applicant_name: '',
  applicant_nationality: 'Indian',
  applicant_address: '',
  applicant_category: 'natural_person',
  
  inventor_is_applicant: true,
  inventor_name: '',
  inventor_address: '',
  inventor_nationality: 'Indian',
  
  title_of_invention: '',
  abstract: '',
  claims: '',
  description: '',
  background: '',
  
  declaration_of_inventorship: false,
  declaration_of_ownership: false,
  
  provisional_specification: false,
  complete_specification: false,
  drawings: false,
  sequence_listing: false,
  
  invention_field: '',
  prior_art: '',
  problem_addressed: '',
  proposed_solution: '',
  advantages: '',
};
