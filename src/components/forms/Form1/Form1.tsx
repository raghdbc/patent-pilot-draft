import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import { useGenerateDocument } from "@/hooks/useGenerateDocument";
import { supabase } from "@/integrations/supabase/client";
import { createPatentApplication, formDataToApplicantData, updatePatentApplication } from "@/services/patentService";
import { form1Schema, Form1Values } from "./form1Schema";
import { FormProgress } from "../FormProgress";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { ApplicantSection } from "./ApplicantSection";
import { InventorSection } from "./InventorSection";
import { AdditionalDetailsSection } from "./sections/AdditionalDetailsSection";
import { FormPreview } from "./sections/FormPreview";

export function Form1() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [activeTab, setActiveTab] = useState("fillForm");
  const { generateDocument, isGenerating } = useGenerateDocument();
  const [isSaving, setIsSaving] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  
  const form = useForm<Form1Values>({
    resolver: zodResolver(form1Schema),
    defaultValues: {
      title: "",
      applicantType: "individual",
      applicationType: "ordinary",
      applicantName: "",
      applicantAddress: "",
      applicantNationality: "Indian",
      inventorName: "",
      inventorAddress: "",
      inventorNationality: "Indian",
      claimPriority: false,
      priorityDetails: "",
      additionalInfo: "",
    },
  });

  // Check if user is authenticated
  useState(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please login to save your patent applications.",
          variant: "destructive",
        });
      }
    };
    
    checkAuth();
  });

  async function onSubmit(data: Form1Values) {
    try {
      setIsSaving(true);
      
      // Check authentication status
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please login to save your patent applications.",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }
      
      // Prepare data to save
      const patentData = {
        user_id: session.user.id,
        title: data.title,
        application_type: data.applicationType,
        applicant_type: data.applicantType,
        applicant_name: data.applicantName,
        applicant_address: data.applicantAddress,
        applicant_nationality: data.applicantNationality,
        inventor_name: data.inventorName,
        inventor_address: data.inventorAddress,
        inventor_nationality: data.inventorNationality,
        claim_priority: data.claimPriority,
        priority_details: data.priorityDetails,
        additional_info: data.additionalInfo,
        status: "draft",
      };
      
      let savedApplication;
      
      if (applicationId) {
        // Update existing application
        savedApplication = await updatePatentApplication(applicationId, patentData);
        toast({
          title: "Application updated",
          description: "Your patent application has been updated successfully.",
        });
      } else {
        // Create new application
        savedApplication = await createPatentApplication(patentData);
        setApplicationId(savedApplication.id);
        toast({
          title: "Application saved",
          description: "Your patent application has been saved successfully.",
        });
      }
      
      // Switch to preview tab
      setActiveTab("preview");
    } catch (error) {
      console.error("Error saving application:", error);
      toast({
        title: "Error",
        description: "Failed to save your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSaveProgress = async () => {
    try {
      setIsSaving(true);
      
      // Check authentication status
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please login to save your patent applications.",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }
      
      // Get current form values, even if not complete
      const currentData = form.getValues();
      
      // Prepare data to save
      const patentData = {
        user_id: session.user.id,
        title: currentData.title || "Untitled Application",
        application_type: currentData.applicationType,
        applicant_type: currentData.applicantType,
        applicant_name: currentData.applicantName || "",
        applicant_address: currentData.applicantAddress || "",
        applicant_nationality: currentData.applicantNationality || "Indian",
        inventor_name: currentData.inventorName || "",
        inventor_address: currentData.inventorAddress || "",
        inventor_nationality: currentData.inventorNationality || "Indian",
        claim_priority: currentData.claimPriority,
        priority_details: currentData.priorityDetails || "",
        additional_info: currentData.additionalInfo || "",
        status: "draft",
      };
      
      let savedApplication;
      
      if (applicationId) {
        // Update existing application
        savedApplication = await updatePatentApplication(applicationId, patentData);
      } else {
        // Create new application
        savedApplication = await createPatentApplication(patentData);
        setApplicationId(savedApplication.id);
      }
      
      toast({
        title: "Progress saved",
        description: "Your progress has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving progress:", error);
      toast({
        title: "Error",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadDocument = async () => {
    try {
      const data = form.getValues();
      
      // Check if application is saved
      if (!applicationId) {
        await onSubmit(data);
      }
      
      // Format the data for the template based on the ApplicantData schema
      const templateData = formDataToApplicantData({
        ...data,
        id: applicationId,
        created_at: new Date().toISOString(),
      });

      await generateDocument("form1", templateData);
      toast({
        title: "Document generated",
        description: "Your Form 1 document has been generated successfully",
      });
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        title: "Error",
        description: "Failed to generate document. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Form 1 - Application for Grant of Patent</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSaveProgress} 
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Progress
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fillForm">Fill Form</TabsTrigger>
              <TabsTrigger value="preview" disabled={!form.formState.isSubmitted && !applicationId}>Preview & Download</TabsTrigger>
            </TabsList>
            
            <TabsContent value="fillForm" className="space-y-6 mt-6">
              <FormProgress currentStep={step} totalSteps={totalSteps} />
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Step 1: Basic Information */}
                  {step === 1 && <BasicInfoSection form={form} />}
                  
                  {/* Step 2: Applicant Information */}
                  {step === 2 && <ApplicantSection form={form} />}
                  
                  {/* Step 3: Inventor Information */}
                  {step === 3 && <InventorSection form={form} />}
                  
                  {/* Step 4: Additional Details */}
                  {step === 4 && <AdditionalDetailsSection form={form} />}
                  
                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={step === 1}
                    >
                      Previous
                    </Button>
                    
                    {step < totalSteps ? (
                      <Button type="button" onClick={nextStep}>
                        Next
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Complete Form"
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-6 animate-fade-in">
              <FormPreview 
                form={form} 
                onEdit={() => setActiveTab("fillForm")} 
                onDownload={handleDownloadDocument}
                isGenerating={isGenerating}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
