
import { MainLayout } from "@/components/layout/MainLayout";
import { PatentApplicationForm } from "@/components/patent/PatentApplicationForm";
import { FileText } from "lucide-react";

export default function FormsPage() {
  return (
    <MainLayout>
      <div className="main-section">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Patent Application</h1>
          </div>
          <p className="text-muted-foreground">
            Complete all sections to generate both patent forms and a comprehensive draft document
          </p>
        </div>
        
        <PatentApplicationForm />
      </div>
    </MainLayout>
  );
}
