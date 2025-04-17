"use client"
import { motion } from "framer-motion";

const images = [
  "/images/dish1.jpg",
  "/images/dish2.jpg",
  "/images/dish3.jpg",
  "/images/dish4.jpg",
];

export function ImageGallery() {
  return (
    <section id="gallery" className="py-16 bg-white" aria-label="Image Gallery">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Our Specialties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((src, idx) => (
            <motion.div key={idx} whileHover={{ scale: 1.05 }} className="overflow-hidden rounded-lg">
              <img src={src} alt={`Gallery ${idx + 1}`} className="w-full h-64 object-cover" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
