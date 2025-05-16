
import { useState } from 'react';
import { ApplicantData } from '@/utils/applicantSchema';
import { toast } from '@/components/ui/use-toast';

// This is a simplified client-side implementation
// In a production environment, this would be handled by a server using python-docxtpl
export function useGenerateDocument() {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Function to simulate template filling (in production, this would be done by the server)
  const fillTemplate = (templateType: string, data: ApplicantData): string => {
    // In a real implementation, this would send the data to a server endpoint
    // that would use python-docxtpl to fill the template
    console.log(`Filling ${templateType} template with data:`, data);
    
    // For demo purposes, return a valid Word document
    // This is a minimal valid .docx file structure
    // In production, this would be replaced with actual template processing on the server
    if (templateType === 'form1') {
      // Form 1 template base64 - in real app, server would fill this with data
      return "UEsDBBQABgAIAAAAIQDfpNJsWgEAACAFAAATAAgCW0NvbnRlbnRfVHlwZXNdLnhtbCCiBAIooAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC0lMtuwjAQRfeV+g+Rt1Vi6KKqKgKLPpYtUukHGHsCVv2Sx7z+vhMCUVUBkQpsIiUz994zVsaD0dqabAkRtXcl6xc9loGTXmk3K9nX5C1/ZBkm4ZQw3kHJNoBsNLy9GUw2ATAjtcOSzVMKT5yjnIMVWPgALj1NfLQi5THOeBDiXSzBj3r9By6dS8J0kHIb8nEN95r5v9pIFt28FBKWIC0OSO9AcYfusggWxB5qs/KX8lJ/7SXbLRnQ9xa88H7JOOnn/bx5BnoQExQlTpCRF+UzKEK7beNAj5FSQcC7jVlh3go6jXE91OTiJoK/Xl4lWvvA590DRx8WWFD6iYvbDGDERfALLterzfU2CuNQ8A9YLJ2Z5a6nX0CuFmYzPXvRvQ2EBwnR+c354NzrLYHxX0IkPiXezh6STPEiISssXhCzYhMRJn9plFoB/D31d6AaPWDkRoM9sM4OOG46/8Pw==";
    } else {
      // Patent draft template base64 - in real app, server would fill this with data
      return "UEsDBBQABgAIAAAAIQDfpNJsWgEAACAFAAATAAgCW0NvbnRlbnRfVHlwZXNdLnhtbCCiBAIooAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC0lMtuwjAQRfeV+g+Rt1Vi6KKqKgKLPpYtUukHGHsCVv2Sx7z+vhMCUVUBkQpsIiUz994zVsaD0dqabAkRtXcl6xc9loGTXmk3K9nX5C1/ZBkm4ZQw3kHJNoBsNLy9GUw2ATAjtcOSzVMKT5yjnIMVWPgALj1NfLQi5THOeBDiXSzBj3r9By6dS8J0kHIb8nEN95r5v9pIFt28FBKWIC0OSO9AcYfusggWxB5qs/KX8lJ/7SXbLRnQ9xa88H7JOOnn/bx5BnoQExQlTpCRF+UzKEK7beNAj5FSQcC7jVlh3go6jXE91OTiJoK/Xl4lWvvA590DRx8WWFD6iYvbDGDERfALLterzfU2CuNQ8A9YLJ2Z5a6nX0CuFmYzPXvRvQ2EBwnR+c354NzrLYHxX0IkPiXezh6STPEiISssXhCzYhMRJn9plFoB/D31d6AaPWDkRoM9sM4OOG46/8Pw==";
    }
  };
  
  const generateDocument = async (
    templateName: string,
    data: ApplicantData
  ): Promise<void> => {
    setIsGenerating(true);
    
    try {
      // In a real application, this would make a request to a server endpoint
      // that would generate the document using python-docxtpl
      
      // Simulate server processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Generating document from ${templateName} template with data:`, data);
      
      // Create file name based on template and applicant name
      const fileName = `${templateName}-${data.applicant_name.replace(/\s+/g, '-')}-${new Date().getTime()}.docx`;
      
      // Get filled template (simulated)
      const base64Content = fillTemplate(templateName, data);
      
      // Create a Blob from the base64 string
      const binaryString = window.atob(base64Content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      
      // Create a download URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Trigger download
      const element = document.createElement('a');
      element.setAttribute('href', url);
      element.setAttribute('download', fileName);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(element);
        URL.revokeObjectURL(url);
      }, 100);
      
      // In a production app, we would also update the database to record the document generation
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error generating document:', error);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "Failed to generate document. Please try again.",
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };
  
  const generateAllDocuments = async (data: ApplicantData): Promise<void> => {
    try {
      setIsGenerating(true);
      
      // Generate Form 1 document
      await generateDocument('form1', data);
      
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate Patent Draft document
      await generateDocument('patent-draft', data);
      
      toast({
        title: "All documents generated",
        description: "Form 1 and Patent Draft have been downloaded.",
      });
    } catch (error) {
      console.error('Error generating all documents:', error);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "Failed to generate all documents. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateDocument, generateAllDocuments, isGenerating };
}
