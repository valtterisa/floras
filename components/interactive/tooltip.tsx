import { Button } from "@/components/ui/button"

export function Tooltip() {
  return (
    <div className="py-8 px-4 flex justify-center">
      <div className="relative inline-block">
        <Button>Hover Me</Button>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-sm rounded shadow-lg whitespace-nowrap">
          This is a tooltip
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-foreground"></div>
        </div>
      </div>
    </div>
  )
}

