import { Card, CardContent } from "@/components/ui/card"
import { Zap, Brain, Code2, Smartphone, Palette, Globe } from "lucide-react"

export function BenefitsGrid() {
    const benefits = [
        {
            icon: Zap,
            title: "Lightning Fast",
            desc: "Generate complete websites in minutes",
        },
        {
            icon: Brain,
            title: "AI-Powered",
            desc: "Advanced AI understands your requirements perfectly",
        },
        {
            icon: Code2,
            title: "No Code Required",
            desc: "Build professional sites without writing a single line of code",
        },
        {
            icon: Smartphone,
            title: "Mobile Perfect",
            desc: "Every site is automatically optimized for all devices",
        },
        {
            icon: Palette,
            title: "Designer Quality",
            desc: "Professional designs that convert visitors to customers",
        },
        {
            icon: Globe,
            title: "Global CDN",
            desc: "Lightning-fast loading times worldwide",
        },
    ]

    return (
        <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-black mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>Why Choose Builddrr?</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'Geist, sans-serif' }}>
                        Experience the future of web development with our AI-powered platform
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {benefits.map((benefit, index) => (
                        <Card
                            key={index}
                            className="border-2 border-black hover:border-gray-400 transition-all duration-300 hover:shadow-lg group bg-white"
                        >
                            <CardContent className="p-6">
                                <benefit.icon className={`w-10 h-10 mb-4 text-black group-hover:scale-110 transition-transform`} />
                                <h3 className="text-lg font-bold mb-2 text-black" style={{ fontFamily: 'Geist, sans-serif' }}>{benefit.title}</h3>
                                <p className="text-gray-600 text-sm" style={{ fontFamily: 'Geist, sans-serif' }}>{benefit.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
