
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
  const formValues = form.getValues();
  
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
            <p className="border p-2 bg-slate-50 rounded">{formValues.title}</p>
          </div>

          <div>
            <h5 className="font-medium">2. TYPE OF APPLICATION</h5>
            <div className="border p-2 bg-slate-50 rounded">
              <p><strong>Application Type:</strong> {formValues.applicationType.toUpperCase()}</p>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium">3. APPLICANT</h5>
            <div className="border p-2 bg-slate-50 rounded space-y-1">
              <p><strong>Name:</strong> {formValues.applicantName}</p>
              <p><strong>Address:</strong> {formValues.applicantAddress}</p>
              <p><strong>Nationality:</strong> {formValues.applicantNationality}</p>
              <p><strong>Type:</strong> {formValues.applicantType === "individual" ? "Natural Person" : formValues.applicantType}</p>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium">4. INVENTOR</h5>
            <div className="border p-2 bg-slate-50 rounded space-y-1">
              <p><strong>Name:</strong> {formValues.inventorName}</p>
              <p><strong>Address:</strong> {formValues.inventorAddress}</p>
              <p><strong>Nationality:</strong> {formValues.inventorNationality}</p>
              {formValues.inventorAsApplicant && (
                <p><strong>Note:</strong> Inventor is also the applicant</p>
              )}
            </div>
          </div>
          
          {formValues.claimPriority && (
            <div>
              <h5 className="font-medium">5. PRIORITY CLAIM</h5>
              <div className="border p-2 bg-slate-50 rounded space-y-1">
                <p><strong>Priority Country:</strong> {formValues.priorityCountry}</p>
                <p><strong>Application Number:</strong> {formValues.priorityApplicationNumber}</p>
                <p><strong>Filing Date:</strong> {formValues.priorityFilingDate}</p>
                {formValues.priorityDetails && (
                  <p><strong>Details:</strong> {formValues.priorityDetails}</p>
                )}
              </div>
            </div>
          )}
          
          <div>
            <h5 className="font-medium">6. FEE INFORMATION</h5>
            <div className="border p-2 bg-slate-50 rounded space-y-1">
              <p><strong>Total Fee:</strong> ₹{formValues.fees}</p>
              <p><strong>Claims Count:</strong> {formValues.claimCount}</p>
              <p><strong>Drawings Count:</strong> {formValues.drawingCount}</p>
              <p><strong>Publication Type:</strong> {formValues.publicationPreference}</p>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium">7. DECLARATIONS</h5>
            <div className="border p-2 bg-slate-50 rounded space-y-1">
              <p><strong>Declaration of Inventorship:</strong> {formValues.declarationOfInventorship ? "Yes" : "No"}</p>
              <p><strong>Declaration of Ownership:</strong> {formValues.declarationOfOwnership ? "Yes" : "No"}</p>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium">8. ATTACHMENTS</h5>
            <div className="border p-2 bg-slate-50 rounded space-y-1">
              <p><strong>Provisional Specification:</strong> {formValues.provisionalSpecification ? "Attached" : "Not Attached"}</p>
              <p><strong>Complete Specification:</strong> {formValues.completeSpecification ? "Attached" : "Not Attached"}</p>
              <p><strong>Drawings:</strong> {formValues.drawings ? "Attached" : "Not Attached"}</p>
              <p><strong>Sequence Listing:</strong> {formValues.sequenceListing ? "Attached" : "Not Attached"}</p>
            </div>
          </div>
          
          {formValues.additionalInfo && (
            <div>
              <h5 className="font-medium">9. ADDITIONAL INFORMATION</h5>
              <p className="border p-2 bg-slate-50 rounded whitespace-pre-line">{formValues.additionalInfo}</p>
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
