
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { FormTooltip } from "../FormTooltip";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface AgentServiceSectionProps {
  form: UseFormReturn<any>;
}

export function AgentServiceSection({ form }: AgentServiceSectionProps) {
  const [isVerifyingAgentMobile, setIsVerifyingAgentMobile] = useState(false);
  const [isVerifyingServiceMobile, setIsVerifyingServiceMobile] = useState(false);
  
  const handleVerifyMobile = (fieldName: string) => {
    const mobileNumber = form.watch(fieldName);
    if (!mobileNumber || mobileNumber.length < 10) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      });
      return;
    }
    
    if (fieldName.includes("agentDetails")) {
      setIsVerifyingAgentMobile(true);
    } else {
      setIsVerifyingServiceMobile(true);
    }
    
    // Simulate OTP verification
    setTimeout(() => {
      toast({
        title: "OTP Sent",
        description: `A verification code has been sent to ${mobileNumber}`,
      });
      
      // Reset verification state after simulating process
      if (fieldName.includes("agentDetails")) {
        setIsVerifyingAgentMobile(false);
      } else {
        setIsVerifyingServiceMobile(false);
      }
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      {/* Agent Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Agent Details</h3>
        
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="agentDetails.inpaNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      IN/PA Number
                      <FormTooltip content="Enter your Indian Patent Agent registration number" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., IN/PA/12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="agentDetails.agentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name of the patent agent" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="agentDetails.agentMobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Mobile Number
                      <FormTooltip content="Will be used for OTP verification" />
                    </FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="10-digit mobile number" {...field} />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleVerifyMobile('agentDetails.agentMobile')}
                        disabled={isVerifyingAgentMobile}
                        className="whitespace-nowrap"
                      >
                        {isVerifyingAgentMobile ? "Sending OTP..." : "Verify OTP"}
                      </Button>
                    </div>
                    <FormDescription>
                      OTP will be sent to this number for verification
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="agentDetails.agentEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="agent@example.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Address for Service */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Address for Service in India</h3>
        
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="addressForService.serviceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name of person/entity for service" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="addressForService.mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Mobile Number
                      <FormTooltip content="Will be used for OTP verification" />
                    </FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="10-digit mobile number" {...field} />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleVerifyMobile('addressForService.mobile')}
                        disabled={isVerifyingServiceMobile}
                        className="whitespace-nowrap"
                      >
                        {isVerifyingServiceMobile ? "Sending OTP..." : "Verify OTP"}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="addressForService.telephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telephone (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Landline number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="addressForService.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="service@example.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="addressForService.fax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fax (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Fax number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="addressForService.postalAddress"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Postal Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Complete postal address for service" 
                        className="min-h-20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
