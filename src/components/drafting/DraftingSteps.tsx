
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { DraftPreview } from "./DraftPreview";
import { Loader2, Save } from "lucide-react";
import { DraftingProvider, useDrafting, DRAFT_SECTIONS } from "./DraftingContext";
import { DraftingSectionSelector } from "./DraftingSectionSelector";
import { DraftingNavigation } from "./DraftingNavigation";
import { DraftingSectionContent } from "./DraftingSectionContent";

function DraftingContent() {
  const { 
    completedSections, 
    activeTab, 
    setActiveTab, 
    isSaving, 
    sectionContent,
    saveDraft
  } = useDrafting();
  
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
                  currentStep={completedSections.length + (completedSections.length < DRAFT_SECTIONS.length ? 0.5 : 0)} 
                  totalSteps={DRAFT_SECTIONS.length}
                />
                
                <DraftingSectionSelector />
                <DraftingSectionContent />
                <DraftingNavigation />
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

export function DraftingSteps() {
  return (
    <DraftingProvider>
      <DraftingContent />
    </DraftingProvider>
  );
}
