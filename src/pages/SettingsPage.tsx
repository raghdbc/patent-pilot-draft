
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const { profile, loading, updateProfile } = useProfile();
  const { user } = useAuth();
  
  const [formValues, setFormValues] = useState({
    full_name: "",
    organization: "",
    phone: "",
  });
  
  // Update form values when profile is loaded
  useState(() => {
    if (profile) {
      setFormValues({
        full_name: profile.full_name || "",
        organization: profile.organization || "",
        phone: profile.phone || "",
      });
    }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = async () => {
    setSaving(true);
    await updateProfile(formValues);
    setSaving(false);
  };
  
  return (
    <MainLayout>
      <div className="main-section">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account, subscription, and preferences
          </p>
        </div>
        
        <Tabs
          defaultValue="account"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex justify-center py-4">
                    <Loader className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input 
                        id="full_name" 
                        name="full_name"
                        value={formValues.full_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        value={user?.email || ""} 
                        type="email"
                        disabled 
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization</Label>
                      <Input 
                        id="organization" 
                        name="organization"
                        value={formValues.organization}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        value={formValues.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave} disabled={saving || loading}>
                  {saving && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Update your password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Change Password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  Manage your subscription and billing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-md bg-primary/5 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-lg">Pro Plan</h3>
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      Current
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    <p>Unlimited patent drafts and forms</p>
                    <p>Advanced AI drafting assistance</p>
                    <p>Priority support</p>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>₹5,999/year</span>
                    <span>Renews on: April 15, 2025</span>
                  </div>
                </div>
                
                <Alert>
                  <AlertTitle>Need more from your plan?</AlertTitle>
                  <AlertDescription>
                    Contact our sales team for custom enterprise solutions for your organization.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3">
                <Button variant="default">Manage Subscription</Button>
                <Button variant="outline">View Billing History</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Preferences</CardTitle>
                <CardDescription>
                  Customize your experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Email Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive updates about your patent applications
                    </div>
                  </div>
                  <div>
                    <input
                      id="notifications"
                      type="checkbox"
                      className="h-4 w-4"
                      defaultChecked
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autosave">Autosave</Label>
                    <div className="text-sm text-muted-foreground">
                      Automatically save your drafts every 5 minutes
                    </div>
                  </div>
                  <div>
                    <input
                      id="autosave"
                      type="checkbox"
                      className="h-4 w-4"
                      defaultChecked
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
