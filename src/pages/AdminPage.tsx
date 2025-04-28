
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data - in a real implementation, this would come from an API/database
  const users = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@university.edu",
      status: "active",
      subscription: "Pro",
      projects: 5,
      lastActive: "2023-05-15",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@college.edu",
      status: "active",
      subscription: "Basic",
      projects: 2,
      lastActive: "2023-05-12",
    },
    {
      id: "3",
      name: "Charlie Davis",
      email: "charlie@institute.edu",
      status: "inactive",
      subscription: "Trial",
      projects: 1,
      lastActive: "2023-04-28",
    },
    {
      id: "4",
      name: "Diana Wilson",
      email: "diana@university.edu",
      status: "active",
      subscription: "Enterprise",
      projects: 12,
      lastActive: "2023-05-15",
    },
    {
      id: "5",
      name: "Edward Thompson",
      email: "edward@college.edu",
      status: "suspended",
      subscription: "Basic",
      projects: 3,
      lastActive: "2023-03-10",
    },
  ];
  
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <MainLayout>
      <div className="main-section">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor usage, manage users, and view system statistics
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Users</CardTitle>
              <CardDescription>Active and inactive users</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">128</p>
              <p className="text-sm text-muted-foreground">
                <span className="text-green-500">+12%</span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Patent Projects</CardTitle>
              <CardDescription>Total created projects</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">347</p>
              <p className="text-sm text-muted-foreground">
                <span className="text-green-500">+24%</span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Subscriptions</CardTitle>
              <CardDescription>Paid subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">72</p>
              <p className="text-sm text-muted-foreground">
                <span className="text-green-500">+8%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="users" className="mb-8">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Subscription</TableHead>
                        <TableHead>Projects</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.status === "active"
                                  ? "default"
                                  : user.status === "inactive"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.subscription}</TableCell>
                          <TableCell>{user.projects}</TableCell>
                          <TableCell>{user.lastActive}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-muted-foreground">
                    Showing {filteredUsers.length} of {users.length} users
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="projects" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Management</CardTitle>
                <CardDescription>
                  Monitor and manage patent projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This section allows administrators to monitor all patent projects in the system.
                </p>
                
                {/* This would be implemented with real project data in a full implementation */}
                <div className="h-64 flex items-center justify-center border rounded-md bg-slate-50">
                  <p className="text-muted-foreground">
                    Project management dashboard would be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscriptions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
                <CardDescription>
                  Monitor and manage user subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This section allows administrators to monitor and manage subscription plans and user subscriptions.
                </p>
                
                {/* This would be implemented with real subscription data in a full implementation */}
                <div className="h-64 flex items-center justify-center border rounded-md bg-slate-50">
                  <p className="text-muted-foreground">
                    Subscription management dashboard would be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure application settings and parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This section allows administrators to configure system settings and parameters.
                </p>
                
                {/* This would be implemented with real system settings in a full implementation */}
                <div className="h-64 flex items-center justify-center border rounded-md bg-slate-50">
                  <p className="text-muted-foreground">
                    System settings dashboard would be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
