"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What services does Bittive offer?",
    answer:
      "Bittive offers a comprehensive range of digital services including web development, mobile app development, UI/UX design, digital strategy consulting, and custom software solutions. We work with businesses of all sizes to bring their digital ideas to life.",
  },
  {
    question: "How does the project process work?",
    answer:
      "Our process typically involves an initial consultation to understand your needs, followed by a proposal and planning phase. Once approved, we move into design and development, with regular check-ins and updates. After thorough testing, we launch your project and provide ongoing support as needed.",
  },
  {
    question: "How long does it take to complete a project?",
    answer:
      "Project timelines vary depending on complexity and scope. A simple website might take 4-6 weeks, while a complex application could take several months. During our initial consultation, we'll provide a more accurate timeline based on your specific requirements.",
  },
  {
    question: "Do you work with startups and small businesses?",
    answer:
      "Absolutely! We love working with startups and small businesses. We understand the unique challenges and opportunities they face, and we tailor our approach to fit their needs and budget while delivering high-quality solutions.",
  },
  {
    question: "What technologies do you specialize in?",
    answer:
      "We specialize in modern web and mobile technologies including React, Next.js, Node.js, React Native, Flutter, and various backend frameworks. We stay up-to-date with the latest technologies to ensure we're providing the most efficient and effective solutions.",
  },
  {
    question: "Do you provide ongoing maintenance and support?",
    answer:
      "Yes, we offer various maintenance and support packages to keep your digital products running smoothly after launch. These can include regular updates, security patches, performance optimization, and technical support.",
  },
];

const FAQSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about working with us? Find answers to common questions below.
          </p>
        </div>

        <motion.div
          className="max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={itemVariants}>
                <AccordionItem value={`item-${index}`} className="border rounded-lg bg-white shadow-sm">
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                    <span className="text-lg font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <div className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-md transition-colors">
            <a href="mailto:info@bittive.fi">Contact Us</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;