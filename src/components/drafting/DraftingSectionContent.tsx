
import { SectionContent } from "@/models/draftTypes";
import { AbstractSection } from "./sections/AbstractSection";
import { BackgroundSection } from "./sections/BackgroundSection";
import { DetailedDescriptionSection } from "./sections/DetailedDescriptionSection";
import { ClaimsSection } from "./sections/ClaimsSection";
import { DrawingsSection } from "./sections/DrawingsSection";
import { SummarySection } from "./sections/SummarySection";

interface DraftingSectionContentProps {
  currentSection: string;
  sections: SectionContent;
  onSectionChange: (section: string, content: string) => void;
}

export function DraftingSectionContent({
  currentSection,
  sections,
  onSectionChange,
}: DraftingSectionContentProps) {
  const handleChange = (content: string) => {
    onSectionChange(currentSection.toLowerCase(), content);
  };

  switch (currentSection) {
    case "Title":
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Title</h3>
          <p className="text-sm text-muted-foreground">
            Provide a clear, concise title for your invention (5-15 words)
          </p>
          <input
            type="text"
            value={sections.title || ""}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter a descriptive title for your invention..."
          />
        </div>
      );
    case "Abstract":
      return (
        <AbstractSection
          content={sections.abstract || ""}
          onChange={handleChange}
        />
      );
    case "Background":
      return (
        <BackgroundSection
          content={sections.background || ""}
          onChange={handleChange}
        />
      );
    case "Description":
      return (
        <DetailedDescriptionSection
          content={sections.description || ""}
          onChange={handleChange}
        />
      );
    case "Claims":
      return (
        <ClaimsSection
          content={sections.claims || ""}
          onChange={handleChange}
        />
      );
    case "Drawings":
      return (
        <DrawingsSection
          content={sections.drawings || ""}
          onChange={handleChange}
        />
      );
    case "Summary":
      return <SummarySection sections={sections} />;
    default:
      return <div>Select a section to begin</div>;
  }
}
