"use client";

import { motion } from "framer-motion";
import { Clock, Zap, Shield, Globe, BarChart, Users } from "lucide-react";

const benefits = [
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Save Time",
    description: "Create a professional website in minutes instead of weeks",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "No Technical Skills",
    description: "Build beautiful websites without any coding knowledge",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure & Reliable",
    description: "Enterprise-grade security and 99.9% uptime guarantee",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Mobile Responsive",
    description: "Your website looks great on all devices automatically",
  },
  {
    icon: <BarChart className="h-6 w-6" />,
    title: "SEO Optimized",
    description: "Built-in SEO tools to help you rank higher in search results",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "24/7 Support",
    description: "Get help whenever you need it from our expert team",
  },
];

export function ValueProposition() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose SiteForge?
          </h2>
          <p className="text-xl text-gray-600">
            We make website creation simple, fast, and affordable for everyone
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-white/50 backdrop-blur-sm px-8 py-4 rounded-full shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm font-medium">
                Trusted by 10,000+ businesses
              </span>
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm font-medium">4.9/5 average rating</span>
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-sm font-medium">99.9% uptime</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
