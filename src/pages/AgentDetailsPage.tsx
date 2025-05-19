
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AgentDetailsPage() {
  const { toast } = useToast();
  const [agentData, setAgentData] = useState({
    name: "",
    inpaNo: "",
    mobileNo: "",
    address: {
      name: "",
      postalAddress: "",
      telephoneNo: "",
      mobileNo: "",
      faxNo: "",
      email: ""
    }
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setAgentData({
        ...agentData,
        [parent]: {
          ...agentData[parent as keyof typeof agentData] as any,
          [child]: value
        }
      });
    } else {
      setAgentData({
        ...agentData,
        [field]: value
      });
    }
  };

  const handleSave = () => {
    // Here we would save the agent details to the database
    toast({
      title: "Agent details saved",
      description: "Your agent details have been saved successfully."
    });
  };

  return (
    <MainLayout>
      <div className="main-section">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Patent Agent Details</h1>
          </div>
          <p className="text-muted-foreground">
            Add your authorized registered patent agent information
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Agent Information</CardTitle>
            <CardDescription>
              This information will be used in Form 1 and other patent documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="agent">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="agent">Authorized Agent</TabsTrigger>
                <TabsTrigger value="address">Address for Service</TabsTrigger>
              </TabsList>
              
              <TabsContent value="agent" className="space-y-4 pt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="agent-name">Name</Label>
                    <Input 
                      id="agent-name" 
                      value={agentData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="inpa-no">
                      IN/PA Registration Number
                      <span className="text-xs text-muted-foreground ml-1">(Required for authorized patent agents)</span>
                    </Label>
                    <Input 
                      id="inpa-no" 
                      value={agentData.inpaNo}
                      onChange={(e) => handleInputChange('inpaNo', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="mobile-no">
                      Mobile Number
                      <span className="text-xs text-muted-foreground ml-1">(OTP verification required)</span>
                    </Label>
                    <Input 
                      id="mobile-no" 
                      type="tel"
                      value={agentData.mobileNo}
                      onChange={(e) => handleInputChange('mobileNo', e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="address" className="space-y-4 pt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="address-name">Name</Label>
                    <Input 
                      id="address-name" 
                      value={agentData.address.name}
                      onChange={(e) => handleInputChange('address.name', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="postal-address">Postal Address</Label>
                    <Input 
                      id="postal-address" 
                      value={agentData.address.postalAddress}
                      onChange={(e) => handleInputChange('address.postalAddress', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="telephone-no">Telephone Number</Label>
                    <Input 
                      id="telephone-no" 
                      type="tel"
                      value={agentData.address.telephoneNo}
                      onChange={(e) => handleInputChange('address.telephoneNo', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="address-mobile-no">
                      Mobile Number
                      <span className="text-xs text-muted-foreground ml-1">(OTP verification required)</span>
                    </Label>
                    <Input 
                      id="address-mobile-no" 
                      type="tel"
                      value={agentData.address.mobileNo}
                      onChange={(e) => handleInputChange('address.mobileNo', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="fax-no">Fax Number</Label>
                    <Input 
                      id="fax-no" 
                      value={agentData.address.faxNo}
                      onChange={(e) => handleInputChange('address.faxNo', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">
                      Email Address
                      <span className="text-xs text-muted-foreground ml-1">(OTP verification required)</span>
                    </Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={agentData.address.email}
                      onChange={(e) => handleInputChange('address.email', e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Agent Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
