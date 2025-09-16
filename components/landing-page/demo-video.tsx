"use client";

import { motion } from "framer-motion";

export function DemoVideo() {
  return (
    <section className="relative py-12 bg-linear-to-b from-[#faf2ff] to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Want to see how we can
            <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}
              help you?
            </span>
          </h2>
          <p className="text-gray-600">(Watch the video below)</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto relative rounded-xl overflow-hidden shadow-xl"
        >
          <div className="relative aspect-video">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/_ih1ptOguaM?si=08bCNC0AGl7_g25p"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
