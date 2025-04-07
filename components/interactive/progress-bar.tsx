export function ProgressBar() {
  return (
    <div className="py-8 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Basic</span>
            <span className="text-sm font-medium">50%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: "50%" }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Intermediate</span>
            <span className="text-sm font-medium">75%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: "75%" }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Advanced</span>
            <span className="text-sm font-medium">90%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: "90%" }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

