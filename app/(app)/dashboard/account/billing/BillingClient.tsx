"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Crown,
  CreditCard,
  Calendar,
  ArrowRight,
  Mail,
  X,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { AuthModal, User } from "@/components/auth-modal";
import { SiteHeader } from "@/components/site-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const plans = [
  {
    name: "Hobby",
    description: "Perfect for personal projects and small websites",
    price: {
      monthly: "$2",
      yearly: "$1.5",
    },
    features: [
      "2 Websites",
      "5 AI Chat Messages Per Month",
      "Email Support",
      "Chat to Edit",
    ],
    planId: {
      monthly:
        process.env.NODE_ENV === "production"
          ? "051eac59-7a81-4286-bf83-62f101fcc4d7"
          : "92d0fb9d-49ca-413a-91ff-8ec3c3fc5933",
      yearly:
        process.env.NODE_ENV === "production"
          ? "fe016688-50e8-4413-a11c-5c688220754f"
          : "8b11d941-56de-465c-a9a2-f2845ed895f2",
    },
  },
  {
    name: "Pro",
    description: "Ideal for growing businesses and professionals",
    price: {
      monthly: "$15",
      yearly: "$12",
    },
    features: [
      "Unlimited Websites",
      "20 AI Chat Messages Per Month",
      "Custom Domains",
      "Priority Support",
    ],
    popular: true,
    planId: {
      monthly:
        process.env.NODE_ENV === "production"
          ? "bcde8f52-3a0a-444e-b7fa-65f2b7b97801"
          : "0e982699-8b71-4a70-a298-f6e863ea9bae",
      yearly:
        process.env.NODE_ENV === "production"
          ? "c2d7b5b2-dff7-4fce-bf9b-e0c1fe50855e"
          : "0fe22ae3-d81d-4701-a29b-4735b3f92daa",
    },
  },
  {
    name: "Enterprise",
    description: "For large businesses and teams",
    price: {
      monthly: "Custom",
      yearly: "Custom",
    },
    features: [
      "Unlimited websites",
      "Unlimited AI Chat Messages",
      "Custom domains",
      "Priority support",
    ],
    planId: {
      monthly: "custom-plan-id",
      yearly: "custom-plan-id",
    },
  },
];

export default function BillingClient({ user }: { user: User | null }) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [loading, setLoading] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState<string>("");
  const [cancelComment, setCancelComment] = useState<string>("");
  const [isCancelling, setIsCancelling] = useState(false);

  // Fetch current plan from Supabase
  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!user) return;

      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();
          console.log("User profile data:", data);
          setCurrentSubscription({ plan: data.plan });
        }
      } catch (error) {
        console.error("Error fetching user plan:", error);
      }
    };

    fetchUserPlan();
  }, [user]);

  const handleCheckout = async (plan: any) => {
    if (!user) {
      // Store the selected plan in session storage for after signup
      sessionStorage.setItem("selectedPlan", plan.name.toLowerCase());
      setShowAuthModal(true);
      return;
    }

    // For Enterprise plan, open email instead of checkout
    if (plan.name === "Enterprise") {
      const subject = encodeURIComponent("Enterprise Plan Inquiry");
      const body = encodeURIComponent(
        `Hi,\n\nI'm interested in the Enterprise plan for Builddrr.\n\nPlease provide more information about pricing and features.\n\nBest regards,\n${user.user_metadata?.full_name || user.email}`
      );
      window.location.href = `mailto:sales@builddrr.com?subject=${subject}&body=${body}`;
      return;
    }

    setLoading(plan.name);
    try {
      const response = await fetch("/api/polar-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: plan.planId[billingCycle],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else if (response.status === 401) {
        // User is not authenticated, redirect to login
        window.location.href = "/login";
      } else {
        const errorText = await response.text();
        console.error("Failed to create checkout:", errorText);
        // Show user-friendly error message
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleAuthSuccess = (user: User) => {
    setShowAuthModal(false);

    // Check if there's a stored plan selection
    const selectedPlan = sessionStorage.getItem("selectedPlan");
    if (selectedPlan) {
      sessionStorage.removeItem("selectedPlan");
      // For existing logged-in users, redirect to billing instead of plan selection
      window.location.href = `/dashboard/account/billing?plan=${selectedPlan}`;
    }
  };

  const handleCancelSubscription = async () => {
    setIsCancelling(true);

    try {
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: cancelReason || "other",
          comment: cancelComment || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setCurrentSubscription(null);
        setShowCancelModal(false);
        setCancelReason("");
        setCancelComment("");

        // Show success message or refresh page
        window.location.reload();
      } else {
        console.error("Failed to cancel subscription:", data.error);
        // Show error message to user
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      // Show error message to user
    } finally {
      setIsCancelling(false);
    }
  };

  const isCurrentPlan = (plan: any) => {
    if (!currentSubscription) {
      return false;
    }

    // Map plan names to match Supabase plan values
    const planMapping: { [key: string]: string } = {
      "Hobby": "hobby",
      "Pro": "pro",
      "Enterprise": "enterprise",
    };

    const currentPlan = planMapping[plan.name];
    console.log("Plan check:", {
      planName: plan.name,
      currentPlan,
      userPlan: currentSubscription.plan,
      isMatch: currentSubscription.plan === currentPlan,
    });
    return currentSubscription.plan === currentPlan;
  };

  const getCurrentPlanDisplay = (plan: any) => {
    if (isCurrentPlan(plan)) {
      return (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gray-600 text-white text-sm font-medium px-4 py-1 rounded-full">
          Current Plan
        </div>
      );
    }
    return null;
  };

  const getButtonText = (plan: any) => {
    if (plan.name === "Enterprise") {
      return "Contact Sales";
    }
    if (isCurrentPlan(plan)) {
      return "Current Plan";
    }
    return loading === plan.name ? "Redirecting..." : "Get Started";
  };

  const getButtonVariant = (plan: any) => {
    if (isCurrentPlan(plan)) {
      return "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300";
    }
    if (plan.popular) {
      return "bg-black text-white hover:bg-gray-800 border-black";
    }
    return "bg-white text-black hover:bg-gray-50 border-gray-300 border";
  };

  return (
    <div className="min-h-screen ">
      <div className="mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <SiteHeader title={"Billing & Subscription"} />
        </motion.div>

        {/* Current Plan Overview */}
        {currentSubscription?.plan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-100 border-blue-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Current Plan
                    </CardTitle>
                    <CardDescription>
                      Your active subscription details
                    </CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    {currentSubscription.plan.charAt(0).toUpperCase() +
                      currentSubscription.plan.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Next billing:{" "}
                      {billingCycle === "monthly" ? "Monthly" : "Yearly"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowCancelModal(true)}
                      className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                      Cancel Plan
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Mail className="h-4 w-4" />
                      Contact Support
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Plan Selection Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentSubscription?.plan ? "Change Plan" : "Choose Your Plan"}
              </h2>
              <p className="text-gray-600">
                {currentSubscription?.plan
                  ? "Upgrade or downgrade your subscription"
                  : "Select a plan to get started"}
              </p>
            </div>
            <div className="flex items-center bg-white rounded-lg p-1 border shadow-sm">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  billingCycle === "monthly"
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  billingCycle === "yearly"
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`relative h-full ${
                  isCurrentPlan(plan)
                    ? "border-blue-500 bg-blue-50/50"
                    : plan.popular
                      ? "border-gray-900 shadow-lg"
                      : "border-gray-200"
                }`}
              >
                {plan.popular && !isCurrentPlan(plan) && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gray-900 text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}
                {isCurrentPlan(plan) && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white">
                      Current Plan
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    {isCurrentPlan(plan) && (
                      <Crown className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    {plan.description}
                  </CardDescription>
                  <div className="pt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">
                        {plan.price[billingCycle]}
                      </span>
                      {plan.price[billingCycle] !== "Custom" && (
                        <span className="text-gray-500">
                          /{billingCycle === "monthly" ? "month" : "year"}
                        </span>
                      )}
                    </div>
                    {/* {billingCycle === "yearly" &&
                      plan.name !== "Enterprise" && (
                        <p className="text-sm text-green-600 mt-1">
                          Save 20% with yearly billing
                        </p>
                      )} */}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={feature + "-" + featureIndex}
                        className="flex items-start gap-3"
                      >
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleCheckout(plan)}
                    disabled={
                      loading === plan.name ||
                      (isCurrentPlan(plan) && plan.name !== "Enterprise")
                    }
                    className={`w-full ${getButtonVariant(plan)}`}
                    size="lg"
                  >
                    {loading === plan.name ? (
                      "Processing..."
                    ) : isCurrentPlan(plan) ? (
                      plan.name === "Enterprise" ? (
                        "Contact Sales"
                      ) : (
                        "Current Plan"
                      )
                    ) : (
                      <>
                        {plan.name === "Enterprise"
                          ? "Contact Sales"
                          : "Select Plan"}
                        {plan.name !== "Enterprise" && (
                          <ArrowRight className="ml-2 h-4 w-4" />
                        )}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Billing Information */}
        {currentSubscription?.plan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Billing Information
                </CardTitle>
                <CardDescription>
                  Manage your payment methods and billing details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Payment Method</p>
                      <p className="text-sm text-gray-600">
                        •••• •••• •••• 4242
                      </p>
                    </div>
                    <Button variant="outline">Update</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Billing History</p>
                      <p className="text-sm text-gray-600">
                        View past invoices and receipts
                      </p>
                    </div>
                    <Button variant="outline">View History</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* Cancellation Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Cancel Subscription
            </DialogTitle>
            <DialogDescription>
              Your subscription will be cancelled at the end of the current
              billing period. You'll continue to have access until then.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">
                Why are you cancelling? (Optional)
              </Label>
              <Select value={cancelReason} onValueChange={setCancelReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="too_expensive">Too expensive</SelectItem>
                  <SelectItem value="missing_features">
                    Missing features
                  </SelectItem>
                  <SelectItem value="switched_service">
                    Switched to another service
                  </SelectItem>
                  <SelectItem value="unused">Not using it enough</SelectItem>
                  <SelectItem value="customer_service">
                    Customer service issues
                  </SelectItem>
                  <SelectItem value="low_quality">Quality concerns</SelectItem>
                  <SelectItem value="too_complex">Too complex</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cancel-comment">
                Additional feedback (Optional)
              </Label>
              <Textarea
                id="cancel-comment"
                placeholder="Tell us more about your experience..."
                value={cancelComment}
                onChange={(e) => setCancelComment(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCancelModal(false)}
              disabled={isCancelling}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={isCancelling}
              className="gap-2"
            >
              {isCancelling ? (
                "Cancelling..."
              ) : (
                <>
                  <X className="h-4 w-4" />
                  Cancel Subscription
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
