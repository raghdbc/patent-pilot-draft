
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  calculateTotalFee, 
  formatCurrency, 
  calculateTotalSheets 
} from "@/utils/patentFormHelpers";
import { ApplicantCategory } from "@/models/patentApplication";

interface FormSummaryProps {
  form: UseFormReturn<any>;
  onEdit: () => void;
  onDownload: () => void;
  isGenerating?: boolean;
}

export function FormSummary({ form, onEdit, onDownload, isGenerating = false }: FormSummaryProps) {
  const [viewMode, setViewMode] = useState<"summary" | "json">("summary");
  const formData = form.getValues();
  
  // Calculate total sheets
  const totalSheets = calculateTotalSheets(formData.sheetCounts || {});
  
  // Determine primary applicant category for fee calculation
  const getPrimaryApplicantCategory = (): ApplicantCategory => {
    if (formData.applicantMode === 'fixed' && formData.applicants?.fixed) {
      return formData.applicants.fixed.category;
    } else if (formData.applicants?.additionalApplicants?.length > 0) {
      return formData.applicants.additionalApplicants[0].category;
    }
    return 'natural_person';
  };
  
  const applicantCategory = getPrimaryApplicantCategory();
  
  // Calculate fees
  const isEarlyPublication = formData.publicationPreference === 'early';
  const isExpeditedExamination = formData.examinationPreference === 'expedited';
  
  const feeSummary = calculateTotalFee(
    applicantCategory,
    'online', // Default to online mode
    totalSheets,
    formData.others?.numberOfClaims || 0,
    isEarlyPublication,
    isExpeditedExamination,
    formData.applicationType
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Application Summary</h3>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onEdit}>
            Edit Application
          </Button>
          <Button onClick={onDownload} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Download Document"}
          </Button>
        </div>
      </div>
      
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "summary" | "json")}>
        <TabsList className="grid grid-cols-2 w-full max-w-xs">
          <TabsTrigger value="summary">Summary View</TabsTrigger>
          <TabsTrigger value="json">JSON Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Basic Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Application Type:</span>
                  <span className="font-medium">{formData.applicationType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Title:</span>
                  <span className="font-medium">{formData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Inventors:</span>
                  <span className="font-medium">{formData.inventors?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Applicants:</span>
                  <span className="font-medium">
                    {(formData.applicantMode === "fixed" ? 1 : 0) + 
                     (formData.applicants?.fromInventors?.length || 0) + 
                     (formData.applicants?.additionalApplicants?.length || 0)}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fee Summary</CardTitle>
                <CardDescription>Estimated fees for online filing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Basic Filing Fee:</span>
                  <span className="font-medium">{formatCurrency(feeSummary.basicFee)}</span>
                </div>
                {feeSummary.earlyPublicationFee !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Early Publication Fee:</span>
                    <span className="font-medium">{formatCurrency(feeSummary.earlyPublicationFee)}</span>
                  </div>
                )}
                {feeSummary.expeditedExaminationFee !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expedited Exam Fee:</span>
                    <span className="font-medium">{formatCurrency(feeSummary.expeditedExaminationFee)}</span>
                  </div>
                )}
                {feeSummary.excessSheetFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Excess Sheet Fee:</span>
                    <span className="font-medium">{formatCurrency(feeSummary.excessSheetFee)}</span>
                  </div>
                )}
                {feeSummary.excessClaimFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Excess Claim Fee:</span>
                    <span className="font-medium">{formatCurrency(feeSummary.excessClaimFee)}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total Fee:</span>
                    <span>{formatCurrency(feeSummary.totalFee)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="json" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Application JSON Data</CardTitle>
              <CardDescription>Complete data structure for backend processing</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-50 p-4 rounded-md overflow-x-auto text-xs max-h-[400px] overflow-y-auto">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
