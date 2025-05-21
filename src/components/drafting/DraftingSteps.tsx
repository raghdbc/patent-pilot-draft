
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ArrowLeft, ArrowRight, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionContent } from "@/models/draftTypes";

interface Step {
  id: string;
  title: string;
}

interface DraftingStepsProps {
  steps: Step[];
  currentStepId: string;
  onStepChange: (stepId: string) => void;
  sections: SectionContent;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

export function DraftingSteps({ steps, currentStepId, onStepChange, sections, onSave, isSaving }: DraftingStepsProps) {
  const currentIndex = steps.findIndex(step => step.id === currentStepId);
  
  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      onStepChange(steps[currentIndex + 1].id);
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      onStepChange(steps[currentIndex - 1].id);
    }
  };
  
  const handleSave = async () => {
    await onSave();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {steps[currentIndex]?.title || "Draft Your Patent"}
            </h2>
            <Button 
              onClick={handleSave} 
              variant="outline"
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Draft
                </>
              )}
            </Button>
          </div>
          
          <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
            {steps.map((step, idx) => (
              <Button
                key={step.id}
                variant={currentStepId === step.id ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full flex items-center gap-1 whitespace-nowrap",
                  (sections[step.id.toLowerCase()] || "").length > 0 && "border-green-500"
                )}
                onClick={() => onStepChange(step.id)}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border">
                  {(sections[step.id.toLowerCase()] || "").length > 0 ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    idx + 1
                  )}
                </span>
                <span>{step.title}</span>
              </Button>
            ))}
          </div>
          
          <div className="flex justify-between mt-8">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={currentIndex === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={currentIndex === steps.length - 1}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
