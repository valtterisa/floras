import { Check, X } from "lucide-react"

export function ComparisonTable() {
    const comparisons = [
        { feature: "Setup Time", builddrr: "30 seconds", others: "Hours to days" },
        { feature: "Design Quality", builddrr: "AI-optimized", others: "Template limited" },
        { feature: "Customization", builddrr: "Unlimited", others: "Restricted" },
        { feature: "Mobile Optimization", builddrr: "Automatic", others: "Manual tweaking" },
        { feature: "SEO Optimization", builddrr: "Built-in AI SEO", others: "Basic or paid add-on" },
        { feature: "Loading Speed", builddrr: "Sub-second", others: "2-5 seconds" },
    ]

    return (
        <section className="py-16 bg-white">
            <div className="max-w-5xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-black mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>Why Builddrr Dominates</h2>
                    <p className="text-lg text-gray-600" style={{ fontFamily: 'Geist, sans-serif' }}>See how we compare to traditional website builders</p>
                </div>

                <div className="bg-white border-2 border-black rounded-lg overflow-hidden">
                    <div className="grid grid-cols-3 bg-black text-white">
                        <div className="p-4 md:p-6 font-bold text-sm md:text-lg" style={{ fontFamily: 'Geist, sans-serif' }}></div>
                        <div className="p-4 md:p-6 font-bold text-sm md:text-lg text-center border-l border-white/20" style={{ fontFamily: 'Geist, sans-serif' }}>Builddrr</div>
                        <div className="p-4 md:p-6 font-bold text-sm md:text-lg text-center border-l border-white/20" style={{ fontFamily: 'Geist, sans-serif' }}>Traditional Builders</div>
                    </div>
                    {comparisons.map((row, index) => (
                        <div key={index} className={`grid grid-cols-3 border-t border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                            <div className="p-4 md:p-6 font-semibold text-sm md:text-base text-black" style={{ fontFamily: 'Geist, sans-serif' }}>{row.feature}</div>
                            <div className="p-4 md:p-6 text-center border-l border-gray-200 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
                                <Check className="w-4 h-4 md:w-5 md:h-5 text-black flex-shrink-0" />
                                <span className="font-medium text-sm md:text-base text-black" style={{ fontFamily: 'Geist, sans-serif' }}>{row.builddrr}</span>
                            </div>
                            <div className="p-4 md:p-6 text-center border-l border-gray-200 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
                                <X className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                                <span className="text-sm md:text-base text-gray-600" style={{ fontFamily: 'Geist, sans-serif' }}>{row.others}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
