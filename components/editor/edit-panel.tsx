"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EditPanelProps {
  selectedElement: HTMLElement | null
  onUpdate: () => void
}

export function EditPanel({ selectedElement, onUpdate }: EditPanelProps) {
  const [text, setText] = useState(selectedElement?.textContent || "")

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  const applyChanges = () => {
    if (selectedElement) {
      selectedElement.textContent = text
      onUpdate()
    }
  }

  if (!selectedElement) {
    return <div className="p-4 text-center text-muted-foreground">Select an element to edit</div>
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="element-text">Text Content</Label>
        <Input id="element-text" value={text} onChange={handleTextChange} className="mt-1" />
      </div>
      <Button onClick={applyChanges}>Apply Changes</Button>
    </div>
  )
}

