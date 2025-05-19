
import React, { createContext, useContext, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const DRAFT_SECTIONS = [
  "background",
  "summary",
  "drawings",
  "description",
  "claims",
  "abstract",
] as const;

export type DraftSection = typeof DRAFT_SECTIONS[number];

export interface SectionContent {
  background: string;
  summary: string;
  drawings: string;
  description: string;
  claims: string;
  abstract: string;
}

interface DraftingContextType {
  currentSection: DraftSection;
  setCurrentSection: (section: DraftSection) => void;
  completedSections: DraftSection[];
  setCompletedSections: (sections: DraftSection[]) => void;
  activeTab: "edit" | "preview";
  setActiveTab: (tab: "edit" | "preview") => void;
  isSaving: boolean;
  applicationId: string | null;
  setApplicationId: (id: string | null) => void;
  sectionContent: SectionContent;
  updateSectionContent: (section: DraftSection, content: string) => void;
  saveDraft: () => Promise<void>;
  handleNext: () => Promise<void>;
  handlePrevious: () => void;
  handleSectionClick: (section: DraftSection) => void;
}

export const DraftingContext = createContext<DraftingContextType | undefined>(undefined);

interface DraftingProviderProps {
  children: ReactNode;
}

export const DraftingProvider: React.FC<DraftingProviderProps> = ({ children }) => {
  const [currentSection, setCurrentSection] = useState<DraftSection>("background");
  const [completedSections, setCompletedSections] = useState<DraftSection[]>([]);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isSaving, setIsSaving] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [sectionContent, setSectionContent] = useState<SectionContent>({
    background: "",
    summary: "",
    drawings: "",
    description: "",
    claims: "",
    abstract: "",
  });

  const updateSectionContent = (section: DraftSection, content: string) => {
    setSectionContent(prev => ({
      ...prev,
      [section]: content
    }));
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
  
  const handleNext = async () => {
    // Mark current section as completed if there's content
    if (sectionContent[currentSection]?.trim() && !completedSections.includes(currentSection)) {
      setCompletedSections([...completedSections, currentSection]);
    }
    
    // Save content to database
    await saveDraft();
    
    const currentIndex = DRAFT_SECTIONS.indexOf(currentSection);
    if (currentIndex < DRAFT_SECTIONS.length - 1) {
      const nextSection = DRAFT_SECTIONS[currentIndex + 1];
      setCurrentSection(nextSection);
    } else {
      // Last section completed
      setActiveTab("preview");
    }
  };
  
  const handlePrevious = () => {
    const currentIndex = DRAFT_SECTIONS.indexOf(currentSection);
    if (currentIndex > 0) {
      const prevSection = DRAFT_SECTIONS[currentIndex - 1];
      setCurrentSection(prevSection);
    }
  };
  
  const handleSectionClick = (section: DraftSection) => {
    setCurrentSection(section);
    setActiveTab("edit");
  };

  // Load existing draft
  React.useEffect(() => {
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
          
          const sectionMapping: Record<string, DraftSection> = {
            background: "background",
            description: "description",
            claims: "claims", 
            abstract: "abstract",
            summary: "summary",
            drawings: "drawings"
          };
          
          Object.entries(sectionMapping).forEach(([dbField, sectionName]) => {
            if (draft[dbField]) {
              newSectionContent[sectionName] = draft[dbField];
              newCompletedSections.push(sectionName);
            }
          });
          
          setSectionContent(newSectionContent);
          setCompletedSections(newCompletedSections);
        }
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    };
    
    loadExistingDraft();
  }, []);

  return (
    <DraftingContext.Provider value={{
      currentSection,
      setCurrentSection,
      completedSections,
      setCompletedSections,
      activeTab,
      setActiveTab,
      isSaving,
      applicationId,
      setApplicationId,
      sectionContent,
      updateSectionContent,
      saveDraft,
      handleNext,
      handlePrevious,
      handleSectionClick
    }}>
      {children}
    </DraftingContext.Provider>
  );
};

export const useDrafting = () => {
  const context = useContext(DraftingContext);
  if (context === undefined) {
    throw new Error('useDrafting must be used within a DraftingProvider');
  }
  return context;
};
