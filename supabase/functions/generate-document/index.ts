
// Supabase Edge Function for document generation
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// This function would normally use python-docxtpl on the server,
// but for this demo we'll simulate the document generation
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const { templateName, data } = await req.json();
    
    if (!templateName || !data) {
      throw new Error("Missing required parameters");
    }
    
    console.log(`Generating document from template: ${templateName}`);
    console.log("Data:", JSON.stringify(data, null, 2));
    
    // In a real implementation, we would:
    // 1. Use python-docxtpl to fill the template
    // 2. Return the filled document
    
    // For this demo, we'll return a placeholder base64 docx file
    const base64Document = "UEsDBBQABgAIAAAAIQDfpNJsWgEAACAFAAATAAgCW0NvbnRlbnRfVHlwZXNdLnhtbCCiBAIooAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC0lMtuwjAQRfeV+g+Rt1Vi6KKqKgKLPpYtUukHGHsCVv2Sx7z+vhMCUVUBkQpsIiUz994zVsaD0dqabAkRtXcl6xc9loGTXmk3K9nX5C1/ZBkm4ZQw3kHJNoBsNLy9GUw2ATAjtcOSzVMKT5yjnIMVWPgALj1NfLQi5THOeBDiXSzBj3r9By6dS8J0kHIb8nEN95r5v9pIFt28FBKWIC0OSO9AcYfusggWxB5qs/KX8lJ/7SXbLRnQ9xa88H7JOOnn/bx5BnoQExQlTpCRF+UzKEK7beNAj5FSQcC7jVlh3go6jXE91OTiJoK/Xl4lWvvA590DRx8WWFD6iYvbDGDERfALLterzfU2CuNQ8A9YLJ2Z5a6nX0CuFmYzPXvRvQ2EBwnR+c354NzrLYHxX0IkPiXezh6STPEiISssXhCzYhMRJn9plFoB/D31d6AaPWDkRoM9sM4OOG46/8Pw==";
    
    return new Response(
      JSON.stringify({ document: base64Document }),
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
