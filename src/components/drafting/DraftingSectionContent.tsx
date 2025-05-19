
import { useDrafting } from "./DraftingContext";
import { BackgroundSection } from "./sections/BackgroundSection";
import { SummarySection } from "./sections/SummarySection";
import { DrawingsSection } from "./sections/DrawingsSection";
import { DetailedDescriptionSection } from "./sections/DetailedDescriptionSection";
import { ClaimsSection } from "./sections/ClaimsSection";
import { AbstractSection } from "./sections/AbstractSection";

// Type definitions to fix the props error
export interface DraftSectionProps {
  content: string;
  onChange: (content: string) => void;
}

export function DraftingSectionContent() {
  const { currentSection, sectionContent, updateSectionContent } = useDrafting();
  
  // Handler for section content updates
  const handleContentChange = (content: string) => {
    updateSectionContent(currentSection, content);
  };

  return (
    <div className="animate-slide-in">
      {currentSection === "background" && (
        <BackgroundSection
          content={sectionContent.background}
          onChange={handleContentChange}
        />
      )}
      {currentSection === "summary" && (
        <SummarySection
          content={sectionContent.summary}
          onChange={handleContentChange}
        />
      )}
      {currentSection === "drawings" && (
        <DrawingsSection
          content={sectionContent.drawings}
          onChange={handleContentChange}
        />
      )}
      {currentSection === "description" && (
        <DetailedDescriptionSection
          content={sectionContent.description}
          onChange={handleContentChange}
        />
      )}
      {currentSection === "claims" && (
        <ClaimsSection
          content={sectionContent.claims}
          onChange={handleContentChange}
        />
      )}
      {currentSection === "abstract" && (
        <AbstractSection
          content={sectionContent.abstract}
          onChange={handleContentChange}
        />
      )}
    </div>
  );
}
