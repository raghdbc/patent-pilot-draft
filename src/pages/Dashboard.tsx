import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";
import { FileText, BookOpen, Download, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { user } = useAuth();
  const { loading, getProjectStats, getRecentProjects } = useProjects();
  
  const { formCount, draftCount, completedCount } = getProjectStats();
  const recentProjects = getRecentProjects();
  
  // Format date to display in a friendly way
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (error) {
      return 'Unknown date';
    }
  };
  
  return (
    <MainLayout>
      <div className="main-section">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-3xl font-bold mb-2 md:mb-0">
            {user ? `Welcome, ${user.user_metadata?.full_name || 'User'}` : 'Dashboard'}
          </h1>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/form1">
                <ClipboardList className="mr-2 h-4 w-4" />
                Form 1 - Patent Application
              </Link>
            </Button>
            <Button asChild>
              <Link to="/forms">
                <FileText className="mr-2 h-4 w-4" />
                New Patent Application
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Quick Actions Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:border-primary transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <ClipboardList className="mr-2 h-5 w-5" />
                  Form 1 - Application for Grant of Patent
                </CardTitle>
                <CardDescription>
                  File for patent protection with the official Form 1
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground mb-3">
                  Complete the standard patent application form with step-by-step guidance and automatic document generation.
                </p>
              </CardContent>
              <div className="p-3 pt-0">
                <Button className="w-full" asChild>
                  <Link to="/form1">
                    Start Form 1
                  </Link>
                </Button>
              </div>
            </Card>
            
            <Card className="hover:border-primary transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Advanced Patent Application
                </CardTitle>
                <CardDescription>
                  Comprehensive patent application with detailed sections
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground mb-3">
                  Use the advanced form for complex applications with multiple inventors, applicants, and detailed technical content.
                </p>
              </CardContent>
              <div className="p-3 pt-0">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/forms">
                    Start Advanced Form
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Patents</CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <p className="text-3xl font-bold">{formCount + draftCount}</p>
                  <p className="text-muted-foreground">Applications in progress</p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Documents</CardTitle>
              <Download className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <p className="text-3xl font-bold">{formCount * 2}</p>
                  <p className="text-muted-foreground">Generated documents</p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Completed</CardTitle>
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <p className="text-3xl font-bold">{completedCount}</p>
                  <p className="text-muted-foreground">Patent applications ready</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Applications</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="hover:border-primary transition-colors">
                  <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex justify-between text-sm">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </CardContent>
                  <div className="p-3 pt-0">
                    <Skeleton className="h-10 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : recentProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentProjects.map((project) => (
                <Card key={project.id} className="hover:border-primary transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription>
                      Patent Application
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last updated</span>
                      <span>{formatDate(project.updated_at)}</span>
                    </div>
                  </CardContent>
                  <div className="p-3 pt-0">
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/forms">
                        Continue
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground mb-4">You don't have any patent applications yet.</p>
              <div className="flex justify-center gap-2">
                <Button asChild>
                  <Link to="/form1">
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Start with Form 1
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/forms">
                    <FileText className="mr-2 h-4 w-4" />
                    Advanced Form
                  </Link>
                </Button>
              </div>
            </Card>
          )}
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
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/filing-guide">
                    View Guide
                  </Link>
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
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/filing-guide">
                    View Fees
                  </Link>
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
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/filing-guide">
                    View Guidelines
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
