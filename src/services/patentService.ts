
import { supabase } from "@/integrations/supabase/client";
import { ApplicantData } from "@/utils/applicantSchema";

// Get patent applications for current user
export const getUserPatentApplications = async () => {
  const { data, error } = await supabase
    .from('patent_applications')
    .select('*')
    .order('updated_at', { ascending: false });
    
  if (error) {
    throw new Error(`Error fetching patent applications: ${error.message}`);
  }
  
  return data;
};

// Get a single patent application by id
export const getPatentApplication = async (id: string) => {
  const { data, error } = await supabase
    .from('patent_applications')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    throw new Error(`Error fetching patent application: ${error.message}`);
  }
  
  return data;
};

// Create a new patent application
export const createPatentApplication = async (formData: any) => {
  const { data, error } = await supabase
    .from('patent_applications')
    .insert([formData])
    .select();
    
  if (error) {
    throw new Error(`Error creating patent application: ${error.message}`);
  }
  
  return data[0];
};

// Update an existing patent application
export const updatePatentApplication = async (id: string, formData: any) => {
  const { data, error } = await supabase
    .from('patent_applications')
    .update(formData)
    .eq('id', id)
    .select();
    
  if (error) {
    throw new Error(`Error updating patent application: ${error.message}`);
  }
  
  return data[0];
};

// Delete a patent application
export const deletePatentApplication = async (id: string) => {
  const { error } = await supabase
    .from('patent_applications')
    .delete()
    .eq('id', id);
    
  if (error) {
    throw new Error(`Error deleting patent application: ${error.message}`);
  }
  
  return true;
};

// Convert form data to applicant data format for document generation
export const formDataToApplicantData = (formData: any): ApplicantData => {
  return {
    application_type: formData.application_type as 'ordinary' | 'convention' | 'pct-np' | 'pph',
    application_no: formData.id || `IN${new Date().getFullYear()}${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
    filing_date: new Date(formData.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    fee_paid: "₹9,000",
    cbr_no: `CBR-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
    applicant_name: formData.applicant_name,
    applicant_nationality: formData.applicant_nationality,
    applicant_address: formData.applicant_address,
    applicant_category: formData.applicant_type === 'individual' ? 'natural_person' : 'organization',
    
    inventor_is_applicant: formData.applicant_type === "individual" && formData.applicant_name === formData.inventor_name,
    inventor_name: formData.inventor_name,
    inventor_nationality: formData.inventor_nationality,
    inventor_address: formData.inventor_address,
    
    title_of_invention: formData.title,
    abstract: formData.abstract || "",
    claims: formData.claims || "",
    description: formData.description || formData.additional_info || "",
    background: formData.background || "",
    
    declaration_of_inventorship: false,
    declaration_of_ownership: false,
    
    provisional_specification: false,
    complete_specification: false,
    drawings: false,
    sequence_listing: false,
    
    invention_field: "",
    prior_art: "",
    problem_addressed: "",
    proposed_solution: "",
    advantages: "",
  };
};
