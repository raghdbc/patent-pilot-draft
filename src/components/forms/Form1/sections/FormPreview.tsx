
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { Form1Values } from "../form1Schema";

interface FormPreviewProps {
  form: UseFormReturn<Form1Values>;
  onEdit: () => void;
  onDownload: () => void;
  isGenerating: boolean;
}

export function FormPreview({ form, onEdit, onDownload, isGenerating }: FormPreviewProps) {
  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Form 1 Preview</h3>
      
      <div className="space-y-4">
        <div className="text-center border-b pb-4">
          <h4 className="text-xl font-bold">THE PATENTS ACT, 1970</h4>
          <h5>(39 OF 1970)</h5>
          <h4 className="text-lg font-semibold mt-2">APPLICATION FOR GRANT OF PATENT</h4>
          <p className="text-sm text-slate-500">[See Section 7, 54 & 135 and Rule 20 (1)]</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <h5 className="font-medium">1. TITLE OF INVENTION</h5>
            <p className="border p-2 bg-slate-50 rounded">{form.watch("title")}</p>
          </div>

          <div>
            <h5 className="font-medium">2. TYPE OF APPLICATION</h5>
            <div className="border p-2 bg-slate-50 rounded">
              <p><strong>Application Type:</strong> {form.watch("applicationType").toUpperCase()}</p>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium">3. APPLICANT</h5>
            <div className="border p-2 bg-slate-50 rounded space-y-1">
              <p><strong>Name:</strong> {form.watch("applicantName")}</p>
              <p><strong>Address:</strong> {form.watch("applicantAddress")}</p>
              <p><strong>Nationality:</strong> {form.watch("applicantNationality")}</p>
              <p><strong>Type:</strong> {form.watch("applicantType") === "individual" ? "Natural Person" : "Organization"}</p>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium">4. INVENTOR</h5>
            <div className="border p-2 bg-slate-50 rounded space-y-1">
              <p><strong>Name:</strong> {form.watch("inventorName")}</p>
              <p><strong>Address:</strong> {form.watch("inventorAddress")}</p>
              <p><strong>Nationality:</strong> {form.watch("inventorNationality")}</p>
            </div>
          </div>
          
          {form.watch("additionalInfo") && (
            <div>
              <h5 className="font-medium">5. ADDITIONAL INFORMATION</h5>
              <p className="border p-2 bg-slate-50 rounded whitespace-pre-line">{form.watch("additionalInfo")}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 flex justify-center space-x-4">
        <Button onClick={onEdit} variant="outline">
          Edit Form
        </Button>
        <Button onClick={onDownload} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Word Document"
          )}
        </Button>
      </div>
    </div>
  );
}
