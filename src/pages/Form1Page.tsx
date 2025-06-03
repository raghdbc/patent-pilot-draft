
import { MainLayout } from "@/components/layout/MainLayout";
import { Form1 } from "@/components/forms/Form1/Form1";
import { ClipboardList } from "lucide-react";

export default function Form1Page() {
  return (
    <MainLayout>
      <div className="main-section">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Form 1 - Application for Grant of Patent</h1>
          </div>
          <p className="text-muted-foreground">
            Complete the official patent application form with step-by-step guidance and automatic document generation
          </p>
        </div>
        
        <Form1 />
      </div>
    </MainLayout>
  );
}
