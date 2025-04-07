export function Accordion() {
  return (
    <div className="py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {[
          {
            title: "What is your refund policy?",
            content:
              "If you're not satisfied with your purchase, we accept returns within 30 days of delivery. To be eligible for a return, your item must be unused and in the same condition that you received it.",
          },
          {
            title: "How do I track my order?",
            content:
              "Once your order has shipped, you will receive a tracking number via email. You can use this tracking number on our website to check the status of your delivery.",
          },
          {
            title: "Do you offer international shipping?",
            content:
              "Yes, we ship to most countries worldwide. International shipping rates vary depending on the destination and the size/weight of the items ordered.",
          },
        ].map((item, i) => (
          <div key={i} className="border rounded-lg overflow-hidden">
            <button className="flex justify-between items-center w-full p-4 text-left font-medium">
              {item.title}
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`px-4 pb-4 ${i === 0 ? "block" : "hidden"}`}>
              <p className="text-muted-foreground">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

