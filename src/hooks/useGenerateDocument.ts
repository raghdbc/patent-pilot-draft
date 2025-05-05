
import { useState } from 'react';
import { ApplicantData } from '@/utils/applicantSchema';
import { toast } from '@/hooks/use-toast';

export function useGenerateDocument() {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateDocument = async (
    templateName: string,
    data: ApplicantData
  ): Promise<void> => {
    setIsGenerating(true);
    
    try {
      // In a real application, this would make a request to a server endpoint
      // that would generate the document using python-docxtpl as shown in the example
      
      // For now, we'll simulate the API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log(`Generating document from ${templateName} template with data:`, data);
      
      // Create file name based on template and applicant name
      const fileName = `${templateName}-${data.applicant_name.replace(/\s+/g, '-')}-${new Date().getTime()}.docx`;
      
      // In production, the server would return a Blob or download URL
      // Here we're creating a mock download
      const element = document.createElement('a');
      element.setAttribute('href', 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQABgAIAAAAIQD8AWcOOwEAAOoBAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbLSUTU/DMAyG70j8hyhXVkjbjR0gwG1cuA0JhdtvyNJt7dClSZxs/fehpS2wdprstknNi99n2Z6d7pewJm+SBRfdQtiNDoF0Y4zuBjHR5L0LCwrcR0LzflQlYKMfQS6KCbio+bvKl2D3IVABx6jpiBrb1XD/qsiTGMAG3amGEjGUTSKzBgxlrxQn3IFFnOUitvVZMjNN0FzQJQXTC//a0j8rpTtFX6Zvj4GQ5M0Cr0Lee7xYzhvTuJeJmJQIDAZCK6L5Q8wJ4MZyGQ7m5OXe8oQzNwyFDjVBK3sHRs4jo7MLKS1TQRq8SV7AIthU1YdmleWpBStRN2FX5+9r3uqutGQENAXZvSyOYJnWrqp2m+S7jj5TBultLt07FDL+P1L9NPI2ksGgOPCF7fs43xPxSkQu8PSZlxDYUJXtPEx7Byca7pK/AG9Tu/LqH7xS8SXv97i3FXB3jM3V48Z3hvcL/wBQSwMEFAAGAAgAAAAhAB6RGrfvAAAATgIAAAsAAABfcmVscy8ucmVscySxSU7DMBRFfxm5mzZlxxAklaZdssAZwKM8a9rEenvN5LDgnzAIF3YcHem+q6d73NZjX/SOkZKPnq+qE0Qch9COnrdp8XNNlOEaNnJELp7x1tXL82OzR6uZUbR9CJSJdPL84SOXUUo2xk5IrHZEPS9rtihNtRTi/YGDMDUrLkLjOmKwIYSGgNwwRYyuCnjGFgE5Uj8hxZwWOM+0rkonsc8d5Zc3z9yAXvLW2lHLYOdz0hJ9uK7edyOu3xKg/TXDhI0Xi+tP7PsDUEsDBAoAAAAAAAAAIQAJ7QWSAQAAAAAAAAAAAAAAKAAAAAAAAAAAAAAAAAAAAAAAAL0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFBLAWIAAA0AFAAAAAAAAwAAAAAAAAAAAAAA');
      element.setAttribute('download', fileName);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Document generated",
        description: `${fileName} has been downloaded.`,
      });
      
      console.log('Document generated successfully');
      
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
