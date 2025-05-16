
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Save } from "lucide-react";

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
  const [isSaving, setIsSaving] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [sectionContent, setSectionContent] = useState<Record<DraftSection, string>>({
    background: "",
    summary: "",
    drawings: "",
    description: "",
    claims: "",
    abstract: "",
  });
  
  const currentIndex = DRAFT_SECTIONS.indexOf(currentSection);
  const totalSections = DRAFT_SECTIONS.length;
  
  // Load existing draft from database if available
  useEffect(() => {
    const loadExistingDraft = async () => {
      try {
        // Check authentication
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          return;
        }
        
        // Get most recent draft (in a real app, we would select a specific draft)
        const { data, error } = await supabase
          .from('patent_applications')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1);
          
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          const draft = data[0];
          setApplicationId(draft.id);
          
          // Set section content
          const newSectionContent = { ...sectionContent };
          let newCompletedSections: DraftSection[] = [];
          
          if (draft.background) {
            newSectionContent.background = draft.background;
            newCompletedSections.push("background");
          }
          
          if (draft.description) {
            newSectionContent.description = draft.description;
            newCompletedSections.push("description");
          }
          
          if (draft.claims) {
            newSectionContent.claims = draft.claims;
            newCompletedSections.push("claims");
          }
          
          if (draft.abstract) {
            newSectionContent.abstract = draft.abstract;
            newCompletedSections.push("abstract");
          }
          
          // You might need to adjust the field names for these sections
          if (draft.summary) {
            newSectionContent.summary = draft.summary;
            newCompletedSections.push("summary");
          }
          
          if (draft.drawings) {
            newSectionContent.drawings = draft.drawings;
            newCompletedSections.push("drawings");
          }
          
          setSectionContent(newSectionContent);
          setCompletedSections(newCompletedSections);
        }
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    };
    
    loadExistingDraft();
  }, []);
  
  const updateSectionContent = (section: DraftSection, content: string) => {
    setSectionContent(prev => ({
      ...prev,
      [section]: content
    }));
  };
  
  const handleNext = async () => {
    // Mark current section as completed if there's content
    if (sectionContent[currentSection]?.trim() && !completedSections.includes(currentSection)) {
      setCompletedSections([...completedSections, currentSection]);
    }
    
    // Save content to database
    await saveDraft();
    
    if (currentIndex < DRAFT_SECTIONS.length - 1) {
      const nextSection = DRAFT_SECTIONS[currentIndex + 1];
      setCurrentSection(nextSection);
    } else {
      // Last section completed
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
  
  const saveDraft = async () => {
    try {
      setIsSaving(true);
      
      // Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please login to save your patent draft.",
          variant: "destructive",
        });
        return;
      }
      
      const draftData = {
        background: sectionContent.background,
        description: sectionContent.description,
        claims: sectionContent.claims,
        abstract: sectionContent.abstract,
        // Additional fields that might need different field names in the database
        summary: sectionContent.summary,
        drawings: sectionContent.drawings,
      };
      
      if (applicationId) {
        // Update existing application
        const { error } = await supabase
          .from('patent_applications')
          .update(draftData)
          .eq('id', applicationId);
          
        if (error) throw error;
      } else {
        // Create new application with minimal required fields
        const { data, error } = await supabase
          .from('patent_applications')
          .insert([{
            ...draftData,
            user_id: session.user.id,
            title: "Untitled Patent Draft", // Default title
            application_type: "ordinary",
            applicant_type: "individual",
            applicant_name: "", // Required field
            applicant_address: "", // Required field
            applicant_nationality: "Indian", // Required field
            inventor_name: "", // Required field
            inventor_address: "", // Required field
            inventor_nationality: "Indian", // Required field
            status: "draft",
          }])
          .select();
          
        if (error) throw error;
        if (data && data.length > 0) {
          setApplicationId(data[0].id);
        }
      }
      
      toast({
        title: "Draft saved",
        description: "Your patent draft has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: "Failed to save your draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Patent Drafting Assistant</CardTitle>
              <CardDescription>
                Create your patent draft section by section with AI assistance
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={saveDraft}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Draft
            </Button>
          </div>
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
                  {currentSection === "background" && (
                    <BackgroundSection
                      content={sectionContent.background}
                      onChange={(content) => updateSectionContent("background", content)}
                    />
                  )}
                  {currentSection === "summary" && (
                    <SummarySection
                      content={sectionContent.summary}
                      onChange={(content) => updateSectionContent("summary", content)}
                    />
                  )}
                  {currentSection === "drawings" && (
                    <DrawingsSection
                      content={sectionContent.drawings}
                      onChange={(content) => updateSectionContent("drawings", content)}
                    />
                  )}
                  {currentSection === "description" && (
                    <DetailedDescriptionSection
                      content={sectionContent.description}
                      onChange={(content) => updateSectionContent("description", content)}
                    />
                  )}
                  {currentSection === "claims" && (
                    <ClaimsSection
                      content={sectionContent.claims}
                      onChange={(content) => updateSectionContent("claims", content)}
                    />
                  )}
                  {currentSection === "abstract" && (
                    <AbstractSection
                      content={sectionContent.abstract}
                      onChange={(content) => updateSectionContent("abstract", content)}
                    />
                  )}
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
              <DraftPreview
                sections={sectionContent}
                onSave={saveDraft}
                isSaving={isSaving}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
