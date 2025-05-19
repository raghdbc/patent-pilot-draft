
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader } from "lucide-react";
import { SectionContent } from "./DraftingContext";

interface DraftPreviewProps {
  sections: SectionContent;
  onSave: () => void;
  isSaving: boolean;
}

export function DraftPreview({ sections, onSave, isSaving }: DraftPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Generate formatted draft from all sections
  const generateFormattedDraft = () => {
    const parts = [];
    
    parts.push("PATENT SPECIFICATION\n\n");
    
    if (sections.title) {
      parts.push(`TITLE: ${sections.title.toUpperCase()}\n\n`);
    }
    
    if (sections.background) {
      parts.push(sections.background + "\n\n");
    }
    
    if (sections.summary) {
      parts.push(sections.summary + "\n\n");
    }
    
    if (sections.drawings) {
      parts.push(sections.drawings + "\n\n");
    }
    
    if (sections.description) {
      parts.push(sections.description + "\n\n");
    }
    
    if (sections.claims) {
      parts.push(sections.claims + "\n\n");
    }
    
    if (sections.abstract) {
      parts.push(sections.abstract);
    }
    
    return parts.join("");
  };
  
  const sampleDraft = generateFormattedDraft();
  
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
