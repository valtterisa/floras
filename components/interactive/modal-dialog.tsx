import { Button } from "@/components/ui/button"

export function ModalDialog() {
  return (
    <div className="py-8 px-4 text-center">
      <Button>Open Modal</Button>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center hidden">
        <div className="bg-background rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Modal Title</h3>
            <button className="text-muted-foreground">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mb-6">
            <p className="text-muted-foreground">
              This is the content of the modal dialog. You can put any content here, including forms, images, or text.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline">Cancel</Button>
            <Button>Confirm</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

