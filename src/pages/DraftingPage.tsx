
import { MainLayout } from "@/components/layout/MainLayout";
import { DraftingSteps } from "@/components/drafting/DraftingSteps";

export default function DraftingPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Patent Drafting</h1>
          <p className="text-muted-foreground">
            Create your complete patent specification with AI assistance
          </p>
        </div>
        
        <DraftingSteps />
      </div>
    </MainLayout>
  );
}
