
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";
import { FileText, FilePlus, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  // Mock data - in a real implementation, this would come from an API/database
  const recentProjects = [
    { id: "1", name: "Smart IoT Device", type: "drafting", lastUpdated: "2023-05-15" },
    { id: "2", name: "Machine Learning Algorithm", type: "form", lastUpdated: "2023-05-10" },
    { id: "3", name: "Mobile App Interface", type: "drafting", lastUpdated: "2023-04-28" },
  ];
  
  return (
    <MainLayout>
      <div className="main-section">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-3xl font-bold mb-2 md:mb-0">Dashboard</h1>
          <div className="flex gap-3">
            <Button asChild>
              <Link to="/forms">
                <FileText className="mr-2 h-4 w-4" />
                New Patent Form
              </Link>
            </Button>
            <Button asChild>
              <Link to="/drafting">
                <FilePlus className="mr-2 h-4 w-4" />
                New Patent Draft
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Patent Forms</CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">2</p>
              <p className="text-muted-foreground">Forms in progress</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Patent Drafts</CardTitle>
              <FilePlus className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">3</p>
              <p className="text-muted-foreground">Drafts in progress</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Completed</CardTitle>
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">1</p>
              <p className="text-muted-foreground">Patent applications ready</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentProjects.map((project) => (
              <Card key={project.id} className="hover:border-primary transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription>
                    {project.type === "form" ? "Patent Form" : "Patent Draft"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last updated</span>
                    <span>{project.lastUpdated}</span>
                  </div>
                </CardContent>
                <div className="p-3 pt-0">
                  <Button variant="outline" className="w-full">
                    Continue
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filing Process Guide</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-muted-foreground">Step-by-step guide for filing with the Indian Patent Office</p>
              </CardContent>
              <div className="p-3 pt-0">
                <Button variant="outline" className="w-full">
                  View Guide
                </Button>
              </div>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Patent Fees</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-muted-foreground">Current fee structure for different types of applications</p>
              </CardContent>
              <div className="p-3 pt-0">
                <Button variant="outline" className="w-full">
                  View Fees
                </Button>
              </div>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Drawing Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-muted-foreground">Technical requirements for patent drawings</p>
              </CardContent>
              <div className="p-3 pt-0">
                <Button variant="outline" className="w-full">
                  View Guidelines
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
