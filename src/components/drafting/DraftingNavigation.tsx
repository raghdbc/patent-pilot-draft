
import { Button } from "@/components/ui/button";
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
      >
        Previous Section
      </Button>
      <Button onClick={handleNext}>
        {currentIndex === totalSections - 1 ? "Complete Draft" : "Next Section"}
      </Button>
    </div>
  );
}
