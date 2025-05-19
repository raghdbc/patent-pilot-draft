
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useDrafting, DRAFT_SECTIONS } from "./DraftingContext";

export function DraftingSectionSelector() {
  const { currentSection, completedSections, handleSectionClick } = useDrafting();

  return (
    <div className="flex flex-wrap gap-2">
      {DRAFT_SECTIONS.map((section) => (
        <Button
          key={section}
          variant={section === currentSection ? "default" : "outline"}
          className={`flex items-center ${
            completedSections.includes(section)
              ? "border-primary text-primary"
              : ""
          }`}
          onClick={() => handleSectionClick(section)}
        >
          {section.charAt(0).toUpperCase() + section.slice(1)}
          {section === currentSection && <ChevronRight className="h-4 w-4 ml-1" />}
        </Button>
      ))}
    </div>
  );
}
