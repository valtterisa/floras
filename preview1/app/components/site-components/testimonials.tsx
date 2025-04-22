"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    content:
      "Bittive transformed our business idea into a fully functional digital platform. Their team was professional, responsive, and delivered beyond our expectations.",
    author: "Matti Heikkinen",
    position: "CEO, TechFin Solutions",
    image: "https://placehold.co/100x100/6366F1/FFFFFF?text=MH",
  },
  {
    id: 2,
    content:
      "Working with Bittive was a game-changer for our startup. They understood our vision and helped us create a product that our users love. Highly recommended!",
    author: "Johanna Koskinen",
    position: "Founder, EcoTrack",
    image: "https://placehold.co/100x100/8B5CF6/FFFFFF?text=JK",
  },
  {
    id: 3,
    content:
      "The team at Bittive is exceptional. They not only delivered a beautiful website but also provided valuable insights that improved our overall digital strategy.",
    author: "Pekka Järvinen",
    position: "Marketing Director, Nordic Retail",
    image: "https://placehold.co/100x100/EC4899/FFFFFF?text=PJ",
  },
  {
    id: 4,
    content:
      "Bittive's attention to detail and commitment to quality is impressive. They took the time to understand our needs and delivered a solution that perfectly fits our business.",
    author: "Laura Salminen",
    position: "Operations Manager, HealthTech Innovations",
    image: "https://placehold.co/100x100/6366F1/FFFFFF?text=LS",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say about working with Bittive.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              <Card className="border-none shadow-lg bg-gradient-to-br from-gray-50 to-white">
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-4 border-white shadow-md">
                      <Image
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Quote className="text-primary/20 h-12 w-12 mb-4" />
                      <p className="text-lg md:text-xl text-gray-700 mb-6 italic">
                        "{testimonials[currentIndex].content}"
                      </p>
                      <div>
                        <h4 className="font-semibold text-lg">
                          {testimonials[currentIndex].author}
                        </h4>
                        <p className="text-gray-500">
                          {testimonials[currentIndex].position}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentIndex ? "bg-primary" : "bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 md:-translate-x-6 bg-white shadow-md hidden md:flex"
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 md:translate-x-6 bg-white shadow-md hidden md:flex"
            onClick={nextTestimonial}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;