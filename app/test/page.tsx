"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Code, Briefcase, Smartphone } from "lucide-react";

export default function Component() {
    return (
        <motion.main
            data-file-location="/app/index/page.tsx"
            className="flex flex-col min-h-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Header */}
            <header className="bg-white shadow-md">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <Link href="/" aria-label="Bittive Oy Home" data-editable="true" className="text-2xl font-bold text-[#EC4899]">
                        Bittive Oy
                    </Link>
                    <div className="flex space-x-6">
                        <Link href="#home" aria-label="Home" data-editable="true" className="text-gray-700 hover:text-[#F43F5E]">
                            Home
                        </Link>
                        <Link href="#about" aria-label="About" data-editable="true" className="text-gray-700 hover:text-[#F43F5E]">
                            About
                        </Link>
                        <Link href="#services" aria-label="Services" data-editable="true" className="text-gray-700 hover:text-[#F43F5E]">
                            Services
                        </Link>
                        <Link href="#contact" aria-label="Contact" data-editable="true" className="text-gray-700 hover:text-[#F43F5E]">
                            Contact
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <motion.section
                data-file-location="/app/index/page.tsx"
                id="home"
                className="relative bg-[#EC4899] text-white text-center py-20 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-extrabold mb-4" aria-label="Welcome to Bittive Oy" data-editable="true">
                        Empowering Your Business with Cutting-Edge Software Solutions
                    </h1>
                    <p className="text-lg sm:text-xl mb-8" aria-label="Business tagline" data-editable="true">
                        Bittive Oy specializes in innovative software development that drives growth and enhances efficiency.
                    </p>
                    <Link
                        href="#contact"
                        aria-label="Get in touch with us"
                        data-editable="true"
                        className="inline-block bg-[#F59E0B] hover:bg-[#F43F5E] text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300"
                    >
                        Get Started
                    </Link>
                </div>
                <div className="mt-10">
                    <Image
                        src="https://placehold.co/1200x600"
                        alt="Abstract representation of software development"
                        width={1200}
                        height={600}
                        className="rounded-md shadow-lg"
                    />
                </div>
            </motion.section>

            {/* About Section */}
            <motion.section
                data-file-location="/app/index/page.tsx"
                id="about"
                className="py-16 px-4 bg-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            >
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6" aria-label="About Bittive Oy" data-editable="true">
                        About Us
                    </h2>
                    <p className="text-lg text-gray-700 mb-4" aria-label="Bittive Oy description" data-editable="true">
                        At Bittive Oy, our passion is to build robust software that not only meets your business requirements but also paves the way for
                        future innovations. Our team of experts is dedicated to delivering quality solutions tailored to elevate your operations.
                    </p>
                    <p className="text-lg text-gray-700" aria-label="Our mission" data-editable="true">
                        We believe in the power of technology to transform ideas into reality. Join us on this journey to achieve excellence in software development.
                    </p>
                </div>
            </motion.section>

            {/* Services Section */}
            <motion.section
                data-file-location="/app/index/page.tsx"
                id="services"
                className="py-16 px-4 bg-gray-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
            >
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12" aria-label="Our Services" data-editable="true">
                        Our Services
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
                            <div className="mb-4 flex justify-center">
                                <Code size={48} className="text-[#EC4899]" aria-hidden="true" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-center" aria-label="Custom Software Development" data-editable="true">
                                Custom Software Development
                            </h3>
                            <p className="text-gray-600 text-center" aria-label="Service description" data-editable="true">
                                Tailored software solutions that fit your business needs, improving productivity and streamlining operations.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
                            <div className="mb-4 flex justify-center">
                                <Smartphone size={48} className="text-[#EC4899]" aria-hidden="true" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-center" aria-label="Mobile App Development" data-editable="true">
                                Mobile App Development
                            </h3>
                            <p className="text-gray-600 text-center" aria-label="Service description" data-editable="true">
                                Innovative mobile applications designed to engage your customers and drive business growth.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
                            <div className="mb-4 flex justify-center">
                                <Briefcase size={48} className="text-[#EC4899]" aria-hidden="true" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-center" aria-label="Cloud & Enterprise Solutions" data-editable="true">
                                Cloud & Enterprise Solutions
                            </h3>
                            <p className="text-gray-600 text-center" aria-label="Service description" data-editable="true">
                                Scalable cloud services and enterprise-grade solutions to optimize your business infrastructure.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Contact Section */}
            <motion.section
                data-file-location="/app/index/page.tsx"
                id="contact"
                className="py-16 px-4 bg-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
            >
                <div className="max-w-xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8" aria-label="Get in Touch" data-editable="true">
                        Contact Us
                    </h2>
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#EC4899] focus:ring-[#EC4899]"
                                aria-label="Your Name"
                                data-editable="true"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#EC4899] focus:ring-[#EC4899]"
                                aria-label="Your Email"
                                data-editable="true"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={5}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#EC4899] focus:ring-[#EC4899]"
                                aria-label="Your Message"
                                data-editable="true"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-[#F59E0B] hover:bg-[#F43F5E] text-white font-semibold rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EC4899]"
                            aria-label="Submit Contact Form"
                            data-editable="true"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </motion.section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm" aria-label="Footer text" data-editable="true">
                        © {new Date().getFullYear()} Bittive Oy. All rights reserved.
                    </p>
                </div>
            </footer>
        </motion.main>
    );
}