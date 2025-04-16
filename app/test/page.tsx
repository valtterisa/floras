"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ComponentPage() {
    return (
        <main
            className="font-sans text-gray-800 antialiased"
        >
            {/* Hero Section */}
            <motion.section
                data-file-location="/app/page.tsx"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-blue-600 text-white py-20 px-4 text-center"
            >
                <h1 className="text-5xl font-bold mb-4" aria-label="Bittive - Software Development Agency" data-editable="true">
                    Bittive
                </h1>
                <p className="text-xl mb-6" aria-label="Empowering your vision with innovative software solutions." data-editable="true">
                    Empowering your vision with innovative software solutions.
                </p>
                <a
                    href="#contact"
                    className="inline-block bg-[#10B981] hover:bg-green-600 text-white py-3 px-6 rounded shadow transition-colors"
                    aria-label="Get in Touch"
                    data-editable="true"
                >
                    Get in Touch
                </a>
            </motion.section>

            {/* Services Section */}
            <motion.section
                data-file-location="/app/page.tsx"
                id="services"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="py-16 px-4 bg-white"
            >
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-8" aria-label="Our Services" data-editable="true">
                        Our Services
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <li className="border p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                            <h3 className="text-2xl font-semibold mb-2" aria-label="Custom Software Development" data-editable="true">
                                Custom Software Development
                            </h3>
                            <p aria-label="Tailored solutions to fit your business needs." data-editable="true">
                                Tailored solutions to fit your business needs.
                            </p>
                        </li>
                        <li className="border p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                            <h3 className="text-2xl font-semibold mb-2" aria-label="Mobile Application Development" data-editable="true">
                                Mobile Application Development
                            </h3>
                            <p aria-label="Innovative mobile apps for Android and iOS platforms." data-editable="true">
                                Innovative mobile apps for Android and iOS platforms.
                            </p>
                        </li>
                        <li className="border p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                            <h3 className="text-2xl font-semibold mb-2" aria-label="User Interface & UX Design" data-editable="true">
                                UI/UX Design
                            </h3>
                            <p aria-label="Creating intuitive and engaging digital experiences." data-editable="true">
                                Creating intuitive and engaging digital experiences.
                            </p>
                        </li>
                        <li className="border p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                            <h3 className="text-2xl font-semibold mb-2" aria-label="Cloud & DevOps Solutions" data-editable="true">
                                Cloud & DevOps Solutions
                            </h3>
                            <p aria-label="Scalable infrastructure and streamlined operations." data-editable="true">
                                Scalable infrastructure and streamlined operations.
                            </p>
                        </li>
                    </ul>
                </div>
            </motion.section>

            {/* Portfolio Section */}
            <motion.section
                data-file-location="/app/page.tsx"
                id="portfolio"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                className="py-16 px-4 bg-gray-50"
            >
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-8" aria-label="Our Portfolio" data-editable="true">
                        Our Portfolio
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="border rounded-lg overflow-hidden shadow">
                            <Image
                                src="https://placehold.co/400x300"
                                alt="Project 1 screenshot"
                                width={400}
                                height={300}
                            />
                            <div className="p-4">
                                <h3 className="text-2xl font-semibold mb-2" aria-label="Project One" data-editable="true">
                                    Project One
                                </h3>
                                <p aria-label="A groundbreaking software solution." data-editable="true">
                                    A groundbreaking software solution.
                                </p>
                            </div>
                        </div>
                        <div className="border rounded-lg overflow-hidden shadow">
                            <Image
                                src="https://placehold.co/400x300"
                                alt="Project 2 screenshot"
                                width={400}
                                height={300}
                            />
                            <div className="p-4">
                                <h3 className="text-2xl font-semibold mb-2" aria-label="Project Two" data-editable="true">
                                    Project Two
                                </h3>
                                <p aria-label="Innovative design meeting modern functionality." data-editable="true">
                                    Innovative design meeting modern functionality.
                                </p>
                            </div>
                        </div>
                        <div className="border rounded-lg overflow-hidden shadow">
                            <Image
                                src="https://placehold.co/400x300"
                                alt="Project 3 screenshot"
                                width={400}
                                height={300}
                            />
                            <div className="p-4">
                                <h3 className="text-2xl font-semibold mb-2" aria-label="Project Three" data-editable="true">
                                    Project Three
                                </h3>
                                <p aria-label="Delivering excellence in every line of code." data-editable="true">
                                    Delivering excellence in every line of code.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* About Section */}
            <motion.section
                data-file-location="/app/page.tsx"
                id="about"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
                className="py-16 px-4 bg-white"
            >
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-8" aria-label="About Bittive" data-editable="true">
                        About Us
                    </h2>
                    <p className="text-lg leading-relaxed mb-4" aria-label="Bittive is a cutting-edge software development agency dedicated to turning your vision into a reality. With a team of experienced developers and designers, we create custom solutions tailored to your business needs." data-editable="true">
                        Bittive is a cutting-edge software development agency dedicated to turning your vision into a reality. With a team of experienced developers and designers, we create custom solutions tailored to your business needs.
                    </p>
                    <p className="text-lg leading-relaxed" aria-label="Our commitment to innovation, quality, and client satisfaction drives us to deliver industry-leading solutions that empower businesses around the globe." data-editable="true">
                        Our commitment to innovation, quality, and client satisfaction drives us to deliver industry-leading solutions that empower businesses around the globe.
                    </p>
                </div>
            </motion.section>

            {/* Contact Section */}
            <motion.section
                data-file-location="/app/page.tsx"
                id="contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
                className="py-16 px-4 bg-blue-50"
            >
                <div className="max-w-xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-8" aria-label="Contact Us" data-editable="true">
                        Contact Us
                    </h2>
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name:
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email:
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                Message:
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={4}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 p-2"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 px-6 bg-[#10B981] hover:bg-green-600 text-white font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                            aria-label="Submit Contact Form"
                            data-editable="true"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </motion.section>
        </main>
    );
}