export function TabsComponent() {
  return (
    <div className="py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="border-b flex">
          {["Overview", "Features", "Specifications"].map((tab, i) => (
            <button
              key={i}
              className={`py-2 px-4 font-medium ${i === 0 ? "border-b-2 border-primary" : "text-muted-foreground"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="py-4">
          <p className="text-muted-foreground">
            This is the content for the Overview tab. You can display different content based on which tab is active.
          </p>
        </div>
      </div>
    </div>
  )
}

