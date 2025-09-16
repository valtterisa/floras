"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import { AuthModal, User } from "@/components/auth-modal";
import { getUserProfileAndSubscription } from "@/lib/actions/user-profile";

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

export default function Pricing({ user }: { user: User | null }) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [loading, setLoading] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);

  // Fetch current plan from Supabase
  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!user) return;

      try {
        const { data } = await getUserProfileAndSubscription();
        if (data?.subscription.plan) {
          setCurrentSubscription({ plan: data.subscription.plan });
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
    <section className="pb-16 pt-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Choose the perfect plan for your needs.
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
            {/* Animated background slider */}
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
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative flex flex-col h-full bg-white rounded-xl shadow-sm border p-8 ${
                plan.popular ? "border-black border-2" : "border-gray-300"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-sm font-medium px-4 py-1 rounded-full">
                  Most Ideal
                </div>
              )}
              {getCurrentPlanDisplay(plan)}
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-black">
                  {plan.name}
                </h3>
                <p className="text-gray-700 mb-6">{plan.description}</p>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-black">
                    {plan.price[billingCycle]}
                  </span>
                  {plan.price[billingCycle] !== "Free" &&
                    plan.name !== "Enterprise" && (
                      <span className="text-gray-600">/monthly</span>
                    )}
                </div>
                <ul className="space-y-4">
                  {plan.features.map(
                    (
                      feature,
                      index // @TODO: hotfix for now
                    ) => (
                      <li
                        key={feature + "-" + index}
                        className="flex items-start gap-3"
                      >
                        <Check className="h-5 w-5 text-black shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
              <Button
                onClick={() => handleCheckout(plan)}
                disabled={loading === plan.name}
                className={`mt-8 w-full ${getButtonVariant(plan)}`}
              >
                {getButtonText(plan)}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </section>
  );
}
