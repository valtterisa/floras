"data-file-location='/app/page.tsx'"

import React from "react";
import Image from "next/image";
import Link from "next/link";

type BittiveLandingPageProps = {};

export default function BittiveLandingPage({ }: BittiveLandingPageProps) {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="bg-[#6366F1] text-white">
                <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
                    <h1 className="text-2xl font-bold" aria-label="Bittive" data-editable="true">
                        Bittive
                    </h1>
                    <nav>
                        <ul className="flex space-x-4">
                            <li>
                                <Link href="/" className="hover:underline" aria-label="Home" data-editable="true">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="#about" className="hover:underline" aria-label="About" data-editable="true">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="#services" className="hover:underline" aria-label="Services" data-editable="true">
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link href="#contact" className="hover:underline" aria-label="Contact" data-editable="true">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-grow">
                <section
                    className="bg-gray-100 text-center py-16 px-4"
                    aria-label="Hero Section"
                    data-editable="true"
                >
                    <h2 className="text-4xl font-extrabold mb-4 text-[#6366F1]" aria-label="Empowering Your Digital Journey">
                        Empowering Your Digital Journey
                    </h2>
                    <p
                        className="text-lg mb-8"
                        aria-label="Crafting innovative web solutions tailored to your business needs."
                        data-editable="true"
                    >
                        Crafting innovative web solutions tailored to your business needs.
                    </p>
                    <Link
                        href="#contact"
                        className="inline-block bg-[#EC4899] text-white py-3 px-6 rounded-full font-medium hover:bg-[#D63381]"
                        aria-label="Get Started"
                        data-editable="true"
                    >
                        Get Started
                    </Link>
                </section>

                {/* About Section */}
                <section id="about" className="py-16 px-4 bg-white" aria-label="About Us" data-editable="true">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4 text-center text-[#8B5CF6]" aria-label="About Us">
                            About Us
                        </h2>
                        <p
                            className="text-lg text-gray-700 text-center"
                            aria-label="Bittive is a leading software development agency specializing in web application development services. We combine creativity with cutting-edge technology to build digital experiences that drive success."
                            data-editable="true"
                        >
                            Bittive is a leading software development agency specializing in web application development services.
                            We combine creativity with cutting-edge technology to build digital experiences that drive success.
                        </p>
                    </div>
                </section>

                {/* Services Section */}
                <section id="services" className="py-16 px-4 bg-gray-50" aria-label="Our Services" data-editable="true">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold mb-8 text-center text-[#6366F1]" aria-label="Our Services">
                            Our Services
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white shadow p-6 rounded-lg">
                                <h3 className="text-2xl font-semibold mb-2 text-[#8B5CF6]" aria-label="Web Application Development">
                                    Web Application Development
                                </h3>
                                <p
                                    className="text-gray-700"
                                    aria-label="We develop robust and scalable web applications using modern technologies."
                                    data-editable="true"
                                >
                                    We develop robust and scalable web applications using modern technologies.
                                </p>
                            </div>
                            <div className="bg-white shadow p-6 rounded-lg">
                                <h3 className="text-2xl font-semibold mb-2 text-[#8B5CF6]" aria-label="Custom Software Solutions">
                                    Custom Software Solutions
                                </h3>
                                <p
                                    className="text-gray-700"
                                    aria-label="Tailor-made software solutions that drive business efficiency and innovation."
                                    data-editable="true"
                                >
                                    Tailor-made software solutions that drive business efficiency and innovation.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-16 px-4 bg-white" aria-label="Contact Us" data-editable="true">
                    <div className="max-w-xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center text-[#6366F1]" aria-label="Get in Touch">
                            Get in Touch
                        </h2>
                        <form className="space-y-4">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                    aria-label="Name"
                                >
                                    Name:
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#6366F1] focus:ring-[#6366F1]"
                                    aria-label="Enter your name"
                                    data-editable="true"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                    aria-label="Email"
                                >
                                    Email:
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#6366F1] focus:ring-[#6366F1]"
                                    aria-label="Enter your email"
                                    data-editable="true"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-medium text-gray-700"
                                    aria-label="Message"
                                >
                                    Message:
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#6366F1] focus:ring-[#6366F1]"
                                    aria-label="Enter your message"
                                    data-editable="true"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 px-6 bg-[#8B5CF6] text-white font-medium rounded-md hover:bg-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                                aria-label="Submit"
                                data-editable="true"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-[#6366F1] text-white py-4">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-sm" aria-label={`Copyright © ${new Date().getFullYear()} Bittive. All rights reserved.`} data-editable="true">
                        © {new Date().getFullYear()} Bittive. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}