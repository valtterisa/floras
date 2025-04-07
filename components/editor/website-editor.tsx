"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { ComponentLibrary } from "@/components/component-library";
import { ColorPicker } from "@/components/editor/color-picker";
import { ImageEditor } from "@/components/editor/image-editor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Save,
  Eye,
  Code,
  Layers,
  Settings,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Copy,
  Undo,
  Redo,
  Smartphone,
  Tablet,
  Monitor,
  Menu,
  PanelLeft,
  PanelRight,
  Download,
  Upload,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Image,
  PaintBucket,
  BoxIcon as ButtonIcon,
  WandSparkles,
  Rocket,
} from "lucide-react";

import type { ComponentType } from "@/components/component-library";
import { useMobile } from "@/hooks/use-mobile";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type ViewportSize = "desktop" | "tablet" | "mobile";
type EditModeType = "text" | "color" | "image" | "hover-color" | null;

// Define a new interface for button hover state
interface ButtonHoverState {
  element: HTMLButtonElement;
  normalClass: string;
  hoverClass: string;
}

// Define the structure for component edits
interface ComponentEdit {
  componentId: string;
  elementSelector: string; // CSS selector to find the element
  editType: "text" | "color" | "image" | "style";
  originalValue: string;
  currentValue: string;
  timestamp: number;
}

// Define the structure for the project data
interface ProjectData {
  components: ComponentType[];
  edits: ComponentEdit[];
  lastSaved: number;
}

// Add to the EditableField interface
interface EditableField {
  element: HTMLElement;
  type: "text" | "color" | "image" | "button"; // Add "button" type
  id: string;
  label: string;
  value: string;
  hoverState?: ButtonHoverState; // Add optional hover state
}

// Create a simplified version first to ensure exports work correctly
export function WebsiteEditor() {
  const [components, setComponents] = useState<any[]>([]);
  const [selectedComponentIndex, setSelectedComponentIndex] = useState<
    number | null
  >(null);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
    null
  );
  const [editMode, setEditMode] = useState<EditModeType>(null);
  const [history, setHistory] = useState<ComponentType[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [viewportSize, setViewportSize] = useState<ViewportSize>("desktop");
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [componentEdits, setComponentEdits] = useState<ComponentEdit[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [elementText, setElementText] = useState("");

  // Update the editableFields state to include buttons
  const [editableFields, setEditableFields] = useState<{
    text: EditableField[];
    color: EditableField[];
    image: EditableField[];
    button: EditableField[]; // Add button array
  }>({
    text: [],
    color: [],
    image: [],
    button: [],
  });
  const canvasRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();
  const observerRef = useRef<MutationObserver | null>(null);

  // Add this function to the component to force a refresh of editable elements
  const refreshEditableElements = () => {
    // Force a refresh of editable elements
    setTimeout(() => {
      makeElementsEditable();
      scanComponentForEditableFields();
    }, 200);
  };

  // Add component to the canvas
  const addComponent = (component: ComponentType) => {
    const newComponents = [...components, component];
    setComponents(newComponents);
    addToHistory(newComponents);

    // After adding a component, we need to make sure to mark its elements as editable
    refreshEditableElements();
  };

  // Remove component from the canvas
  const removeComponent = (index: number) => {
    const newComponents = components.filter((_, i) => i !== index);
    setComponents(newComponents);
    setSelectedComponentIndex(null);
    setEditableFields({ text: [], color: [], image: [], button: [] });
    addToHistory(newComponents);
  };

  // Move component up in the order
  const moveComponentUp = (index: number) => {
    if (index === 0) return;
    const newComponents = [...components];
    const temp = newComponents[index];
    newComponents[index] = newComponents[index - 1];
    newComponents[index - 1] = temp;
    setComponents(newComponents);
    setSelectedComponentIndex(index - 1);
    addToHistory(newComponents);
  };

  // Move component down in the order
  const moveComponentDown = (index: number) => {
    if (index === components.length - 1) return;
    const newComponents = [...components];
    const temp = newComponents[index];
    newComponents[index] = newComponents[index + 1];
    newComponents[index + 1] = temp;
    setComponents(newComponents);
    setSelectedComponentIndex(index + 1);
    addToHistory(newComponents);
  };

  // Duplicate component
  const duplicateComponent = (index: number) => {
    const newComponents = [...components];
    newComponents.splice(index + 1, 0, { ...components[index] });
    setComponents(newComponents);
    setSelectedComponentIndex(index + 1);
    addToHistory(newComponents);

    // After duplicating, make sure the new component's elements are editable
    refreshEditableElements();
  };

  // Scan the selected component for all editable fields
  const scanComponentForEditableFields = () => {
    if (!canvasRef.current || selectedComponentIndex === null) {
      setEditableFields({ text: [], color: [], image: [], button: [] });
      return;
    }

    // Get the component container
    const componentContainers = canvasRef.current.querySelectorAll(
      ".component-container"
    );
    if (
      !componentContainers ||
      componentContainers.length <= selectedComponentIndex
    ) {
      return;
    }

    const componentContainer = componentContainers[selectedComponentIndex];

    // Find all editable elements
    const textFields: EditableField[] = [];
    const colorFields: EditableField[] = [];
    const imageFields: EditableField[] = [];
    const buttonFields: EditableField[] = [];

    // Find text elements
    const textElements = componentContainer.querySelectorAll(
      '[data-editable="true"][data-editable-type="text"]'
    );
    textElements.forEach((el, index) => {
      const element = el as HTMLElement;

      // Skip buttons as they'll be handled separately
      if (element.tagName.toLowerCase() === "button") {
        return;
      }

      const tagName = element.tagName.toLowerCase();
      let label = `${tagName.charAt(0).toUpperCase() + tagName.slice(1)} ${
        index + 1
      }`;

      // Try to create a more descriptive label
      if (element.textContent) {
        const shortText = element.textContent.trim().substring(0, 20);
        label = shortText + (element.textContent.length > 20 ? "..." : "");
      }

      textFields.push({
        element,
        type: "text",
        id: `text-${index}`,
        label,
        value: element.innerHTML,
      });
    });

    // Find color elements
    const colorElements = componentContainer.querySelectorAll(
      '[data-editable="true"][data-editable-type="color"]'
    );
    colorElements.forEach((el, index) => {
      const element = el as HTMLElement;
      const tagName = element.tagName.toLowerCase();

      // Skip buttons as they'll be handled separately
      if (tagName === "button") {
        return;
      }

      // Find background color class
      const bgClass = Array.from(element.classList).find((cls) =>
        cls.startsWith("bg-")
      );

      colorFields.push({
        element,
        type: "color",
        id: `color-${index}`,
        label: `${tagName} Background ${index + 1}`,
        value: bgClass || "",
      });
    });

    // Find image elements
    const imageElements = componentContainer.querySelectorAll(
      '[data-editable="true"][data-editable-type="image"]'
    );
    imageElements.forEach((el, index) => {
      const element = el as HTMLImageElement;

      imageFields.push({
        element,
        type: "image",
        id: `image-${index}`,
        label: `Image ${index + 1}`,
        value: element.src,
      });
    });

    // Find all buttons and make them editable with hover state
    const buttonElements = componentContainer.querySelectorAll("button");

    buttonElements.forEach((el, index) => {
      const element = el as HTMLButtonElement;

      // Extract current button classes
      const classList = Array.from(element.classList);
      const variantClass = classList.find(
        (cls) =>
          cls.startsWith("variant-") ||
          cls.includes("outline") ||
          cls.includes("default") ||
          cls.includes("secondary") ||
          cls.includes("destructive") ||
          cls.includes("ghost")
      );
      const bgClass = classList.find((cls) => cls.startsWith("bg-"));
      const hoverClass = classList.find((cls) => cls.startsWith("hover:bg-"));

      buttonFields.push({
        element,
        type: "button",
        id: `button-${index}`,
        label: `Button ${index + 1}`,
        value: element.textContent || `Button ${index + 1}`,
        hoverState: {
          element,
          normalClass: bgClass || variantClass || "",
          hoverClass: hoverClass || "",
        },
      });
    });

    // Add buttons to the editable fields
    setEditableFields({
      text: textFields,
      color: colorFields,
      image: imageFields,
      button: buttonFields,
    });
  };

  // Make elements in the canvas editable
  const makeElementsEditable = () => {
    if (!canvasRef.current) return;

    // First, handle all links specifically to ensure they're editable
    const linkElements = canvasRef.current.querySelectorAll("a");
    linkElements.forEach((el) => {
      el.setAttribute("data-editable", "true");
      el.setAttribute("data-editable-type", "text");
      el.classList.add("editable-element");

      // Add double-click event for inline editing
      el.addEventListener("dblclick", handleDoubleClick);

      // Prevent navigation when in edit mode
      el.addEventListener("click", (e) => {
        if (isEditing || e.target === selectedElement) {
          e.preventDefault();
        }
      });
    });

    // Handle all buttons specifically
    const buttonElements = canvasRef.current.querySelectorAll("button");
    buttonElements.forEach((el) => {
      // Make it editable for both text and as a button
      el.setAttribute("data-editable", "true");
      el.setAttribute("data-editable-type", "text");
      el.setAttribute("data-is-button", "true"); // Add this attribute to identify buttons
      el.classList.add("editable-element");

      // Add double-click event for inline editing
      el.addEventListener("dblclick", handleDoubleClick);

      // Prevent button action when in edit mode
      el.addEventListener("click", (e) => {
        if (isEditing || e.target === selectedElement) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    });

    // Find all other text elements and make them editable
    const textElements = canvasRef.current.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, p, span, li, label, div"
    );
    textElements.forEach((el) => {
      // Only make it editable if it has text content and no editable children
      if (
        el.textContent &&
        el.textContent.trim() !== "" &&
        !el.querySelector('[data-editable="true"]')
      ) {
        el.setAttribute("data-editable", "true");
        el.setAttribute("data-editable-type", "text");

        // Add hover effect to show it's editable
        el.classList.add("editable-element");

        // Add double-click event for inline editing
        el.addEventListener("dblclick", handleDoubleClick);
      }
    });

    // Find elements with background colors and make them editable
    const colorElements = canvasRef.current.querySelectorAll('[class*="bg-"]');
    colorElements.forEach((el) => {
      el.setAttribute("data-editable", "true");
      el.setAttribute("data-editable-type", "color");

      // Add hover effect to show it's editable
      el.classList.add("editable-element");
    });

    // Find all images and make them editable
    const imageElements = canvasRef.current.querySelectorAll("img");
    imageElements.forEach((el) => {
      el.setAttribute("data-editable", "true");
      el.setAttribute("data-editable-type", "image");

      // Add hover effect to show it's editable
      el.classList.add("editable-element");

      // Add a visual indicator for image editing
      const parent = el.parentElement;
      if (parent) {
        parent.style.position = parent.style.position || "relative";
      }
    });
  };

  // Handle double-click on text elements for inline editing
  const handleDoubleClick = (e: Event) => {
    const target = e.target as HTMLElement;
    const editableElement = target.closest(
      '[data-editable="true"]'
    ) as HTMLElement;

    if (
      editableElement &&
      editableElement.getAttribute("data-editable-type") === "text"
    ) {
      e.stopPropagation();
      e.preventDefault();

      // Make the element editable
      editableElement.contentEditable = "true";
      editableElement.focus();

      // Store original content
      if (!editableElement.getAttribute("data-original-text")) {
        editableElement.setAttribute(
          "data-original-text",
          editableElement.innerHTML
        );
      }

      // For links, store the href attribute
      if (editableElement.tagName.toLowerCase() === "a") {
        const href = (editableElement as HTMLAnchorElement).href;
        if (href) {
          editableElement.setAttribute("data-original-href", href);
        }
      }

      // Add editing class
      editableElement.classList.add("editing-active");

      // Set editing state
      setIsEditing(true);
      setSelectedElement(editableElement);
      setElementText(editableElement.innerHTML);

      // Handle blur event to save changes
      const handleBlur = () => {
        editableElement.contentEditable = "false";
        editableElement.classList.remove("editing-active");
        setIsEditing(false);

        // Record the edit
        recordTextEdit(editableElement);

        // For links, restore the href attribute if it was removed during editing
        if (editableElement.tagName.toLowerCase() === "a") {
          const originalHref =
            editableElement.getAttribute("data-original-href");
          if (originalHref && !(editableElement as HTMLAnchorElement).href) {
            (editableElement as HTMLAnchorElement).href = originalHref;
          }
        }

        // Remove event listener
        editableElement.removeEventListener("blur", handleBlur);

        // Update editable fields
        scanComponentForEditableFields();
      };

      editableElement.addEventListener("blur", handleBlur);
    }
  };

  // Update text from panel
  const updateElementText = (element: HTMLElement, newText: string) => {
    if (!element) return;

    // Update the element
    element.innerHTML = newText;

    // Record the edit
    if (element.getAttribute("data-editable-type") === "text") {
      recordTextEdit(element);
    }

    // Update editable fields
    scanComponentForEditableFields();
  };

  // Apply text style
  const applyTextStyle = (element: HTMLElement, style: string) => {
    if (!element) return;

    switch (style) {
      case "bold":
        element.style.fontWeight =
          element.style.fontWeight === "bold" ? "normal" : "bold";
        break;
      case "italic":
        element.style.fontStyle =
          element.style.fontStyle === "italic" ? "normal" : "italic";
        break;
      case "underline":
        element.style.textDecoration =
          element.style.textDecoration === "underline" ? "none" : "underline";
        break;
      case "align-left":
        element.style.textAlign = "left";
        break;
      case "align-center":
        element.style.textAlign = "center";
        break;
      case "align-right":
        element.style.textAlign = "right";
        break;
      case "align-justify":
        element.style.textAlign = "justify";
        break;
    }

    // Record the edit
    recordTextEdit(element);

    // Update editable fields
    scanComponentForEditableFields();
  };

  // Record a text edit
  const recordTextEdit = (element: HTMLElement) => {
    const componentIndex =
      selectedComponentIndex !== null ? selectedComponentIndex : -1;
    if (componentIndex >= 0) {
      const componentId = components[componentIndex].id;

      // Create a selector to find this element again
      const selector = createElementSelector(element);

      // Add to edits
      const newEdit: ComponentEdit = {
        componentId,
        elementSelector: selector,
        editType: "text",
        originalValue: element.getAttribute("data-original-text") || "",
        currentValue: element.innerHTML,
        timestamp: Date.now(),
      };

      // Update edits
      setComponentEdits((prev) => {
        // Remove any previous edits to this same element
        const filteredEdits = prev.filter(
          (edit) =>
            !(
              edit.componentId === componentId &&
              edit.elementSelector === selector &&
              edit.editType === "text"
            )
        );
        return [...filteredEdits, newEdit];
      });

      // Force a re-render
      setComponents([...components]);
    }
  };

  // Create a CSS selector to uniquely identify an element
  const createElementSelector = (element: HTMLElement): string => {
    // This is a simplified version - in a real app, you'd want a more robust selector
    const tagName = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : "";
    const classes = Array.from(element.classList)
      .map((c) => `.${c}`)
      .join("");
    const index = Array.from(element.parentElement?.children || [])
      .filter((el) => el.tagName === element.tagName)
      .indexOf(element);

    return `${tagName}${id}${classes}:nth-of-type(${index + 1})`;
  };

  // Handle click on canvas elements to select them for editing
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Don't select if we're in a dialog or currently editing
    if ((e.target as HTMLElement).closest('[role="dialog"]') || isEditing)
      return;

    // Find the closest editable element
    const target = e.target as HTMLElement;
    const editableElement = target.closest(
      '[data-editable="true"]'
    ) as HTMLElement;

    if (editableElement) {
      e.stopPropagation();
      setSelectedElement(editableElement);

      // Determine the edit mode based on the element type
      const editableType = editableElement.dataset.editableType as EditModeType;
      setEditMode(editableType);

      // For text elements, update the text state
      if (editableType === "text") {
        setElementText(editableElement.innerHTML);
      }

      // Add a selection indicator
      document.querySelectorAll(".editing-active").forEach((el) => {
        el.classList.remove("editing-active");
      });
      editableElement.classList.add("editing-active");

      // Log for debugging
      console.log("Selected element:", editableElement);
      console.log("Edit mode:", editableType);
    } else {
      setSelectedElement(null);
      setEditMode(null);

      // Remove any active selection indicators
      document.querySelectorAll(".editing-active").forEach((el) => {
        el.classList.remove("editing-active");
      });
    }
  };

  // Add current state to history
  const addToHistory = (newComponents: ComponentType[]) => {
    // If we're not at the end of the history, truncate it
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newComponents]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo last action
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setComponents([...history[historyIndex - 1]]);
    }
  };

  // Redo last undone action
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setComponents([...history[historyIndex + 1]]);
    }
  };

  // Save project data
  const saveProject = () => {
    const projectData: ProjectData = {
      components,
      edits: componentEdits,
      lastSaved: Date.now(),
    };

    // Convert to JSON
    const projectJson = JSON.stringify(projectData);

    // Create a blob and download link
    const blob = new Blob([projectJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "website-project.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Initialize history when components change
  useEffect(() => {
    if (history.length === 0 && components.length > 0) {
      setHistory([[...components]]);
      setHistoryIndex(0);
    }
  }, [components, history]);

  // Update element text state when selected element changes
  useEffect(() => {
    if (selectedElement && editMode === "text") {
      setElementText(selectedElement.innerHTML);
    }
  }, [selectedElement, editMode]);

  // Scan for editable fields when selected component changes
  useEffect(() => {
    scanComponentForEditableFields();
  }, [selectedComponentIndex]);

  // Set up mutation observer to detect DOM changes and make new elements editable
  useEffect(() => {
    if (!canvasRef.current) return;

    // Initial marking of elements as editable
    makeElementsEditable();

    // Set up mutation observer to detect when new elements are added
    if (!observerRef.current) {
      observerRef.current = new MutationObserver((mutations) => {
        let shouldUpdate = false;

        mutations.forEach((mutation) => {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            shouldUpdate = true;
          }
        });

        if (shouldUpdate) {
          makeElementsEditable();
          scanComponentForEditableFields();
        }
      });

      observerRef.current.observe(canvasRef.current, {
        childList: true,
        subtree: true,
      });
    }

    // Add CSS for editable elements
    const style = document.createElement("style");
    style.innerHTML = `
    .editable-element {
      transition: outline 0.2s ease;
      outline: 1px dashed transparent;
      outline-offset: 2px;
    }
    .editable-element:hover {
      cursor: pointer;
    }
    .editing-active {
      outline: 3px solid #9333ea !important;
      outline-offset: 2px;
    }
    [contenteditable="true"] {
      background-color: rgba(147, 51, 234, 0.1);
      padding: 2px;
      min-height: 1em;
    }
    [contenteditable="true"]:focus {
      outline: none;
    }
    /* Special styling for editable links */
    a.editable-element:hover {
      text-decoration: none;
      cursor: pointer;
    }
    a[contenteditable="true"] {
      text-decoration: none;
    }
    /* Special styling for editable buttons */
    button.editable-element:hover {
      cursor: pointer;
    }
    button[contenteditable="true"] {
      pointer-events: none;
    }
    button[contenteditable="true"] * {
      pointer-events: none;
    }
  `;
    document.head.appendChild(style);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      document.head.removeChild(style);
    };
  }, [canvasRef.current]);

  // Toggle sidebars based on screen size
  useEffect(() => {
    if (isMobile) {
      setLeftSidebarOpen(false);
      setRightSidebarOpen(false);
    } else {
      setLeftSidebarOpen(true);
      setRightSidebarOpen(true);
    }
  }, [isMobile]);

  // Set viewport width based on selected size
  const getViewportWidth = () => {
    switch (viewportSize) {
      case "mobile":
        return "w-[375px]";
      case "tablet":
        return "w-[768px]";
      case "desktop":
      default:
        return "w-full max-w-5xl";
    }
  };

  // Add state to track the index being dragged
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (
    index: number,
    e: React.DragEvent<HTMLDivElement>
  ) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (
    index: number,
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
  };

  const handleDrop = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    const newComponents = Array.from(components);
    const [removed] = newComponents.splice(draggedIndex, 1);
    newComponents.splice(index, 0, removed);
    setComponents(newComponents);
    setSelectedComponentIndex(index);
    addToHistory(newComponents);
    setDraggedIndex(null);
  };

  // Render the component library sidebar
  const renderComponentLibrarySidebar = () => {
    const content = (
      <div className="h-full flex flex-col">
        <h2 className="text-lg font-bold mb-4">Components</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full mb-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Component
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[825px]">
            <DialogHeader>
              <DialogTitle>Component Library</DialogTitle>
            </DialogHeader>
            <ComponentLibrary onSelectComponent={addComponent} />
          </DialogContent>
        </Dialog>

        <div className="flex-grow overflow-auto">
          <div className="space-y-2">
            {components.map((component, index) => (
              <div
                key={`${component.id}-${index}`}
                draggable
                onDragStart={(e) => handleDragStart(index, e)}
                onDragOver={(e) => handleDragOver(index, e)}
                onDrop={(e) => handleDrop(index, e)}
                onDragEnd={() => setDraggedIndex(null)}
                onClick={() => setSelectedComponentIndex(index)}
                className={`p-2 border rounded-md cursor-pointer flex justify-between items-center transition-all ${
                  selectedComponentIndex === index
                    ? "bg-primary/10 border-primary"
                    : "bg-white border-gray-200"
                } ${draggedIndex === index ? "shadow-lg" : "shadow-sm"}`}
              >
                <span className="truncate flex-1">{component.name}</span>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveComponentUp(index);
                    }}
                    disabled={index === 0}
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveComponentDown(index);
                    }}
                    disabled={index === components.length - 1}
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Save/Load */}
        {/* <div className="mt-4 pt-4 border-t">
          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1" onClick={saveProject}>
              <Download className="h-4 w-4 mr-2" />
              Save
            </Button>
            <label className="flex-1">
              <input
                type="file"
                accept=".json"
                onChange={loadProject}
                className="hidden"
              />
              <Button variant="outline" className="w-full" as="span">
                <Upload className="h-4 w-4 mr-2" />
                Load
              </Button>
            </label>
          </div>
        </div> */}
      </div>
    );

    return isMobile ? (
      <Sheet open={leftSidebarOpen} onOpenChange={setLeftSidebarOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          {content}
        </SheetContent>
      </Sheet>
    ) : (
      <div
        className={`border-r bg-muted/20 p-4 flex flex-col ${
          leftSidebarOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        {content}
      </div>
    );
  };

  // Add a function to update button hover state
  const updateButtonHoverState = (
    element: HTMLButtonElement,
    normalClass: string,
    hoverClass: string
  ) => {
    // Remove existing background and hover classes
    const classList = Array.from(element.classList);
    const newClassList = classList.filter(
      (cls) => !cls.startsWith("bg-") && !cls.startsWith("hover:bg-")
    );

    // Add new classes
    if (normalClass) newClassList.push(normalClass);
    if (hoverClass) newClassList.push(hoverClass);

    element.className = newClassList.join(" ");

    // Record the edit and update
    recordTextEdit(element);
    scanComponentForEditableFields();
  };

  // Add a new function to render button editor
  const renderButtonFieldEditor = (field: EditableField) => {
    if (!field.hoverState) return null;

    const { normalClass, hoverClass } = field.hoverState;

    return (
      <div key={field.id} className="space-y-2 p-3 border rounded-md mb-2">
        <Label htmlFor={field.id}>{field.label}</Label>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-center">Normal</p>
            <Button
              variant="outline"
              size="sm"
              className={`w-full h-8 px-4 py-2 rounded-md transition-colors ${
                normalClass || "bg-primary text-primary-foreground"
              }`}
              onClick={() => {
                setSelectedElement(field.element);
                setEditMode("color");
              }}
            ></Button>
          </div>
          <div>
            <p className="text-center">Hover</p>
            <Button
              variant="outline"
              size="sm"
              className={`w-full h-8 px-4 py-2 rounded-md transition-colors ${
                hoverClass || "bg-primary text-primary-foreground"
              }`}
              onClick={() => {
                // Open color picker
                setSelectedElement(field.element);
                setEditMode("hover-color");
              }}
            ></Button>
          </div>
        </div>
      </div>
    );
  };

  // Render text field editor
  const renderTextFieldEditor = (field: EditableField) => {
    return (
      <div key={field.id} className="space-y-2 p-3 border rounded-md mb-2">
        <Label htmlFor={field.id}>{field.label}</Label>
        <Textarea
          id={field.id}
          value={field.value}
          onChange={(e) => updateElementText(field.element, e.target.value)}
          rows={2}
        />

        <div className="flex flex-wrap gap-1 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => applyTextStyle(field.element, "bold")}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => applyTextStyle(field.element, "italic")}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => applyTextStyle(field.element, "underline")}
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => applyTextStyle(field.element, "align-left")}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => applyTextStyle(field.element, "align-center")}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => applyTextStyle(field.element, "align-right")}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        {field.element.tagName.toLowerCase() === "a" && (
          <div className="mt-2">
            <Label htmlFor={`${field.id}-href`}>Link URL</Label>
            <Input
              id={`${field.id}-href`}
              value={(field.element as HTMLAnchorElement).href}
              onChange={(e) => {
                (field.element as HTMLAnchorElement).href = e.target.value;
                recordTextEdit(field.element);
              }}
            />
          </div>
        )}
      </div>
    );
  };

  // Render image field editor
  const renderImageFieldEditor = (field: EditableField) => {
    return (
      <div key={field.id} className="space-y-2 p-3 border rounded-md mb-2">
        <Label htmlFor={field.id}>{field.label}</Label>
        <div className="flex items-center gap-2 mb-2">
          <div className="h-12 w-12 border rounded-md overflow-hidden">
            <img
              src={field.value || "/placeholder.svg"}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <Input
              id={field.id}
              value={field.value}
              onChange={(e) => {
                (field.element as HTMLImageElement).src = e.target.value;
                scanComponentForEditableFields();
              }}
              placeholder="Image URL"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor={`${field.id}-alt`}>Alt Text</Label>
            <Input
              id={`${field.id}-alt`}
              value={(field.element as HTMLImageElement).alt}
              onChange={(e) => {
                (field.element as HTMLImageElement).alt = e.target.value;
                scanComponentForEditableFields();
              }}
              placeholder="Alt text"
            />
          </div>
          <div>
            <Label htmlFor={`${field.id}-width`}>Width</Label>
            <Input
              id={`${field.id}-width`}
              type="number"
              value={
                (field.element as HTMLImageElement).width ||
                (field.element as HTMLImageElement).clientWidth
              }
              onChange={(e) => {
                const width = Number.parseInt(e.target.value);
                if (!isNaN(width)) {
                  (field.element as HTMLImageElement).width = width;
                  (
                    field.element as HTMLImageElement
                  ).style.width = `${width}px`;
                  scanComponentForEditableFields();
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Render color field editor
  const renderColorFieldEditor = (field: EditableField) => {
    return (
      <div key={field.id} className="space-y-2 p-3 border rounded-md mb-2">
        <Label htmlFor={field.id}>{field.label}</Label>
        <div className="flex items-center gap-2">
          <div
            className={`h-6 w-6 rounded-md ${field.value}`}
            title={field.value}
          ></div>
          <span className="text-sm text-muted-foreground">{field.value}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-1"
          onClick={() => {
            setSelectedElement(field.element);
            setEditMode("color");
          }}
        >
          Edit Color
        </Button>
      </div>
    );
  };

  // Render the edit panel sidebar
  const renderEditPanelSidebar = () => {
    const content = (
      <Tabs defaultValue="edit">
        <TabsList className="w-full">
          <TabsTrigger value="edit" className="flex-1">
            <Layers className="h-4 w-4 mr-2" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-4">
          {selectedComponentIndex !== null ? (
            <div>
              <h3 className="text-lg font-medium mb-4">
                Edit {components[selectedComponentIndex].name}
              </h3>

              {selectedElement && editMode === "color" ? (
                <ColorPicker
                  element={selectedElement}
                  onUpdate={() => {
                    // Clone components to trigger re-render
                    setComponents([...components]);
                    addToHistory([...components]);
                    scanComponentForEditableFields();
                    // Reset edit mode to close the color picker
                    setEditMode(null);
                  }}
                  isHoverState={false}
                />
              ) : selectedElement && editMode === "hover-color" ? (
                <ColorPicker
                  element={selectedElement}
                  onUpdate={() => {
                    // Clone components to trigger re-render
                    setComponents([...components]);
                    addToHistory([...components]);
                    scanComponentForEditableFields();
                    // Reset edit mode to close the color picker
                    setEditMode(null);
                  }}
                  isHoverState={true}
                />
              ) : selectedElement && editMode === "image" ? (
                <ImageEditor
                  element={selectedElement as HTMLImageElement}
                  onUpdate={() => {
                    // Clone components to trigger re-render
                    setComponents([...components]);
                    addToHistory([...components]);
                    scanComponentForEditableFields();
                    // Reset edit mode to close the image editor
                    setEditMode(null);
                  }}
                />
              ) : (
                <ScrollArea className="h-[calc(100vh-250px)]">
                  <div className="space-y-4">
                    <Accordion
                      type="multiple"
                      defaultValue={["text", "image", "color", "button"]}
                    >
                      {editableFields.text.length > 0 && (
                        <AccordionItem value="text">
                          <AccordionTrigger className="py-2">
                            <div className="flex items-center">
                              <Type className="h-4 w-4 mr-2" />
                              <span>
                                Text Elements ({editableFields.text.length})
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            {editableFields.text.map((field) =>
                              renderTextFieldEditor(field)
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      )}

                      {editableFields.image.length > 0 && (
                        <AccordionItem value="image">
                          <AccordionTrigger className="py-2">
                            <div className="flex items-center">
                              <Image className="h-4 w-4 mr-2" />
                              <span>
                                Images ({editableFields.image.length})
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            {editableFields.image.map((field) =>
                              renderImageFieldEditor(field)
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      )}

                      {editableFields.color.length > 0 && (
                        <AccordionItem value="color">
                          <AccordionTrigger className="py-2">
                            <div className="flex items-center">
                              <PaintBucket className="h-4 w-4 mr-2" />
                              <span>
                                Colors ({editableFields.color.length})
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            {editableFields.color.map((field) =>
                              renderColorFieldEditor(field)
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      )}

                      {editableFields.button.length > 0 && (
                        <AccordionItem value="button">
                          <AccordionTrigger className="py-2">
                            <div className="flex items-center">
                              <ButtonIcon className="h-4 w-4 mr-2" />
                              <span>
                                Buttons ({editableFields.button.length})
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            {editableFields.button.map((field) =>
                              renderButtonFieldEditor(field)
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      )}
                    </Accordion>

                    {editableFields.text.length === 0 &&
                      editableFields.image.length === 0 &&
                      editableFields.color.length === 0 &&
                      editableFields.button.length === 0 && (
                        <div className="p-4 bg-muted/30 rounded-md text-center mb-4">
                          <p className="text-sm font-medium mb-2">
                            Double-click on text to edit directly on the page
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Or use the editors below to make changes
                          </p>
                        </div>
                      )}
                  </div>
                </ScrollArea>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">Select a component to edit.</p>
          )}
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <h3 className="text-lg font-medium mb-4">Page Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Page Title
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="My Website"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Description
              </label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Enter a description for search engines"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Favicon</label>
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 border rounded-md flex items-center justify-center bg-muted">
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="Favicon"
                  />
                </div>
                <Button variant="outline" size="sm">
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    );

    return isMobile ? (
      <Sheet open={rightSidebarOpen} onOpenChange={setRightSidebarOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          {content}
        </SheetContent>
      </Sheet>
    ) : (
      <div
        className={`border-l bg-muted/20 p-4 ${
          rightSidebarOpen ? "w-80" : "w-0 overflow-hidden"
        }`}
      >
        {content}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Toolbar */}
      <div className="h-14 border-b flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLeftSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="hidden sm:flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={historyIndex <= 0}
            >
              <Undo className="h-4 w-4 mr-1" />
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo className="h-4 w-4 mr-1" />
              Redo
            </Button>
          </div>
        </div>

        {/* Viewport size controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant={viewportSize === "desktop" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewportSize("desktop")}
            title="Desktop view"
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant={viewportSize === "tablet" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewportSize("tablet")}
            title="Tablet view"
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant={viewportSize === "mobile" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewportSize("mobile")}
            title="Mobile view"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <Code className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
          <Button size="sm" onClick={saveProject}>
            <Save className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Save</span>
          </Button>
          <Button size="sm" onClick={saveProject}>
            <Rocket className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Deploy</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Component Library */}
        {renderComponentLibrarySidebar()}

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4 flex justify-center">
          <div className={`transition-all duration-300 ${getViewportWidth()}`}>
            <div
              ref={canvasRef}
              className="min-h-full bg-white shadow-lg mx-auto"
              onClick={handleCanvasClick}
            >
              {components.length === 0 ? (
                <div className="justify-center w-fit mx-auto py-20 text-center">
                  <h2 className="text-2xl font-bold mb-4">
                    Your canvas is empty
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Click "Add Component" to start building your website
                  </p>
                  <Button>Add Your First Component</Button>
                </div>
              ) : (
                components.map((component, index) => (
                  <div
                    key={`${component.id}-${index}`}
                    className={`relative component-container ${
                      selectedComponentIndex === index
                        ? "outline outline-2 outline-primary"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedComponentIndex(index);
                    }}
                  >
                    {selectedComponentIndex === index && (
                      <div className="absolute top-2 right-2 z-10 bg-background shadow-md rounded-md flex">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            // Fetch new component here
                          }}
                        >
                          <WandSparkles className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateComponent(index);
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeComponent(index);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {component.component}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar - Edit Panel */}
        {renderEditPanelSidebar()}
      </div>

      {/* Mobile bottom toolbar */}
      {isMobile && (
        <div className="h-14 border-t flex items-center justify-around px-4 bg-background">
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={historyIndex <= 0}
          >
            <Undo className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
          >
            <Redo className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Eye className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Code className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Add a default export as well to ensure compatibility
export default WebsiteEditor;
