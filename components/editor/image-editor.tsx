"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Image } from "lucide-react"

interface ImageEditorProps {
  element: HTMLImageElement
  onUpdate: () => void
}

export function ImageEditor({ element, onUpdate }: ImageEditorProps) {
  const [src, setSrc] = useState("")
  const [alt, setAlt] = useState("")
  const [width, setWidth] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const [aspectRatio, setAspectRatio] = useState<number>(1)
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [placeholderSize, setPlaceholderSize] = useState<"small" | "medium" | "large" | null>(null)

  const getPlaceholderDimensions = useCallback((size: "small" | "medium" | "large") => {
    switch (size) {
      case "small":
        return { width: 150, height: 150 }
      case "medium":
        return { width: 300, height: 200 }
      case "large":
        return { width: 600, height: 400 }
      default:
        return { width: 0, height: 0 }
    }
  }, [])

  useEffect(() => {
    if (placeholderSize) {
      const dimensions = getPlaceholderDimensions(placeholderSize)
      setSrc(`/placeholder.svg?height=${dimensions.height}&width=${dimensions.width}`)
      setWidth(dimensions.width)
      setHeight(dimensions.height)
      setAspectRatio(dimensions.width / dimensions.height)
      setPlaceholderSize(null) // Reset to prevent infinite loop
    }
  }, [placeholderSize, getPlaceholderDimensions])

  useEffect(() => {
    if (element) {
      setSrc(element.src)
      setAlt(element.alt || "")
      setWidth(element.width || element.clientWidth)
      setHeight(element.height || element.clientHeight)
      setAspectRatio((element.width || element.clientWidth) / (element.height || element.clientHeight))
    }
  }, [element])

  const handleSrcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSrc(e.target.value)
  }

  const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlt(e.target.value)
  }

  const handleWidthChange = (value: number[]) => {
    const newWidth = value[0]
    setWidth(newWidth)

    if (maintainAspectRatio) {
      setHeight(Math.round(newWidth / aspectRatio))
    }
  }

  const handleHeightChange = (value: number[]) => {
    const newHeight = value[0]
    setHeight(newHeight)

    if (maintainAspectRatio) {
      setWidth(Math.round(newHeight * aspectRatio))
    }
  }

  const applyChanges = () => {
    if (element) {
      element.src = src
      element.alt = alt

      if (width > 0) {
        element.width = width
        element.style.width = `${width}px`
      }

      if (height > 0) {
        element.height = height
        element.style.height = `${height}px`
      }

      onUpdate()
    }
  }

  const usePlaceholder = (size: "small" | "medium" | "large") => {
    setPlaceholderSize(size)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image-src">Image Source URL</Label>
        <div className="flex mt-1">
          <Input id="image-src" value={src} onChange={handleSrcChange} className="flex-1" />
        </div>
      </div>

      <div>
        <Label htmlFor="image-alt">Alt Text</Label>
        <Input
          id="image-alt"
          value={alt}
          onChange={handleAltChange}
          className="mt-1"
          placeholder="Describe the image"
        />
      </div>

      <div>
        <Label className="block mb-2">Placeholder Images</Label>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => usePlaceholder("small")} className="flex items-center">
            <Image className="h-3 w-3 mr-1" /> Small
          </Button>
          <Button variant="outline" size="sm" onClick={() => usePlaceholder("medium")} className="flex items-center">
            <Image className="h-3 w-3 mr-1" /> Medium
          </Button>
          <Button variant="outline" size="sm" onClick={() => usePlaceholder("large")} className="flex items-center">
            <Image className="h-3 w-3 mr-1" /> Large
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between">
            <Label htmlFor="image-width">Width: {width}px</Label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintain-aspect"
                checked={maintainAspectRatio}
                onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="maintain-aspect" className="text-sm">
                Maintain aspect ratio
              </label>
            </div>
          </div>
          <Slider
            id="image-width"
            value={[width]}
            min={50}
            max={1200}
            step={1}
            onValueChange={handleWidthChange}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="image-height">Height: {height}px</Label>
          <Slider
            id="image-height"
            value={[height]}
            min={50}
            max={1200}
            step={1}
            onValueChange={handleHeightChange}
            className="mt-2"
          />
        </div>
      </div>

      <div className="pt-2">
        <Button onClick={applyChanges} className="w-full">
          Apply Image Changes
        </Button>
      </div>
    </div>
  )
}

