
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormTooltip } from "./FormTooltip";

interface PatentForm {
  id: string;
  title: string;
  description: string;
  tooltip: string;
}

interface PatentFormSelectorProps {
  onSelect: (formId: string) => void;
}

const patentForms: PatentForm[] = [
  {
    id: "form1",
    title: "Form 1",
    description: "Application for Grant of Patent",
    tooltip: "Form 1 is the primary application form for filing a patent in India. It includes details about the applicant, inventor, and invention title."
  },
  {
    id: "form2",
    title: "Form 2",
    description: "Provisional/Complete Specification",
    tooltip: "Form 2 contains the detailed technical specification of your invention, including description, claims, and abstract."
  },
  {
    id: "form3",
    title: "Form 3",
    description: "Statement and Undertaking",
    tooltip: "Form 3 requires information about corresponding patent applications filed in other countries for the same invention."
  },
  {
    id: "form5",
    title: "Form 5",
    description: "Declaration as to Inventorship",
    tooltip: "Form 5 is used to declare the true and first inventor(s) of the invention."
  }
];

export function PatentFormSelector({ onSelect }: PatentFormSelectorProps) {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);

  const handleSelect = () => {
    if (selectedForm) {
      onSelect(selectedForm);
    }
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Select Patent Form</CardTitle>
        <CardDescription>
          Choose the patent form you want to fill out
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedForm || ""}
          onValueChange={setSelectedForm}
          className="space-y-4"
        >
          {patentForms.map((form) => (
            <div
              key={form.id}
              className={`flex items-center space-x-3 border rounded-md p-4 transition-colors ${
                selectedForm === form.id ? "border-primary bg-secondary" : "border-slate-200"
              }`}
            >
              <RadioGroupItem value={form.id} id={form.id} />
              <Label
                htmlFor={form.id}
                className="flex flex-1 items-center cursor-pointer"
              >
                <div>
                  <div className="font-medium">{form.title}</div>
                  <div className="text-sm text-slate-500">
                    {form.description}
                  </div>
                </div>
                <FormTooltip content={form.tooltip} />
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSelect}
          disabled={!selectedForm}
          className="w-full"
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
