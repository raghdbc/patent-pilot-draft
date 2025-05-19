
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDrafting, DRAFT_SECTIONS } from "./DraftingContext";

export function DraftingNavigation() {
  const { currentSection, handlePrevious, handleNext } = useDrafting();
  const currentIndex = DRAFT_SECTIONS.indexOf(currentSection);
  const totalSections = DRAFT_SECTIONS.length;
  
  return (
    <div className="flex justify-between pt-4">
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={currentIndex === 0}
        className="flex items-center"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous Section
      </Button>
      <Button onClick={handleNext} className="flex items-center">
        {currentIndex === totalSections - 1 ? "Complete Draft" : "Next Section"}
        {currentIndex < totalSections - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
      </Button>
    </div>
  );
}
