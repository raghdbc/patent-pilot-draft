
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PatentFormSelector } from "@/components/forms/PatentFormSelector";
import { Form1 } from "@/components/forms/Form1/Form1";

export default function FormsPage() {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  
  const renderSelectedForm = () => {
    switch (selectedForm) {
      case "form1":
        return <Form1 />;
      case "form2":
      case "form3":
      case "form5":
        // In a real implementation, these would be separate components
        return (
          <div className="p-8 border rounded-lg bg-white text-center">
            <h3 className="text-xl font-bold mb-4">Form {selectedForm.replace("form", "")} Implementation</h3>
            <p className="text-muted-foreground mb-4">
              This form would be implemented with specific fields and validations similar to Form 1.
            </p>
            <button
              onClick={() => setSelectedForm(null)}
              className="text-primary hover:underline"
            >
              Back to form selection
            </button>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <MainLayout>
      <div className="main-section">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Patent Forms</h1>
          <p className="text-muted-foreground">
            Fill out the required forms for your Indian patent application
          </p>
        </div>
        
        {!selectedForm ? (
          <div className="flex justify-center">
            <PatentFormSelector onSelect={setSelectedForm} />
          </div>
        ) : (
          renderSelectedForm()
        )}
      </div>
    </MainLayout>
  );
}
