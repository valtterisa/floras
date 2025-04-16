"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, MapPin, Mail, Phone } from "lucide-react";

export default function Component() {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    const toggleMobileNav = () => setIsMobileNavOpen(!isMobileNavOpen);

    const animationProps = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
    };

    return (
        <motion.div
            data-file-location="/app/asdasasd/page.tsx"
            className="flex flex-col min-h-screen scroll-smooth font-sans text-gray-900"
            {...animationProps}
        >
            {/* Header */}
            <header className="bg-white shadow sticky top-0 z-50" data-file-location="/app/asdasasd/page.tsx">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold" aria-label="Website Logo" data-editable="true" style={{ color: "#10B981" }}>
                                ASDASASD
                            </h1>
                        </div>
                        <nav>
                            <button
                                className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                                onClick={toggleMobileNav}
                                aria-label="Toggle navigation"
                            >
                                {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                            <ul className="hidden md:flex space-x-8">
                                {[
                                    { label: "Pricing", href: "#pricing" },
                                    { label: "Gallery", href: "#gallery" },
                                    { label: "FAQ", href: "#faq" },
                                    { label: "Blog", href: "#blog" },
                                    { label: "Testimonials", href: "#testimonials" },
                                    { label: "Contact", href: "#contact" },
                                ].map((item) => (
                                    <li key={item.href}>
                                        <a
                                            href={item.href}
                                            className="hover:text-primary transition-colors"
                                            aria-label={item.label}
                                            data-editable="true"
                                        >
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
                {isMobileNavOpen && (
                    <nav className="md:hidden bg-white shadow">
                        <ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {[
                                { label: "Pricing", href: "#pricing" },
                                { label: "Gallery", href: "#gallery" },
                                { label: "FAQ", href: "#faq" },
                                { label: "Blog", href: "#blog" },
                                { label: "Testimonials", href: "#testimonials" },
                                { label: "Contact", href: "#contact" },
                            ].map((item) => (
                                <li key={item.href}>
                                    <a
                                        href={item.href}
                                        className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-200"
                                        aria-label={item.label}
                                        data-editable="true"
                                        onClick={() => setIsMobileNavOpen(false)}
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                {/* Hero Section */}
                <motion.section
                    id="hero"
                    className="bg-white py-16 px-4 sm:py-24 lg:py-32 text-center"
                    {...animationProps}
                    data-file-location="/app/asdasasd/page.tsx"
                >
                    <h2 className="text-4xl font-extrabold mb-4" aria-label="Hero Title" data-editable="true">
                        aSDASDASASD
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg mb-8" aria-label="Hero Description" data-editable="true">
                        Experience a modern, innovative approach to design and functionality. Our platform offers seamless interactions and clean aesthetics.
                    </p>
                    <a
                        href="#contact"
                        className="inline-block px-8 py-3 bg-[#10B981] text-white rounded-md hover:bg-[#059669] transition-colors"
                        aria-label="Get Started"
                        data-editable="true"
                    >
                        Get Started
                    </a>
                </motion.section>

                {/* Pricing Tables */}
                <motion.section
                    id="pricing"
                    className="py-16 px-4 bg-gray-50"
                    {...animationProps}
                    data-file-location="/app/asdasasd/page.tsx"
                >
                    <h3 className="text-3xl font-bold text-center mb-12" aria-label="Pricing Plans" data-editable="true" style={{ color: "#6366F1" }}>
                        Pricing Plans
                    </h3>
                    <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-3">
                        {[
                            { title: "Basic", price: "$9/mo", features: ["Feature A", "Feature B", "Feature C"], bg: "bg-white" },
                            { title: "Pro", price: "$29/mo", features: ["Feature A", "Feature B", "Feature C", "Feature D"], bg: "bg-white" },
                            { title: "Enterprise", price: "$99/mo", features: ["All Features"], bg: "bg-white" },
                        ].map((plan) => (
                            <motion.div
                                key={plan.title}
                                className={`p-6 rounded-lg shadow-lg ${plan.bg} border border-gray-200 hover:shadow-2xl transition-shadow`}
                                {...animationProps}
                            >
                                <h4 className="text-2xl font-semibold mb-4" aria-label={`${plan.title} Plan`} data-editable="true">
                                    {plan.title}
                                </h4>
                                <p className="text-3xl font-bold mb-6" aria-label="Price" data-editable="true">
                                    {plan.price}
                                </p>
                                <ul className="space-y-2 mb-6">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="text-gray-700" aria-label="Feature" data-editable="true">
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button className="w-full py-2 px-4 bg-[#10B981] text-white rounded-md hover:bg-[#059669] transition-colors" aria-label="Select Plan" data-editable="true">
                                    Select
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Image Gallery */}
                <motion.section
                    id="gallery"
                    className="py-16 px-4"
                    {...animationProps}
                    data-file-location="/app/asdasasd/page.tsx"
                >
                    <h3 className="text-3xl font-bold text-center mb-12" aria-label="Image Gallery" data-editable="true" style={{ color: "#6366F1" }}>
                        Image Gallery
                    </h3>
                    <div className="max-w-6xl mx-auto grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-full h-64 bg-center bg-cover rounded-lg shadow-md hover:scale-105 transition-transform"
                                style={{ backgroundImage: `url(https://placehold.co/300x300?text=Image+${i + 1})` }}
                                {...animationProps}
                                aria-label={`Gallery Image ${i + 1}`}
                                data-editable="true"
                            />
                        ))}
                    </div>
                </motion.section>

                {/* FAQ Section */}
                <motion.section
                    id="faq"
                    className="py-16 px-4 bg-gray-50"
                    {...animationProps}
                    data-file-location="/app/asdasasd/page.tsx"
                >
                    <h3 className="text-3xl font-bold text-center mb-12" aria-label="Frequently Asked Questions" data-editable="true" style={{ color: "#10B981" }}>
                        Frequently Asked Questions
                    </h3>
                    <div className="max-w-3xl mx-auto space-y-6">
                        {[
                            { question: "What services do you offer?", answer: "We provide a range of services that focus on modern design and clean UI/UX experiences." },
                            { question: "How can I get started?", answer: "Simply click on the 'Get Started' button or contact us through the form below." },
                            { question: "Do you offer support?", answer: "Yes, we offer 24/7 support for all our clients." },
                        ].map((faq, index) => (
                            <motion.div
                                key={index}
                                className="p-4 border border-gray-200 rounded-md hover:shadow-lg transition-shadow"
                                {...animationProps}
                                aria-label="FAQ Item"
                                data-editable="true"
                            >
                                <h4 className="text-xl font-semibold mb-2">{faq.question}</h4>
                                <p className="text-gray-700">{faq.answer}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Blog Section */}
                <motion.section
                    id="blog"
                    className="py-16 px-4"
                    {...animationProps}
                    data-file-location="/app/asdasasd/page.tsx"
                >
                    <h3 className="text-3xl font-bold text-center mb-12" aria-label="Latest Blog Posts" data-editable="true" style={{ color: "#6366F1" }}>
                        Latest Blog Posts
                    </h3>
                    <div className="max-w-5xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-2">
                        {[
                            { title: "Innovative Design Trends", excerpt: "Stay updated with the latest trends in design and technology." },
                            { title: "Building Modern Websites", excerpt: "Learn how to create visually stunning and responsive websites." },
                        ].map((post, index) => (
                            <motion.article
                                key={index}
                                className="p-6 border border-gray-200 rounded-lg hover:shadow-xl transition-shadow"
                                {...animationProps}
                                aria-label="Blog Post"
                                data-editable="true"
                            >
                                <h4 className="text-2xl font-semibold mb-2">{post.title}</h4>
                                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                                <a href="#contact" className="text-[#10B981] hover:underline" aria-label="Read More" data-editable="true">
                                    Read More &rarr;
                                </a>
                            </motion.article>
                        ))}
                    </div>
                </motion.section>

                {/* Testimonials Section */}
                <motion.section
                    id="testimonials"
                    className="py-16 px-4 bg-gray-50"
                    {...animationProps}
                    data-file-location="/app/asdasasd/page.tsx"
                >
                    <h3 className="text-3xl font-bold text-center mb-12" aria-label="Testimonials" data-editable="true" style={{ color: "#059669" }}>
                        What Our Clients Say
                    </h3>
                    <div className="max-w-4xl mx-auto space-y-8">
                        {[
                            { name: "John Doe", feedback: "This service completely exceeded my expectations. The design is modern and the functionality is impeccable." },
                            { name: "Jane Smith", feedback: "An absolutely stunning platform with top-notch customer service and attention to detail." },
                        ].map((testimonial, index) => (
                            <motion.blockquote
                                key={index}
                                className="p-6 border-l-4 border-[#10B981] bg-white rounded-md shadow-sm"
                                {...animationProps}
                                aria-label="Testimonial"
                                data-editable="true"
                            >
                                <p className="text-gray-700 italic mb-2">"{testimonial.feedback}"</p>
                                <cite className="not-italic font-semibold" aria-label="Client Name" data-editable="true">
                                    – {testimonial.name}
                                </cite>
                            </motion.blockquote>
                        ))}
                    </div>
                </motion.section>

                {/* Contact Form & Location Map */}
                <motion.section
                    id="contact"
                    className="py-16 px-4"
                    {...animationProps}
                    data-file-location="/app/asdasasd/page.tsx"
                >
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Contact Form */}
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-bold mb-6 text-center" aria-label="Contact Us" data-editable="true" style={{ color: "#10B981" }}>
                                Contact Us
                            </h3>
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700" aria-label="Name">
                                        Name:
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#10B981] focus:ring-[#10B981]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700" aria-label="Email">
                                        Email:
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#10B981] focus:ring-[#10B981]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700" aria-label="Message">
                                        Message:
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#10B981] focus:ring-[#10B981]"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 bg-[#10B981] text-white rounded-md hover:bg-[#059669] transition-colors focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                    aria-label="Submit Contact Form"
                                    data-editable="true"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Location Map */}
                        <div className="rounded-lg overflow-hidden shadow-lg">
                            <h3 className="text-2xl font-bold mb-4 text-center" aria-label="Our Location" data-editable="true" style={{ color: "#10B981" }}>
                                Our Location
                            </h3>
                            <div className="w-full h-64">
                                <img
                                    src="https://placehold.co/600x400?text=Location+Map"
                                    alt="Map showing our location"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="mt-4 flex items-center justify-center space-x-4">
                                <div className="flex items-center">
                                    <MapPin size={16} className="text-[#10B981]" />
                                    <span className="ml-2 text-sm" aria-label="Address" data-editable="true">
                                        1234 Modern Ave, Suite 100
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <Phone size={16} className="text-[#10B981]" />
                                    <span className="ml-2 text-sm" aria-label="Phone" data-editable="true">
                                        (123) 456-7890
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <Mail size={16} className="text-[#10B981]" />
                                    <span className="ml-2 text-sm" aria-label="Email" data-editable="true">
                                        info@asdasasd.com
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-gray-200 py-8" data-file-location="/app/asdasasd/page.tsx">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm mb-4 md:mb-0" aria-label="Footer Text" data-editable="true">
                            © {new Date().getFullYear()} ASDASASD. All rights reserved.
                        </p>
                        <nav>
                            <ul className="flex space-x-4">
                                {["Privacy Policy", "Terms of Service", "Contact"].map((link, index) => (
                                    <li key={index}>
                                        <a href="#" className="hover:underline" aria-label={link} data-editable="true">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </footer>
        </motion.div>
    );
}