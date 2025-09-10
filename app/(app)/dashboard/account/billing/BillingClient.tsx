"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Star, Crown, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { managePolarSubscription } from "@/lib/polar";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

interface BillingClientProps {
  subscription: any | null;
  products: any | null;
  customerPortalUrl: string | null;
}

const BillingClient: React.FC<BillingClientProps> = ({
  subscription,
  products,
  customerPortalUrl,
}) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const searchParams = useSearchParams();

  // Get pre-selected plan from URL
  const preSelectedPlan = searchParams.get("plan");

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
      planKey: "hobby",
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
      planKey: "pro",
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
      planKey: "enterprise",
    },
  ];

  const getCurrentPlan = () => {
    if (!subscription) return null;
    // Map subscription to plan name
    const subName = subscription.product?.name?.toLowerCase();
    return plans.find((plan) => plan.planKey === subName) || null;
  };

  const currentPlan = getCurrentPlan();

  const handleSelectPlan = async (plan: any) => {
    if (plan.name === "Enterprise") {
      const subject = encodeURIComponent("Enterprise Plan Inquiry");
      const body = encodeURIComponent(
        `Hi,\n\nI'm interested in the Enterprise plan for Builddrr.\n\nPlease provide more information about pricing and features.\n\nBest regards`
      );
      window.location.href = `mailto:sales@builddrr.com?subject=${subject}&body=${body}`;
      return;
    }

    setLoading(plan.name);
    if (customerPortalUrl) {
      window.location.href = customerPortalUrl;
    }
    setLoading(null);
  };

  const isCurrentPlan = (plan: any) => {
    return currentPlan?.name === plan.name;
  };

  const getButtonText = (plan: any) => {
    if (plan.name === "Enterprise") {
      return "Contact Sales";
    }
    if (isCurrentPlan(plan)) {
      return "Current Plan";
    }
    return loading === plan.name ? "Loading..." : "Select Plan";
  };

  const getButtonVariant = (plan: any) => {
    if (isCurrentPlan(plan)) {
      return "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300";
    }
    if (
      plan.popular ||
      (preSelectedPlan &&
        plan.name.toLowerCase() === preSelectedPlan.toLowerCase())
    ) {
      return "bg-black text-white hover:bg-gray-800 border-black";
    }
    return "bg-white text-black hover:bg-gray-50 border-gray-300 border";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <div className="flex justify-center mb-8">
            <div className="h-12 flex items-center text-xl md:text-3xl font-bold text-gray-900 text-center">
              <span className="flex items-center">
                <Crown className="mx-2 size-7 md:size-12 text-yellow-600" />
                Billing & Plans
              </span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Manage Your Subscription
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            {currentPlan
              ? `You're currently on the ${currentPlan.name} plan. Upgrade or manage your subscription below.`
              : "Choose a plan to unlock all features and start building amazing websites."}
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
                isCurrentPlan(plan) ||
                (preSelectedPlan &&
                  plan.name.toLowerCase() === preSelectedPlan.toLowerCase())
                  ? "border-black border-2"
                  : "border-gray-300"
              }`}
            >
              {plan.popular && !isCurrentPlan(plan) && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-sm font-medium px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              {isCurrentPlan(plan) && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                  Current Plan
                </div>
              )}

              {preSelectedPlan &&
                plan.name.toLowerCase() === preSelectedPlan.toLowerCase() &&
                !isCurrentPlan(plan) && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                    Selected
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
                disabled={loading === plan.name || isCurrentPlan(plan)}
                className={`mt-8 w-full ${getButtonVariant(plan)}`}
              >
                {getButtonText(plan)}
              </Button>
            </motion.div>
          ))}
        </div>

        {currentPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-2xl mx-auto mt-12"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">
                  Subscription Management
                </CardTitle>
                <CardDescription>
                  Manage your billing, update payment methods, and view invoices
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  onClick={() => {
                    if (customerPortalUrl) {
                      window.location.href = customerPortalUrl;
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Open Customer Portal
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BillingClient;
