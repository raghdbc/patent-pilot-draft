
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

// Calculate fee based on entity type and application details
export const calculateApplicationFee = (applicantType: string, claimCount: number, sheetCount: number, isOnline: boolean) => {
  // Base fees
  let baseFee = 0;
  let excessClaimFee = 0;
  let excessSheetFee = 0;
  
  // Set base fee based on applicant type
  // Categories: natural_person (individual), startup, small_entity, others (large company)
  if (applicantType === 'natural_person' || applicantType === 'startup') {
    baseFee = isOnline ? 1600 : 1750;
    excessClaimFee = isOnline ? 320 : 350;
    excessSheetFee = isOnline ? 160 : 180;
  } else if (applicantType === 'small_entity') {
    baseFee = isOnline ? 4000 : 4400;
    excessClaimFee = isOnline ? 800 : 880;
    excessSheetFee = isOnline ? 400 : 440;
  } else {
    // For 'others' category
    baseFee = isOnline ? 8000 : 8800;
    excessClaimFee = isOnline ? 1600 : 1750;
    excessSheetFee = isOnline ? 800 : 880;
  }
  
  // Calculate excess claims fee (if claims > 10)
  const excessClaims = Math.max(0, claimCount - 10);
  const totalExcessClaimFee = excessClaims * excessClaimFee;
  
  // Calculate excess sheets fee (if sheets > 30)
  const excessSheets = Math.max(0, sheetCount - 30);
  const totalExcessSheetFee = excessSheets * excessSheetFee;
  
  // Total fee
  const totalFee = baseFee + totalExcessClaimFee + totalExcessSheetFee;
  
  return {
    baseFee,
    excessClaimFee: totalExcessClaimFee,
    excessSheetFee: totalExcessSheetFee,
    totalFee,
    online: isOnline,
    excessClaims,
    excessSheets
  };
};

// Convert form data to applicant data format for document generation
export const formDataToApplicantData = (formData: any): ApplicantData => {
  // Map applicant type to category
  let applicantCategory: 'natural_person' | 'startup' | 'small_entity' | 'others';
  
  if (formData.applicant_type === 'individual') {
    applicantCategory = 'natural_person';
  } else if (formData.applicant_type === 'startup') {
    applicantCategory = 'startup';
  } else if (formData.applicant_type === 'small_entity') {
    applicantCategory = 'small_entity';
  } else {
    applicantCategory = 'others';
  }
  
  return {
    application_type: formData.application_type as 'ordinary' | 'convention' | 'pct-np' | 'pph',
    application_no: formData.id || `IN${new Date().getFullYear()}${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
    filing_date: new Date(formData.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    fee_paid: "₹9,000",
    cbr_no: `CBR-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
    applicant_name: formData.applicant_name,
    applicant_nationality: formData.applicant_nationality,
    applicant_address: formData.applicant_address,
    applicant_category: applicantCategory,
    
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
