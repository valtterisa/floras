"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react"

interface TextEditorProps {
  element: HTMLElement
  onUpdate: () => void
}

export function TextEditor({ element, onUpdate }: TextEditorProps) {
  const [text, setText] = useState("")
  const [isMultiline, setIsMultiline] = useState(false)

  useEffect(() => {
    if (element) {
      setText(element.innerHTML || "")

      // Check if this is likely a multiline element
      const tagName = element.tagName.toLowerCase()
      setIsMultiline(tagName === "p" || tagName === "div" || element.clientHeight > 40)
    }
  }, [element])

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  const applyChanges = () => {
    if (element) {
      // Use innerHTML instead of textContent to preserve formatting
      if (element.innerHTML !== text) {
        element.innerHTML = text
        onUpdate()
      }
    }
  }

  const applyStyle = (style: string) => {
    if (!element) return

    switch (style) {
      case "bold":
        element.style.fontWeight = element.style.fontWeight === "bold" ? "normal" : "bold"
        break
      case "italic":
        element.style.fontStyle = element.style.fontStyle === "italic" ? "normal" : "italic"
        break
      case "underline":
        element.style.textDecoration = element.style.textDecoration === "underline" ? "none" : "underline"
        break
      case "align-left":
        element.style.textAlign = "left"
        break
      case "align-center":
        element.style.textAlign = "center"
        break
      case "align-right":
        element.style.textAlign = "right"
        break
      case "align-justify":
        element.style.textAlign = "justify"
        break
    }

    onUpdate()
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="element-text">Text Content</Label>
        {isMultiline ? (
          <Textarea id="element-text" value={text} onChange={handleTextChange} className="mt-1" rows={4} />
        ) : (
          <Input id="element-text" value={text} onChange={handleTextChange} className="mt-1" />
        )}
      </div>

      <div>
        <Label className="block mb-2">Text Style</Label>
        <div className="flex space-x-1">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => applyStyle("bold")}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => applyStyle("italic")}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => applyStyle("underline")}>
            <Underline className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <Label className="block mb-2">Text Alignment</Label>
        <div className="flex space-x-1">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => applyStyle("align-left")}>
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => applyStyle("align-center")}>
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => applyStyle("align-right")}>
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => applyStyle("align-justify")}>
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button onClick={applyChanges}>Apply Text Changes</Button>
    </div>
  )
}

