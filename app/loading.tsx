"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Sparkles, Code, Palette, Rocket } from "lucide-react";

const steps = [
  {
    icon: Sparkles,
    title: "Analyzing your business",
    description: "Understanding your brand and creating a unique identity",
  },
  {
    icon: Palette,
    title: "Designing your website",
    description: "Applying your chosen colors and creating a beautiful layout",
  },
  {
    icon: Code,
    title: "Generating content",
    description: "Writing engaging copy and creating sections for your website",
  },
  {
    icon: Rocket,
    title: "Finalizing your website",
    description: "Putting everything together and preparing for launch",
  },
];

export default function Loading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isFunnelToEditor, setIsFunnelToEditor] = useState(false);

  useEffect(() => {
    // Check if we're coming from the funnel
    const fromFunnel = searchParams.get("from") === "funnel";
    const toEditor = pathname.startsWith("/website/editor");
    setIsFunnelToEditor(fromFunnel && toEditor);
  }, [pathname, searchParams]);

  if (isFunnelToEditor) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Creating Your Website
            </h1>
            <p className="text-xl text-gray-600">
              We're setting up your website with the selected template. This
              might take a few moments...
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative w-64 h-64 mx-auto"
          >
            <motion.div
              className="absolute inset-0 border-4 border-purple-200 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-0 border-4 border-purple-500 rounded-full"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.8, 0.5, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Default loading spinner
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex items-center justify-center">
      <motion.div
        className="w-16 h-16 border-4 border-purple-200 rounded-full"
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <motion.div
          className="w-full h-full border-4 border-purple-500 rounded-full border-t-transparent"
          animate={{
            rotate: -360,
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>
    </div>
  );
}
