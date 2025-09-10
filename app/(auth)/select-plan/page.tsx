"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/logo";

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

export default function SelectPlanPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Get pre-selected plan from URL
  const preSelectedPlan = searchParams.get("plan");

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Redirect to signup if not authenticated
        router.push("/signup");
        return;
      }

      setUser(user);
    };

    getUser();
  }, [router]);

  const handleSelectPlan = async (plan: any) => {
    if (!user) return;

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
      } else {
        const errorText = await response.text();
        console.error("Failed to create checkout:", errorText);
        toast({
          title: "Error",
          description: "Failed to start checkout process. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const getButtonText = (plan: any) => {
    if (plan.name === "Enterprise") {
      return "Contact Sales";
    }
    return loading === plan.name ? "Processing..." : "Select Plan";
  };

  const getButtonVariant = (plan: any) => {
    if (
      preSelectedPlan &&
      plan.name.toLowerCase() === preSelectedPlan.toLowerCase()
    ) {
      return "bg-black text-white hover:bg-gray-800 border-black";
    }
    if (plan.popular) {
      return "bg-black text-white hover:bg-gray-800 border-black";
    }
    return "bg-white text-black hover:bg-gray-50 border-gray-300 border";
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-end mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors px-4 py-2 rounded-lg hover:bg-white border border-gray-200 hover:border-gray-300 bg-white/80"
          >
            Skip for now
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <div className="flex justify-center mb-8">
            <div className="h-12 flex items-center text-xl md:text-3xl font-bold text-gray-900 text-center">
              <span className="flex items-center">
                <Logo className="mx-2 size-7 md:size-12" />
                Builddrr
              </span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Welcome! Please select a plan to get started with Builddrr.
          </p>

          <div className="relative inline-flex items-center bg-white rounded-xl p-1.5 border border-gray-300 shadow-sm">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`relative z-10 px-8 py-3 text-sm font-semibold rounded-lg transition-all duration-200 text-center min-w-[100px] ${
                billingCycle === "monthly"
                  ? "text-white shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`relative z-10 px-8 py-3 text-sm font-semibold rounded-lg transition-all duration-200 text-center min-w-[100px] ${
                billingCycle === "yearly"
                  ? "text-white shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Yearly
            </button>
            <div
              className={`absolute top-1.5 bottom-1.5 bg-black rounded-lg transition-all duration-300 ease-out shadow-lg ${
                billingCycle === "monthly"
                  ? "left-1.5 right-[50.5%]"
                  : "left-[49.5%] right-1.5"
              }`}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col h-full bg-white rounded-xl shadow-sm border p-8 ${
                plan.popular ||
                (preSelectedPlan &&
                  plan.name.toLowerCase() === preSelectedPlan.toLowerCase())
                  ? "border-black border-2"
                  : "border-gray-300"
              }`}
            >
              {(plan.popular ||
                (preSelectedPlan &&
                  plan.name.toLowerCase() ===
                    preSelectedPlan.toLowerCase())) && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-sm font-medium px-4 py-1 rounded-full">
                  {preSelectedPlan &&
                  plan.name.toLowerCase() === preSelectedPlan.toLowerCase()
                    ? "Selected"
                    : "Most Popular"}
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-black">
                  {plan.name}
                </h3>
                <p className="text-gray-700 mb-6">{plan.description}</p>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-black">
                    {plan.price[billingCycle]}
                  </span>
                  {plan.price[billingCycle] !== "Custom" && (
                    <span className="text-gray-600">/month</span>
                  )}
                </div>
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={feature + "-" + featureIndex}
                      className="flex items-start gap-3"
                    >
                      <Check className="h-5 w-5 text-black flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={() => handleSelectPlan(plan)}
                disabled={loading === plan.name}
                className={`mt-8 w-full ${getButtonVariant(plan)}`}
              >
                {getButtonText(plan)}
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            You can always upgrade your plan later from your dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
