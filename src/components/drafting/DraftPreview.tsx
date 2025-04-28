
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader } from "lucide-react";

export function DraftPreview() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // This would actually pull data from context or props in a real implementation
  const sampleDraft = `
  PATENT SPECIFICATION
  
  TITLE: METHOD AND SYSTEM FOR AUTOMATED PATENT DRAFTING
  
  BACKGROUND OF THE INVENTION
  
  Field of Invention:
  The present invention relates to the field of intellectual property management software, specifically to systems and methods for assisting in the preparation and filing of patent applications.
  
  Problem Addressed:
  The process of drafting patent applications requires specialized knowledge and expertise in legal and technical writing. Many inventors, particularly students and first-time inventors, lack this knowledge, resulting in poorly drafted applications that may be rejected or provide inadequate protection.
  
  Prior Art:
  Existing patent drafting solutions include template-based word processors, general AI writing assistants, and complex patent management software designed for law firms. These solutions either provide minimal guidance or are prohibitively complex and expensive for occasional users.
  
  Limitations of Prior Art:
  Template-based solutions lack educational components and don't adapt to the specific invention. General AI tools aren't trained specifically for patent drafting and may not comply with legal requirements. Professional patent management software is typically expensive and has steep learning curves unsuitable for students or first-time inventors.
  
  SUMMARY OF THE INVENTION
  
  The present invention provides a web-based system for guiding users through the patent drafting process using artificial intelligence. The system combines educational components, guided form filling, and AI-assisted content generation to help users with minimal patent knowledge create professional-quality patent applications.
  
  [... document continues with all sections ...]
  `;
  
  const handleDownload = () => {
    setIsDownloading(true);
    
    // Simulate download preparation
    setTimeout(() => {
      // In a real implementation, this would create a PDF file
      // For this demo, we'll simulate the download
      setIsDownloading(false);
      alert("Download complete! In a real implementation, this would save your patent draft as a PDF file.");
    }, 2000);
  };
  
  const handleGenerateComplete = () => {
    setIsGenerating(true);
    
    // Simulate generating the complete document
    setTimeout(() => {
      setIsGenerating(false);
      alert("Complete patent draft has been generated!");
    }, 3000);
  };
  
  return (
    <div className="space-y-6">
      <Alert>
        <AlertTitle>Draft Preview</AlertTitle>
        <AlertDescription>
          This is a preview of your complete patent draft. You can review each section, regenerate content, and download the final document.
        </AlertDescription>
      </Alert>
      
      <div className="bg-white border rounded-lg p-6 max-h-[600px] overflow-y-auto">
        <pre className="whitespace-pre-wrap font-serif text-sm">
          {sampleDraft}
        </pre>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handleGenerateComplete}
          disabled={isGenerating || isDownloading}
        >
          {isGenerating && <Loader className="mr-2 h-4 w-4 animate-spin" />}
          Regenerate Complete Draft
        </Button>
        <Button 
          className="flex-1"
          onClick={handleDownload}
          disabled={isDownloading || isGenerating}
        >
          {isDownloading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
          Download Patent Draft
        </Button>
      </div>
    </div>
  );
}
