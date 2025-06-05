
import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PatentApplicationForm } from "@/components/patent/PatentApplicationForm";
import { FileText, Plus, Loader2 } from "lucide-react";
import { getPatentApplications } from "@/services/patentService";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

type PatentApplication = {
  id: string;
  title: string;
  application_type: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export default function FormsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<PatentApplication[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthAndLoadApplications = async () => {
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setIsAuthenticated(true);
          // Load user's patent applications
          const data = await getPatentApplications(session.user.id);
          setApplications(data);
        } else {
          setIsAuthenticated(false);
          // Show form directly if not authenticated
          setShowNewForm(true);
        }
      } catch (error) {
        console.error("Error loading applications:", error);
        toast({
          title: "Error",
          description: "Failed to load patent applications.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoadApplications();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCreateNew = () => {
    setShowNewForm(true);
  };

  const handleBackToList = () => {
    setShowNewForm(false);
  };

  return (
    <MainLayout>
      <div className="main-section">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold">
                {showNewForm ? "Patent Application" : "Patent Applications"}
              </h1>
            </div>
            
            {!showNewForm && isAuthenticated && (
              <Button onClick={handleCreateNew} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Application
              </Button>
            )}
            
            {showNewForm && applications.length > 0 && (
              <Button variant="outline" onClick={handleBackToList}>
                Back to List
              </Button>
            )}
          </div>
          
          {showNewForm ? (
            <p className="text-muted-foreground">
              Complete all sections to generate both patent forms and a comprehensive draft document
            </p>
          ) : (
            <p className="text-muted-foreground">
              View and manage your patent applications
            </p>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading applications...</span>
          </div>
        ) : showNewForm ? (
          <PatentApplicationForm />
        ) : applications.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No applications yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first patent application to get started
            </p>
            <Button onClick={handleCreateNew}>
              Create New Application
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <Card key={app.id} className="group transition-all hover:border-primary">
                <CardHeader>
                  <CardTitle className="line-clamp-2 text-lg">{app.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Type:</span>
                      <span className="text-sm font-medium">
                        {app.application_type.charAt(0).toUpperCase() + app.application_type.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge variant={app.status === "draft" ? "outline" : "default"}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Created:</span>
                      <span className="text-sm">{formatDate(app.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Updated:</span>
                      <span className="text-sm">{formatDate(app.updated_at)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white">
                    Continue Editing
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
