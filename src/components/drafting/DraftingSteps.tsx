
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormProgress } from "../forms/FormProgress";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { BackgroundSection } from "./sections/BackgroundSection";
import { SummarySection } from "./sections/SummarySection";
import { DrawingsSection } from "./sections/DrawingsSection";
import { DetailedDescriptionSection } from "./sections/DetailedDescriptionSection";
import { ClaimsSection } from "./sections/ClaimsSection";
import { AbstractSection } from "./sections/AbstractSection";
import { DraftPreview } from "./DraftPreview";

const DRAFT_SECTIONS = [
  "background",
  "summary",
  "drawings",
  "description",
  "claims",
  "abstract",
] as const;

type DraftSection = typeof DRAFT_SECTIONS[number];

export function DraftingSteps() {
  const [currentSection, setCurrentSection] = useState<DraftSection>("background");
  const [completedSections, setCompletedSections] = useState<DraftSection[]>([]);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  
  const currentIndex = DRAFT_SECTIONS.indexOf(currentSection);
  const totalSections = DRAFT_SECTIONS.length;
  
  const handleNext = () => {
    if (currentIndex < DRAFT_SECTIONS.length - 1) {
      if (!completedSections.includes(currentSection)) {
        setCompletedSections([...completedSections, currentSection]);
      }
      const nextSection = DRAFT_SECTIONS[currentIndex + 1];
      setCurrentSection(nextSection);
    } else {
      // Last section completed
      if (!completedSections.includes(currentSection)) {
        setCompletedSections([...completedSections, currentSection]);
      }
      setActiveTab("preview");
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevSection = DRAFT_SECTIONS[currentIndex - 1];
      setCurrentSection(prevSection);
    }
  };
  
  const handleSectionClick = (section: DraftSection) => {
    setCurrentSection(section);
    setActiveTab("edit");
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Patent Drafting Assistant</CardTitle>
          <CardDescription>
            Create your patent draft section by section with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "edit" | "preview")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">Draft Editor</TabsTrigger>
              <TabsTrigger value="preview">Full Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="pt-6">
              <div className="space-y-6">
                <FormProgress 
                  currentStep={completedSections.length + (completedSections.includes(currentSection) ? 0 : 0.5)} 
                  totalSteps={totalSections}
                />
                
                <div className="flex flex-wrap gap-2">
                  {DRAFT_SECTIONS.map((section) => (
                    <Button
                      key={section}
                      variant={section === currentSection ? "default" : "outline"}
                      className={`${
                        completedSections.includes(section)
                          ? "border-primary text-primary"
                          : ""
                      }`}
                      onClick={() => handleSectionClick(section)}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </Button>
                  ))}
                </div>
                
                <div className="animate-slide-in">
                  {currentSection === "background" && <BackgroundSection />}
                  {currentSection === "summary" && <SummarySection />}
                  {currentSection === "drawings" && <DrawingsSection />}
                  {currentSection === "description" && <DetailedDescriptionSection />}
                  {currentSection === "claims" && <ClaimsSection />}
                  {currentSection === "abstract" && <AbstractSection />}
                </div>
                
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
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="pt-6">
              <DraftPreview />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
