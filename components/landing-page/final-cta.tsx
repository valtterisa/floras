import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function FinalCTA() {
  return (
    <section className="py-16 bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
          Ready to Build the Future?
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'Geist, sans-serif' }}>
          Join us to shape the future of web development
        </p>

        <div className="space-y-4">
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-bold"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            Start Now For Free
          </Button>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              No credit card required
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
