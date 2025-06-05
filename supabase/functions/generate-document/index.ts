
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

// Generate a simple text-based document with the form data
function generateWordDocument(data: ApplicationData['data']): string {
  // Create a simple text document with form data
  const documentContent = `
PATENT APPLICATION FORM 1

Title of Invention: ${data.title_of_invention}
Application Type: ${data.application_type}
Application Number: ${data.application_no}
Filing Date: ${data.filing_date}
Fee Paid: ${data.fee_paid}

APPLICANT DETAILS:
Name: ${data.applicant_name}
Address: ${data.applicant_address}
Nationality: ${data.applicant_nationality}
Category: ${data.applicant_category}

INVENTOR DETAILS:
Name: ${data.inventor_name}
Address: ${data.inventor_address}
Nationality: ${data.inventor_nationality}
Is Applicant: ${data.inventor_is_applicant ? 'Yes' : 'No'}

TECHNICAL DETAILS:
Background: ${data.background}
Description: ${data.description}
Claims: ${data.claims}
Abstract: ${data.abstract}

Generated on: ${new Date().toLocaleString()}
`;

  // Convert to base64
  const encoder = new TextEncoder();
  const bytes = encoder.encode(documentContent);
  return btoa(String.fromCharCode(...bytes));
}

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
    
    // Generate the document with actual form data
    const base64Document = generateWordDocument(data);
    
    const fileName = `patent-application-${data.application_no}-${Date.now()}.txt`;
    
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
