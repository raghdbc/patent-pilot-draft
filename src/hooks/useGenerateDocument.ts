
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { ApplicantData } from '@/utils/applicantSchema';

export function useGenerateDocument() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDocument = async (templateName: string, data: ApplicantData): Promise<void> => {
    setIsGenerating(true);
    
    try {
      console.log(`Generating document from ${templateName} template with data:`, data);
      
      // Clean the data to ensure no undefined values cause issues
      const cleanData = {
        ...data,
        applicant_name: data.applicant_name || '',
        applicant_nationality: data.applicant_nationality || 'Indian',
        applicant_address: data.applicant_address || '',
        inventor_name: data.inventor_name || '',
        inventor_nationality: data.inventor_nationality || 'Indian',
        inventor_address: data.inventor_address || '',
        title_of_invention: data.title_of_invention || '',
        abstract: data.abstract || '',
        claims: data.claims || '',
        description: data.description || '',
        background: data.background || '',
        invention_field: data.invention_field || '',
        prior_art: data.prior_art || '',
        problem_addressed: data.problem_addressed || '',
        proposed_solution: data.proposed_solution || '',
        advantages: data.advantages || '',
      };

      // Call the Supabase Edge Function
      const response = await fetch('https://cpgklmwtwuamdeqffebi.supabase.co/functions/v1/generate-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZ2tsbXd0d3VhbWRlcWZmZWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NDMzNDAsImV4cCI6MjA2MTQxOTM0MH0.Rj3v7Ymp9fbsLnGIADa_yFAcCzuhalRpuqbEqsAb8Sg'}`,
        },
        body: JSON.stringify({
          templateName,
          data: cleanData
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.details || result.error);
      }

      // Convert base64 to blob and download
      const binaryString = window.atob(result.document);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const blob = new Blob([bytes], { 
        type: 'text/plain' 
      });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.fileName || `${templateName}-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Document generated successfully",
        description: `Your ${templateName} document has been downloaded.`,
      });

    } catch (error) {
      console.error('Error generating document:', error);
      toast({
        variant: "destructive",
        title: "Document generation failed",
        description: error instanceof Error ? error.message : "Failed to generate document. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateDocument, isGenerating };
}
