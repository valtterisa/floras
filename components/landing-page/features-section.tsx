import { Sparkles, Rocket, Shield, BarChart3, Brain } from "lucide-react"

export function FeaturesShowcase() {
    const features = [
        {
            icon: Sparkles,
            title: "Smart AI Generation",
            desc: "Describe your vision and watch AI create your website instantly.",
        },
        {
            icon: Rocket,
            title: "One-Click Deploy",
            desc: "Launch instantly with custom domains and global CDN included.",
        },
        {
            icon: Shield,
            title: "Enterprise Security",
            desc: "Bank-level security with automatic backups and 99.9% uptime.",
        },
        {
            icon: BarChart3,
            title: "Built-in Analytics",
            desc: "Track performance with detailed insights and optimization tips.",
        },
    ]

    return (
        <section className="py-16 bg-black text-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>Powerful Features, Simple Interface</h2>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto" style={{ fontFamily: 'Geist, sans-serif' }}>Professional tools that work seamlessly together</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        {features.map((feature, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                        <feature.icon className="w-5 h-5 text-black" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1 text-white" style={{ fontFamily: 'Geist, sans-serif' }}>{feature.title}</h3>
                                    <p className="text-sm text-gray-300" style={{ fontFamily: 'Geist, sans-serif' }}>{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="relative">
                        <div className="bg-white rounded-lg p-6 shadow-2xl">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                                        <Brain className="w-3 h-3 text-white" />
                                    </div>
                                    <div className="h-3 bg-gray-200 rounded flex-1"></div>
                                </div>
                                <div className="pl-9 space-y-2">
                                    <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                                    <div className="h-2 bg-gray-200 rounded w-3/5"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <div className="h-16 bg-gray-100 rounded"></div>
                                    <div className="h-16 bg-gray-100 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
