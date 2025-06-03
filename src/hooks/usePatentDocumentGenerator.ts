
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface PatentFormData {
  applicationType: string;
  title: string;
  inventors: Array<{
    name: string;
    address: string;
    nationality: string;
  }>;
  applicants: {
    additionalApplicants: Array<{
      name: string;
      address: string;
      nationality: string;
      category: string;
    }>;
  };
  background?: string;
  description?: string;
  claims?: string;
  abstract?: string;
  [key: string]: any;
}

export function usePatentDocumentGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDocument = async (formData: PatentFormData): Promise<void> => {
    setIsGenerating(true);
    
    try {
      // Prepare the data for the Supabase Edge Function
      const templateData = {
        templateName: 'patent-application',
        data: {
          application_type: formData.applicationType || 'ordinary',
          application_no: `APP-${Date.now()}`,
          filing_date: new Date().toLocaleDateString('en-IN'),
          fee_paid: '₹8,000', // This will be calculated by the edge function
          title_of_invention: formData.title || '',
          
          // Primary applicant (first in the list)
          applicant_name: formData.applicants?.additionalApplicants?.[0]?.name || '',
          applicant_address: formData.applicants?.additionalApplicants?.[0]?.address || '',
          applicant_nationality: formData.applicants?.additionalApplicants?.[0]?.nationality || '',
          applicant_category: formData.applicants?.additionalApplicants?.[0]?.category || 'natural_person',
          
          // Primary inventor (first in the list)
          inventor_name: formData.inventors?.[0]?.name || '',
          inventor_address: formData.inventors?.[0]?.address || '',
          inventor_nationality: formData.inventors?.[0]?.nationality || '',
          inventor_is_applicant: false, // Could be determined by comparing names
          
          // Patent content
          background: formData.background || '',
          description: formData.description || '',
          claims: formData.claims || '',
          abstract: formData.abstract || '',
          
          // All inventors and applicants for comprehensive data
          all_inventors: formData.inventors || [],
          all_applicants: formData.applicants?.additionalApplicants || [],
        }
      };

      console.log('Sending data to document generator:', templateData);

      // Call the Supabase Edge Function
      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.fileName || `patent-application-${Date.now()}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Document generated successfully",
        description: `Your patent application document has been downloaded. Calculated fee: ${result.calculatedFee}`,
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
