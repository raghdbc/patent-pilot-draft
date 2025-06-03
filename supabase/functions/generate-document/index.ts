
// Supabase Edge Function for document generation
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApplicationData {
  templateName: string;
  data: {
    application_type: string;
    application_no: string;
    filing_date: string;
    fee_paid: string;
    title_of_invention: string;
    applicant_name: string;
    applicant_address: string;
    applicant_nationality: string;
    applicant_category: string;
    inventor_name: string;
    inventor_address: string;
    inventor_nationality: string;
    inventor_is_applicant: boolean;
    background: string;
    description: string;
    claims: string;
    abstract: string;
    all_inventors?: Array<any>;
    all_applicants?: Array<any>;
    [key: string]: any;
  };
}

// Template content generation - in production this would use actual docx templates
function generateFilledDocument(data: ApplicationData['data']): string {
  // This simulates filling a Word document template with the provided data
  // In a real implementation, this would use python-docxtpl or similar
  
  const documentContent = `
    PATENT APPLICATION FORM
    
    Application Type: ${data.application_type}
    Application No: ${data.application_no}
    Filing Date: ${data.filing_date}
    Fee Paid: ${data.fee_paid}
    
    TITLE OF INVENTION: ${data.title_of_invention}
    
    APPLICANT DETAILS:
    Name: ${data.applicant_name}
    Address: ${data.applicant_address}
    Nationality: ${data.applicant_nationality}
    Category: ${data.applicant_category}
    
    INVENTOR DETAILS:
    Name: ${data.inventor_name}
    Address: ${data.inventor_address}
    Nationality: ${data.inventor_nationality}
    
    BACKGROUND: ${data.background}
    
    DETAILED DESCRIPTION: ${data.description}
    
    CLAIMS: ${data.claims}
    
    ABSTRACT: ${data.abstract}
    
    ${data.all_inventors && data.all_inventors.length > 1 ? `
    ALL INVENTORS:
    ${data.all_inventors.map((inv, i) => `${i + 1}. ${inv.name} - ${inv.address} (${inv.nationality})`).join('\n')}
    ` : ''}
    
    ${data.all_applicants && data.all_applicants.length > 1 ? `
    ALL APPLICANTS:
    ${data.all_applicants.map((app, i) => `${i + 1}. ${app.name} - ${app.address} (${app.nationality}) - ${app.category}`).join('\n')}
    ` : ''}
  `;
  
  // For demo purposes, return a base64 encoded minimal docx file
  // In production, this would be generated using proper docx library with the template
  const base64Document = "UEsDBBQABgAIAAAAIQDfpNJsWgEAACAFAAATAAgCW0NvbnRlbnRfVHlwZXNdLnhtbCCiBAIooAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC0lMtuwjAQRfeV+g+Rt1Vi6KKqKgKLPpYtUukHGHsCVv2Sx7z+vhMCUVUBkQpsIiUz994zVsaD0dqabAkRtXcl6xc9loGTXmk3K9nX5C1/ZBkm4ZQw3kHJNoBsNLy9GUw2ATAjtcOSzVMKT5yjnIMVWPgALj1NfLQi5THOeBDiXSzBj3r9By6dS8J0kHIb8nEN95r5v9pIFt28FBKWIC0OSO9AcYfusggWxB5qs/KX8lJ/7SXbLRnQ9xa88H7JOOnn/bx5BnoQExQlTpCRF+UzKEK7beNAj5FSQcC7jVlh3go6jXE91OTiJoK/Xl4lWvvA590DRx8WWFD6iYvbDGDERfALLterzfU2CuNQ8A9YLJ2Z5a6nX0CuFmYzPXvRvQ2EBwnR+c354NzrLYHxX0IkPiXezh6STPEiISssXhCzYhMRJn9plFoB/D31d6AaPWDkRoM9sM4OOG46/8Pw==";
  
  return base64Document;
}

// This function would normally use python-docxtpl on the server,
// but for this demo we'll simulate the document generation
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const requestData: ApplicationData = await req.json();
    const { templateName, data } = requestData;
    
    if (!templateName || !data) {
      throw new Error("Missing required parameters");
    }
    
    console.log(`Generating document from template: ${templateName}`);
    console.log("Data:", JSON.stringify(data, null, 2));
    
    // Calculate fee based on applicant category
    let calculatedFee = "₹8,000"; // Default
    switch(data.applicant_category) {
      case "natural_person":
        calculatedFee = "₹1,600";
        break;
      case "startup":
        calculatedFee = "₹1,600";
        break;
      case "small_entity":
        calculatedFee = "₹4,000";
        break;
      case "woman":
        calculatedFee = "₹1,600";
        break;
      case "education_institute":
        calculatedFee = "₹1,600";
        break;
      case "govt_entity":
        calculatedFee = "₹1,600";
        break;
      default:
        calculatedFee = "₹8,000"; // Large entity
    }
    
    // Update the fee_paid with calculated fee
    data.fee_paid = calculatedFee;
    
    // Generate the filled document
    const base64Document = generateFilledDocument(data);
    
    // In a real implementation, we would:
    // 1. Use python-docxtpl to fill the actual template
    // 2. Return the filled document with all the form data properly inserted
    
    const fileName = `patent-application-${data.application_no}-${Date.now()}.docx`;
    
    return new Response(
      JSON.stringify({ 
        document: base64Document,
        fileName: fileName,
        calculatedFee: calculatedFee,
        success: true
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Document generation error:", error.message);
    
    return new Response(
      JSON.stringify({
        error: "Document generation failed",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
