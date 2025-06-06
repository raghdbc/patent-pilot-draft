
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Save, Download, FileCheck } from "lucide-react";
import { FormProgress } from "../FormProgress";
import { patentFormSchema, emptyPatentFormValues } from "./patentFormSchema";
import { ApplicationTypeSection } from "./ApplicationTypeSection";
import { InventorDetailsSection } from "./InventorDetailsSection";
import { PreConfiguredApplicantSection } from "./PreConfiguredApplicantSection";
import { ApplicantDetailsSection } from "./ApplicantDetailsSection";
import { ApplicationDetailsSection } from "./ApplicationDetailsSection";
import { PublicationExaminationSection } from "./PublicationExaminationSection";
import { AgentServiceSection } from "./AgentServiceSection";
import { FormSummary } from "./FormSummary";

const TOTAL_STEPS = 7;

export function MultiStepPatentForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  
  const form = useForm({
    resolver: zodResolver(patentFormSchema),
    defaultValues: emptyPatentFormValues,
    mode: "onChange"
  });
  
  // Load saved data when component mounts
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('patentFormData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        form.reset(parsedData);
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  }, [form]);
  
  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSaveProgress = async () => {
    try {
      setIsSaving(true);
      
      // Get current form values
      const formData = form.getValues();
      
      // Save to localStorage
      localStorage.setItem('patentFormData', JSON.stringify(formData));
      
      toast({
        title: "Progress saved",
        description: "Your form progress has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving form progress:", error);
      toast({
        title: "Save failed",
        description: "There was a problem saving your progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDownloadDocument = async () => {
    try {
      setIsGenerating(true);
      
      // Here you would typically generate and download a document
      // For this simulation, we'll just wait a bit
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a JSON blob and trigger download
      const formData = form.getValues();
      const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `patent-application-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download complete",
        description: "Your patent application JSON data has been downloaded.",
      });
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        title: "Download failed",
        description: "There was a problem generating your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      // Save the final form data
      localStorage.setItem('patentFormData', JSON.stringify(data));
      
      console.log("Form submitted with data:", data);
      
      // Switch to preview tab on successful submission
      setActiveTab("preview");
      
      toast({
        title: "Form submitted",
        description: "Your patent application has been submitted successfully.",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Load saved form data if available
  const loadSavedData = () => {
    try {
      const savedData = localStorage.getItem('patentFormData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        form.reset(parsedData);
        toast({
          title: "Data loaded",
          description: "Your previously saved form data has been loaded.",
        });
      } else {
        toast({
          title: "No saved data",
          description: "No previously saved data was found.",
        });
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
      toast({
        title: "Error loading data",
        description: "There was a problem loading your saved data.",
        variant: "destructive",
      });
    }
  };
  
  // Get step completion status
  const getStepValidationStatus = (step: number) => {
    switch (step) {
      case 1: // Application Type
        return form.formState.dirtyFields.applicationType !== undefined;
      case 2: // Inventor Details
        return Array.isArray(form.watch('inventors')) && form.watch('inventors').length > 0;
      case 3: // Pre-Configured Applicant
        return form.watch('wantToPreConfigure') !== undefined;
      case 4: // Applicant Details
        return form.watch('applicantMode') !== undefined;
      case 5: // Application Details
        return form.watch('title')?.length > 0;
      case 6: // Publication & Examination
        if (form.watch('applicationType') === 'provisional') return true;
        return form.watch('publicationPreference') !== undefined && 
               form.watch('examinationPreference') !== undefined;
      case 7: // Agent & Service Details
        return form.watch('agentDetails.agentName')?.length > 0 && 
               form.watch('addressForService.serviceName')?.length > 0;
      default:
        return false;
    }
  };
  
  // Build form steps array for progress display
  const formSteps = [
    { label: "Application Type", completed: getStepValidationStatus(1) },
    { label: "Inventor Details", completed: getStepValidationStatus(2) },
    { label: "Pre-Config", completed: getStepValidationStatus(3) },
    { label: "Applicants", completed: getStepValidationStatus(4) },
    { label: "Application", completed: getStepValidationStatus(5) },
    { label: "Pub & Exam", completed: getStepValidationStatus(6) },
    { label: "Agent Details", completed: getStepValidationStatus(7) }
  ];
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Patent Application Form</CardTitle>
              <CardDescription className="mt-1">
                Complete all sections to create your patent application
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadSavedData}
                type="button"
              >
                Load Saved Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveProgress}
                disabled={isSaving}
                type="button"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Progress
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "edit" | "preview")}>
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="edit">Edit Form</TabsTrigger>
              <TabsTrigger value="preview" disabled={!form.formState.isSubmitSuccessful}>Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="space-y-6">
              <FormProgress 
                currentStep={currentStep} 
                totalSteps={TOTAL_STEPS} 
                steps={formSteps}
              />
              
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Step 1: Application Type */}
                {currentStep === 1 && (
                  <div className="animate-fade-in">
                    <ApplicationTypeSection form={form} />
                  </div>
                )}
                
                {/* Step 2: Inventor Details */}
                {currentStep === 2 && (
                  <div className="animate-fade-in">
                    <InventorDetailsSection form={form} />
                  </div>
                )}
                
                {/* Step 3: Pre-configured Applicant */}
                {currentStep === 3 && (
                  <div className="animate-fade-in">
                    <PreConfiguredApplicantSection form={form} />
                  </div>
                )}
                
                {/* Step 4: Applicant Details */}
                {currentStep === 4 && (
                  <div className="animate-fade-in">
                    <ApplicantDetailsSection form={form} />
                  </div>
                )}
                
                {/* Step 5: Application Details */}
                {currentStep === 5 && (
                  <div className="animate-fade-in">
                    <ApplicationDetailsSection form={form} />
                  </div>
                )}
                
                {/* Step 6: Publication & Examination Preferences */}
                {currentStep === 6 && (
                  <div className="animate-fade-in">
                    <PublicationExaminationSection form={form} />
                  </div>
                )}
                
                {/* Step 7: Agent Details & Address for Service */}
                {currentStep === 7 && (
                  <div className="animate-fade-in">
                    <AgentServiceSection form={form} />
                  </div>
                )}
                
                {/* Navigation buttons */}
                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  
                  {currentStep < TOTAL_STEPS ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="preview">
              <div className="animate-fade-in space-y-8">
                <Card className="bg-green-50 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl flex items-center text-green-600">
                      <FileCheck className="h-6 w-6 mr-2" />
                      Application Ready for Filing
                    </CardTitle>
                    <CardDescription>
                      Your patent application has been prepared successfully
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <FormSummary 
                  form={form} 
                  onEdit={() => setActiveTab("edit")}
                  onDownload={handleDownloadDocument}
                  isGenerating={isGenerating}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
