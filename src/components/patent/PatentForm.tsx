
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
import { Loader2, FileCheck } from "lucide-react";
import { patentFormSchema, emptyPatentFormValues } from "@/components/forms/PatentApplication/patentFormSchema";

import { MultiStepPatentForm } from "@/components/forms/PatentApplication/MultiStepPatentForm";

export function PatentForm() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Patent Application Form</h1>
        <p className="text-muted-foreground">
          Complete all sections to create your patent application document and submission forms
        </p>
      </div>
      
      <MultiStepPatentForm />
    </div>
  );
}
