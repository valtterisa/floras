"use client";

import {
    MessageSquare,
    Sparkles,
    Palette,
    Globe,
    ArrowRight
} from "lucide-react";

export function ProcessDiagram() {
    const steps = [
        {
            number: "01",
            icon: <MessageSquare className="h-8 w-8" />,
            title: "Describe",
            description: "Tell us what you want"
        },
        {
            number: "02",
            icon: <Sparkles className="h-8 w-8" />,
            title: "AI Creates",
            description: "We build your website"
        },
        {
            number: "03",
            icon: <Palette className="h-8 w-8" />,
            title: "Customize",
            description: "Fine-tune the design"
        },
        {
            number: "04",
            icon: <Globe className="h-8 w-8" />,
            title: "Publish",
            description: "Go live instantly"
        }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight" style={{ fontFamily: 'Geist, sans-serif' }}>
                        How It Works
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium" style={{ fontFamily: 'Geist, sans-serif' }}>
                        From idea to live website in minutes
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="text-center relative">
                            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white text-lg font-bold" style={{ fontFamily: 'Geist, sans-serif' }}>
                                    {step.number}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-black mb-2" style={{ fontFamily: 'Geist, sans-serif' }}>
                                {step.title}
                            </h3>
                            <p className="text-sm text-gray-600 font-medium" style={{ fontFamily: 'Geist, sans-serif' }}>
                                {step.description}
                            </p>

                            {/* Connection line */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-black transform -translate-x-4"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
