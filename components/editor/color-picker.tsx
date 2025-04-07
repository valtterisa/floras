"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface ColorPickerProps {
  element: HTMLElement
  onUpdate: () => void
  isHoverState?: boolean
}

// Tailwind color classes
const colorOptions = [
  { name: "Slate", class: "bg-slate-500", textClass: "text-slate-500", bgClass: "bg-slate-500" },
  { name: "Gray", class: "bg-gray-500", textClass: "text-gray-500", bgClass: "bg-gray-500" },
  { name: "Zinc", class: "bg-zinc-500", textClass: "text-zinc-500", bgClass: "bg-zinc-500" },
  { name: "Neutral", class: "bg-neutral-500", textClass: "text-neutral-500", bgClass: "bg-neutral-500" },
  { name: "Stone", class: "bg-stone-500", textClass: "text-stone-500", bgClass: "bg-stone-500" },
  { name: "Red", class: "bg-red-500", textClass: "text-red-500", bgClass: "bg-red-500" },
  { name: "Orange", class: "bg-orange-500", textClass: "text-orange-500", bgClass: "bg-orange-500" },
  { name: "Amber", class: "bg-amber-500", textClass: "text-amber-500", bgClass: "bg-amber-500" },
  { name: "Yellow", class: "bg-yellow-500", textClass: "text-yellow-500", bgClass: "bg-yellow-500" },
  { name: "Lime", class: "bg-lime-500", textClass: "text-lime-500", bgClass: "bg-lime-500" },
  { name: "Green", class: "bg-green-500", textClass: "text-green-500", bgClass: "bg-green-500" },
  { name: "Emerald", class: "bg-emerald-500", textClass: "text-emerald-500", bgClass: "bg-emerald-500" },
  { name: "Teal", class: "bg-teal-500", textClass: "text-teal-500", bgClass: "bg-teal-500" },
  { name: "Cyan", class: "bg-cyan-500", textClass: "text-cyan-500", bgClass: "bg-cyan-500" },
  { name: "Sky", class: "bg-sky-500", textClass: "text-sky-500", bgClass: "bg-sky-500" },
  { name: "Blue", class: "bg-blue-500", textClass: "text-blue-500", bgClass: "bg-blue-500" },
  { name: "Indigo", class: "bg-indigo-500", textClass: "text-indigo-500", bgClass: "bg-indigo-500" },
  { name: "Violet", class: "bg-violet-500", textClass: "text-violet-500", bgClass: "bg-violet-500" },
  { name: "Purple", class: "bg-purple-500", textClass: "text-purple-500", bgClass: "bg-purple-500" },
  { name: "Fuchsia", class: "bg-fuchsia-500", textClass: "text-fuchsia-500", bgClass: "bg-fuchsia-500" },
  { name: "Pink", class: "bg-pink-500", textClass: "text-pink-500", bgClass: "bg-pink-500" },
  { name: "Rose", class: "bg-rose-500", textClass: "text-rose-500", bgClass: "bg-rose-500" },
]

// Tailwind shade options
const shadeOptions = [100, 200, 300, 400, 500, 600, 700, 800, 900]

export function ColorPicker({ element, onUpdate, isHoverState = false }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedShade, setSelectedShade] = useState(500)
  const [isBackground, setIsBackground] = useState(true)

  useEffect(() => {
    // Determine if the element has a background color or text color
    const classList = element.className.split(" ")

    // If editing hover state, look for hover:bg- classes
    const bgClass = isHoverState
      ? classList.find((cls) => cls.startsWith("hover:bg-"))
      : classList.find((cls) => cls.startsWith("bg-"))

    const textClass = isHoverState
      ? classList.find((cls) => cls.startsWith("hover:text-"))
      : classList.find((cls) => cls.startsWith("text-"))

    if (bgClass) {
      setIsBackground(true)
      // Extract color and shade from bg class
      const classPrefix = isHoverState ? "hover:bg-" : "bg-"
      const [color, shade] = bgClass.replace(classPrefix, "").split("-")
      setSelectedColor(color)
      setSelectedShade(Number(shade) || 500)
    } else if (textClass) {
      setIsBackground(false)
      // Extract color and shade from text class
      const classPrefix = isHoverState ? "hover:text-" : "text-"
      const [color, shade] = textClass.replace(classPrefix, "").split("-")
      setSelectedColor(color)
      setSelectedShade(Number(shade) || 500)
    }
  }, [element, isHoverState])

  const applyColor = (color: string) => {
    setSelectedColor(color)
  }

  const applyShade = (shade: number) => {
    setSelectedShade(shade)
  }

  const toggleColorType = () => {
    setIsBackground(!isBackground)
  }

  const applyChanges = () => {
    if (!element || !selectedColor) return

    const classList = element.className.split(" ")

    // Remove existing color classes
    const newClassList = classList.filter((cls) => {
      if (isHoverState) {
        return isBackground ? !cls.startsWith("hover:bg-") : !cls.startsWith("hover:text-")
      } else {
        return isBackground ? !cls.startsWith("bg-") : !cls.startsWith("text-")
      }
    })

    // Add new color class
    const newClass = isHoverState
      ? isBackground
        ? `hover:bg-${selectedColor}-${selectedShade}`
        : `hover:text-${selectedColor}-${selectedShade}`
      : isBackground
        ? `bg-${selectedColor}-${selectedShade}`
        : `text-${selectedColor}-${selectedShade}`

    newClassList.push(newClass)
    element.className = newClassList.join(" ")

    // Call onUpdate to trigger state updates and close the menu
    onUpdate()
  }

  // Update the UI to show if we're editing hover state
  return (
    <div className="space-y-4">
      {isHoverState && (
        <div className="p-3 bg-muted/30 rounded-md mb-4">
          <p className="text-sm font-medium text-center">Editing Button Hover State</p>
        </div>
      )}

      <div>
        <Label className="block mb-2">Color Type</Label>
        <div className="flex space-x-2">
          <Button variant={isBackground ? "default" : "outline"} size="sm" onClick={() => setIsBackground(true)}>
            Background
          </Button>
          <Button variant={!isBackground ? "default" : "outline"} size="sm" onClick={() => setIsBackground(false)}>
            Text
          </Button>
        </div>
      </div>

      <div>
        <Label className="block mb-2">Color</Label>
        <div className="grid grid-cols-6 gap-2">
          {colorOptions.map((color) => (
            <button
              key={color.name}
              className={`h-8 w-8 rounded-full ${color.class} ${
                selectedColor === color.name.toLowerCase() ? "ring-2 ring-offset-2 ring-primary" : ""
              }`}
              title={color.name}
              onClick={() => applyColor(color.name.toLowerCase())}
            />
          ))}
        </div>
      </div>

      <div>
        <Label className="block mb-2">Shade</Label>
        <div className="flex flex-wrap gap-2">
          {shadeOptions.map((shade) => (
            <button
              key={shade}
              className={`px-2 py-1 text-xs rounded ${
                selectedShade === shade ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
              onClick={() => applyShade(shade)}
            >
              {shade}
            </button>
          ))}
        </div>
      </div>

      {selectedColor && (
        <div className="flex items-center space-x-2">
          <div
            className={`h-6 w-6 rounded ${
              isBackground
                ? `${isHoverState ? "hover:" : ""}bg-${selectedColor}-${selectedShade}`
                : `bg-muted border ${isHoverState ? "hover:" : ""}text-${selectedColor}-${selectedShade} flex items-center justify-center`
            }`}
          >
            {!isBackground && "A"}
          </div>
          <span className="text-sm">
            {isHoverState ? "hover:" : ""}
            {isBackground ? "bg" : "text"}-{selectedColor}-{selectedShade}
          </span>
        </div>
      )}

      <Button onClick={applyChanges}>Apply {isHoverState ? "Hover " : ""}Color</Button>
    </div>
  )
}

