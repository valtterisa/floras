"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CheckoutSuccessClientProps {
  user: any;
  checkoutId?: string;
  sessionId?: string;
}

export default function CheckoutSuccessClient({
  user,
  checkoutId,
  sessionId,
}: CheckoutSuccessClientProps) {
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  );
  const [planName, setPlanName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      let attempts = 0;
      const maxAttempts = 10; // Check for up to 30 seconds (3s intervals)

      const pollStatus = async () => {
        try {
          attempts++;

          // Fetch user's current plan from our API
          const response = await fetch("/api/user/profile");
          if (response.ok) {
            const data = await response.json();

            if (data.plan && data.plan !== null) {
              // Plan has been updated by webhook
              setPlanName(data.plan);
              setStatus("success");

              // Redirect to billing page after 3 seconds
              setTimeout(() => {
                router.push("/dashboard/account/billing");
              }, 3000);
              return;
            }
          }

          // If we haven't found a plan yet and haven't exceeded max attempts
          if (attempts < maxAttempts) {
            setTimeout(pollStatus, 3000); // Poll every 3 seconds
          } else {
            // Timeout - webhook might have failed or taken too long
            setStatus("error");
          }
        } catch (error) {
          console.error("Error checking subscription status:", error);
          if (attempts >= maxAttempts) {
            setStatus("error");
          } else {
            setTimeout(pollStatus, 3000);
          }
        }
      };

      // Start polling after a short delay
      setTimeout(pollStatus, 2000);
    };

    checkSubscriptionStatus();
  }, [router]);

  const handleReturnToBilling = () => {
    router.push("/dashboard/account/billing");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4">
              {status === "processing" && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="h-16 w-16 text-blue-600" />
                </motion.div>
              )}
              {status === "success" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </motion.div>
              )}
              {status === "error" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <Crown className="h-16 w-16 text-orange-600" />
                </motion.div>
              )}
            </div>

            <CardTitle className="text-2xl">
              {status === "processing" && "Processing Your Subscription"}
              {status === "success" && "Welcome to Builddrr!"}
              {status === "error" && "Almost There!"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {status === "processing" && (
              <div className="space-y-3">
                <p className="text-gray-600">
                  We're setting up your account and activating your
                  subscription.
                </p>
                <p className="text-sm text-gray-500">
                  This usually takes just a few seconds...
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Your{" "}
                  <span className="font-semibold text-green-600 capitalize">
                    {planName}
                  </span>{" "}
                  plan has been activated successfully!
                </p>
                <p className="text-sm text-gray-500">
                  You'll be redirected to your billing page in a moment.
                </p>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3 }}
                  className="h-2 bg-green-200 rounded-full overflow-hidden"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3 }}
                    className="h-full bg-green-600 rounded-full"
                  />
                </motion.div>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Your payment was processed, but we're still setting up your
                  account.
                </p>
                <p className="text-sm text-gray-500">
                  Don't worry - your subscription is active and will be ready
                  shortly.
                </p>
                <Button onClick={handleReturnToBilling} className="w-full">
                  Go to Billing
                </Button>
              </div>
            )}

            {checkoutId && (
              <p className="text-xs text-gray-400 mt-6">
                Checkout ID: {checkoutId}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
