"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type Plan = {
  title: string;
  price: string;
  features: string[];
};

const plans: Plan[] = [
  { title: "Basic", price: "$19/mo", features: ["Feature A", "Feature B", "Feature C"] },
  { title: "Pro", price: "$49/mo", features: ["Feature A", "Feature B", "Feature C", "Feature D"] },
];

export const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8 text-[#F59E0B]">Pricing Plans</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="border rounded-lg p-6 shadow-md"
            >
              <h3 className="text-2xl font-semibold mb-4">{plan.title}</h3>
              <p className="text-4xl font-bold mb-6">{plan.price}</p>
              <ul className="mb-6 space-y-2 text-left">
                {plan.features.map((feat) => (
                  <li key={feat} className="before:content-['✓'] before:text-[#EC4899] before:mr-2">
                    {feat}
                  </li>
                ))}
              </ul>
              <Button variant="default" className="w-full bg-[#F59E0B] hover:bg-[#D97706]">
                Choose Plan
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
