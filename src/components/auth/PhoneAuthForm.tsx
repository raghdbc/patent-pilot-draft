import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[0-9]+$/, "Must be a valid phone number"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "Verification code must be 6 digits"),
});

type PhoneValues = z.infer<typeof phoneSchema>;
type OTPValues = z.infer<typeof otpSchema>;

export function PhoneAuthForm() {
  const { signInWithPhone, verifyOTP, isLoading } = useAuth();
  const [codeSent, setCodeSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const phoneForm = useForm<PhoneValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  const otpForm = useForm<OTPValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onPhoneSubmit(data: PhoneValues) {
    try {
      const formattedPhone = formatPhoneNumber(data.phone);
      await signInWithPhone(formattedPhone);
      setPhoneNumber(formattedPhone);
      setCodeSent(true);
    } catch (error) {
      console.error("Phone auth error:", error);
    }
  }

  async function onOTPSubmit(data: OTPValues) {
    try {
      await verifyOTP(phoneNumber, data.otp);
    } catch (error) {
      console.error("OTP verification error:", error);
    }
  }

  // Format phone number to ensure it has international format
  function formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, "");
    
    // If the phone starts with a "+", keep it
    if (phone.startsWith("+")) {
      return "+" + digits;
    }
    
    // If no country code provided, assume it's a US/Canada number
    if (!phone.includes("+")) {
      return "+1" + digits;
    }
    
    return phone;
  }

  return (
    <div className="space-y-6">
      {!codeSent ? (
        <Form {...phoneForm}>
          <form
            onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}
            className="space-y-4"
          >
            <FormField
              control={phoneForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+1234567890"
                      type="tel"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Send Verification Code
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...otpForm}>
          <form
            onSubmit={otpForm.handleSubmit(onOTPSubmit)}
            className="space-y-4"
          >
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <InputOTP 
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                      render={({ slots }) => (
                        <InputOTPGroup>
                          {slots.map((slot, index) => (
                            <InputOTPSlot key={index} {...slot} index={index} />
                          ))}
                        </InputOTPGroup>
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Verify Code
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setCodeSent(false)}
                disabled={isLoading}
              >
                Change Phone Number
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
