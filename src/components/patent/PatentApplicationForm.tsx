import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { patentFormSchema } from "@/components/forms/PatentApplication/schemas/patentFormSchema";
import { emptyPatentFormValues } from "@/components/forms/PatentApplication/schemas/patentFormSchema";

export function PatentApplicationForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(patentFormSchema),
    defaultValues: emptyPatentFormValues,
    mode: "onChange"
  });
  
  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      console.log("Form data submitted:", data);
      // Handle submission logic here
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patent Application Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {/* Form content will go here */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                Submit Application
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
