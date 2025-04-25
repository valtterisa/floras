"use client";

import type React from "react";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import FloatingToolbar, {
  ActiveFormats,
  ToolbarPosition,
} from "./floating-toolbar";

interface IframeEditorProps {
  initialUrl?: string;
}

export default function WebsitePreview({
  initialUrl = "http://localhost:3000/test", // @TODO: Make this dynamic
}: IframeEditorProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [url, setUrl] = useState(initialUrl);
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState<ToolbarPosition>({
    top: 0,
    left: 0,
  });
  const [activeFormats, setActiveFormats] = useState<ActiveFormats>({
    bold: false,
    italic: false,
    underline: false,
  });
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
    null
  );
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  const [elementType, setElementType] = useState<string>("");

  // Initialize the editor when iframe loads
  const initializeEditor = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow || !iframe.contentDocument) {
      setDebugInfo("Iframe or contentDocument not available");
      return;
    }

    setIsEditorReady(true);

    try {
      // First, remove any existing editor styles to avoid duplication
      const existingStyle =
        iframe.contentDocument.getElementById("editor-styles");
      if (existingStyle) {
        existingStyle.remove();
      }

      // Add styles to highlight editable elements
      const style = iframe.contentDocument.createElement("style");
      style.id = "editor-styles";
      style.textContent = `
        [data-editable="true"] {
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          position: relative !important;
        }
        
        [data-editable="true"].hover-active {
          outline: 2px dashed #7c3aed !important;
          outline-offset: 2px !important;
          background-color: rgba(124, 58, 237, 0.05) !important;
        }
        
        [data-editable="true"].focus-active {
          outline: 2px solid #7c3aed !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1) !important;
        }
        
        [data-editable="true"]::before {
          content: attr(data-editable-tag) !important;
          font-weight: 400 !important;
          position: absolute !important;
          top: -20px !important;
          left: 0 !important;
          background: rgba(124, 58, 237, 0.9) !important;
          color: white !important;
          padding: 2px 6px !important;
          border-radius: 4px !important;
          font-size: 10px !important;
          opacity: 0 !important;
          transition: opacity 0.2s ease !important;
          pointer-events: none !important;
          z-index: 1000 !important;
        }
        
        [data-editable="true"].hover-active::before {
          opacity: 1 !important;
        }
      `;
      iframe.contentDocument.head.appendChild(style);

      // Re-query elements after cloning
      const editableElements = iframe.contentDocument.querySelectorAll(
        '[data-editable="true"]'
      );
      editableElements.forEach((element) => {
        element.addEventListener("click", (e) => {
          console.log("element clicked", element);
          e.preventDefault();
          e.stopPropagation();
          handleElementSelection(element as HTMLElement);
        });
      });

      // Add click handler to the document to close toolbar when clicking outside
      iframe.contentDocument.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        if (!target.hasAttribute("data-editable")) {
          setShowToolbar(false);
        }
      });
    } catch (error) {
      console.error("Error initializing editor:", error);
      setDebugInfo(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
      toast({
        title: "Editor Initialization Error",
        description: "Could not initialize editor. Try reloading the page.",
        variant: "destructive",
      });
    }
  };

  // Handle element selection
  const handleElementSelection = (element: HTMLElement) => {
    if (!element) return;

    // Reset previous element's contentEditable if necessary
    if (selectedElement && selectedElement !== element) {
      if (selectedElement.hasAttribute("data-editable-text")) {
        selectedElement.contentEditable = "false";
      }
    }

    setSelectedElement(element);
    const elementTypeLower = element.tagName.toLowerCase();
    setElementType(elementTypeLower);

    // Get element position
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return; // Added contentWindow check

    const iframeRect = iframe.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    // Position toolbar directly above the element
    const toolbarHeight = 40; // Approximate height

    setToolbarPosition({
      top: elementRect.top + iframeRect.top - toolbarHeight - 10,
      left: elementRect.left + elementRect.width / 2 + iframeRect.left - 150, // Approximate width / 2
    });

    setShowToolbar(true);
    setDebugInfo(`Selected element: ${elementTypeLower}`);

    // Only check text formatting and enable contentEditable for non-image elements
    if (element.tagName !== "IMG") {
      // Set contentEditable for text elements
      if (element.hasAttribute("data-editable-text")) {
        element.contentEditable = "true";
      } else {
        element.contentEditable = "false"; // Ensure non-text elements aren't editable
      }

      // Focus the element within the iframe's context
      iframe.contentWindow.focus(); // Focus iframe window first
      element.focus(); // Then focus the element

      checkActiveFormats(element);

      // Create a selection range if there isn't one (might be redundant after focus)
      const selection = iframe.contentWindow.getSelection();
      if (selection && selection.rangeCount === 0) {
        const range = iframe.contentDocument!.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else {
      element.contentEditable = "false"; // Ensure images are not contentEditable
    }
  };

  // Check which formats are currently active for the selected element
  const checkActiveFormats = useCallback(
    (element: HTMLElement) => {
      if (!element || element.tagName === "IMG") return;

      try {
        const iframe = iframeRef.current;
        if (!iframe || !iframe.contentWindow || !iframe.contentDocument) return;

        const selection = iframe.contentWindow.getSelection();
        let isBold = false;
        let isItalic = false;
        let isUnderline = false;

        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          let node: Node | null = range.commonAncestorContainer;

          // Traverse up from the common ancestor to the editable element
          while (node && node !== element.parentElement) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const style = iframe.contentWindow.getComputedStyle(
                node as Element
              );
              if (
                style.fontWeight === "bold" ||
                parseInt(style.fontWeight, 10) >= 700
              ) {
                isBold = true;
              }
              if (style.fontStyle === "italic") {
                isItalic = true;
              }
              if (style.textDecorationLine.includes("underline")) {
                isUnderline = true;
              }
            }
            // Stop if we found all formats or reached the top
            if (isBold && isItalic && isUnderline) break;
            if (node === element) break; // Stop at the selected element itself
            node = node.parentNode;
          }

          // If traversal didn't find styles, check the element itself
          if (!isBold || !isItalic || !isUnderline) {
            const elementStyle = iframe.contentWindow.getComputedStyle(element);
            if (
              !isBold &&
              (elementStyle.fontWeight === "bold" ||
                parseInt(elementStyle.fontWeight, 10) >= 700)
            ) {
              isBold = true;
            }
            if (!isItalic && elementStyle.fontStyle === "italic") {
              isItalic = true;
            }
            if (
              !isUnderline &&
              elementStyle.textDecorationLine.includes("underline")
            ) {
              isUnderline = true;
            }
          }
        } else {
          // Fallback for no selection: check the element's style directly
          const style = iframe.contentWindow.getComputedStyle(element);
          isBold =
            style.fontWeight === "bold" ||
            parseInt(style.fontWeight, 10) >= 700;
          isItalic = style.fontStyle === "italic";
          isUnderline = style.textDecorationLine.includes("underline");
        }

        setActiveFormats({
          bold: isBold,
          italic: isItalic,
          underline: isUnderline,
        });
      } catch (error) {
        console.error("Error checking active formats:", error);
        setDebugInfo(`Error checking formats: ${error}`);
      }
    },
    [selectedElement]
  ); // Depend on selectedElement

  // Format text
  const formatText = (command: string, value = "") => {
    const iframe = iframeRef.current; // Get iframe ref
    if (
      !selectedElement ||
      !iframe || // Check iframe ref
      !iframe.contentDocument ||
      selectedElement.tagName === "IMG"
    )
      return;

    // Ensure the element is contentEditable if it's supposed to be
    if (!selectedElement.hasAttribute("data-editable-text")) return;
    selectedElement.contentEditable = "true"; // Ensure it's editable for the command

    try {
      // Focus the iframe window and the element to ensure correct context for execCommand
      iframe.contentWindow?.focus();
      selectedElement.focus();

      // Create a selection if there isn't one or if it's collapsed
      const selection = iframe.contentWindow?.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        if (iframe.contentDocument) {
          const range = iframe.contentDocument.createRange();
          range.selectNodeContents(selectedElement);
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }

      // Execute command in the iframe's document
      if (iframe.contentDocument) {
        // Log before command
        console.log(
          `Executing command: ${command} with value: ${value || "none"}`
        );
        setDebugInfo(`Executing command: ${command}`);

        const result = iframe.contentDocument.execCommand(
          command,
          false,
          value
        );

        // Log after command
        console.log(`Command ${command} result: ${result}`);
        if (!result) {
          console.warn(`Command ${command} failed`);
          setDebugInfo(`Command ${command} failed`);
          toast({
            title: "Formatting Error",
            description: `Could not apply ${command} formatting. The browser denied the command.`,
            variant: "destructive",
          });
        } else {
          setDebugInfo(
            `Applied ${command} ${value ? `with value ${value}` : ""}`
          );
          // Trigger manual update if needed, e.g., save state
        }
      }

      // Re-check active formats after applying changes
      checkActiveFormats(selectedElement);

      // Optional: Refocus element after potential focus loss from execCommand
      // selectedElement.focus();
    } catch (error) {
      console.error(`Error applying format ${command}:`, error);
      setDebugInfo(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
      toast({
        title: "Formatting Error",
        description: `Could not apply ${command} formatting.`,
        variant: "destructive",
      });
    }
  };

  // Handle URL change
  useEffect(() => {
    setUrl(inputUrl);
    setShowToolbar(false);
    setDebugInfo("");
  }, [inputUrl]);

  // Handle iframe load
  useEffect(() => {
    setDebugInfo("Iframe loaded, initializing editor...");
    setTimeout(() => {
      initializeEditor(); // Initialize editor styles
      makeElementsEditable(); // Mark elements as editable
    }, 500); // Give the iframe a moment to fully render
  }, [iframeRef.current]);

  // Apply background color
  const setBackgroundColor = (color: string) => {
    if (selectedElement) {
      try {
        selectedElement.style.backgroundColor = color;
        setDebugInfo(`Applied background color: ${color}`);
      } catch (error) {
        setDebugInfo(`Error applying background color: ${error}`);
      }
    }
  };

  // Set background image
  const setBackgroundImage = (url: string) => {
    if (selectedElement) {
      try {
        selectedElement.style.backgroundImage = `url(${url})`;
        selectedElement.style.backgroundSize = "cover";
        selectedElement.style.backgroundPosition = "center";
        setDebugInfo(`Applied background image: ${url}`);
      } catch (error) {
        setDebugInfo(`Error applying background image: ${error}`);
      }
    }
  };

  // Set link
  const setLink = (url: string) => {
    formatText("createLink", url);
  };

  // Set alt tag for image
  const setAltTag = (alt: string) => {
    if (selectedElement && selectedElement.tagName === "IMG") {
      try {
        (selectedElement as HTMLImageElement).alt = alt;
        setDebugInfo(`Set alt text: ${alt}`);
        toast({
          title: "Alt Text Updated",
          description: "The image alt text has been updated successfully.",
        });
      } catch (error) {
        setDebugInfo(`Error setting alt text: ${error}`);
      }
    }
  };

  // Close toolbar
  const closeToolbar = () => {
    setShowToolbar(false);
  };

  // Make elements in the canvas editable
  const makeElementsEditable = () => {
    const iframe = iframeRef.current; // Ensure iframeRef is defined
    if (!iframe || !iframe.contentDocument) return;

    const doc = iframe.contentDocument;

    // Elements suitable for direct text editing
    const textEditableTags = new Set([
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "span",
      "li",
      "button",
      "a",
    ]);
    // All elements we want to be selectable/styleable
    const selectableElementsSelector =
      "h1, h2, h3, h4, h5, h6, p, span, section, header, nav, footer, li, div, button, a, img";

    // Select all relevant elements inside the iframe
    const selectableElements = doc.querySelectorAll(selectableElementsSelector);

    let currentHoveredElement: HTMLElement | null = null; // Track the currently hovered element

    selectableElements.forEach((el) => {
      // Skip elements that shouldn't be editable at all
      if (el.closest("script, style, noscript, svg")) return;

      const htmlEl = el as HTMLElement; // Cast to HTMLElement
      const tagNameLower = htmlEl.tagName.toLowerCase();

      // Mark element as selectable
      htmlEl.setAttribute("data-editable", "true");
      htmlEl.setAttribute("data-editable-tag", tagNameLower);

      // Check if element type is suitable for text editing
      if (textEditableTags.has(tagNameLower)) {
        htmlEl.setAttribute("data-editable-type", "text");
        // Set contentEditable initially false, enable on selection
        htmlEl.contentEditable = "false";
        htmlEl.setAttribute("data-editable-text", "true"); // Mark as text editable
        // Prevent browsers default drag behavior for contentEditable elements
        htmlEl.draggable = false;
      } else {
        htmlEl.setAttribute("data-editable-type", "block"); // Or 'image' etc.
        htmlEl.contentEditable = "false"; // Ensure non-text elements are not editable
      }

      // Add hover and focus event listeners (keep existing logic)
      htmlEl.addEventListener("mouseenter", () => {
        // Remove hover styles from the previously hovered element
        if (currentHoveredElement && currentHoveredElement !== htmlEl) {
          currentHoveredElement.classList.remove("hover-active");
        }

        // Add hover style to the current element
        htmlEl.classList.add("hover-active");
        currentHoveredElement = htmlEl; // Update the currently hovered element
      });

      htmlEl.addEventListener("mouseleave", () => {
        // Remove hover style from the current element
        htmlEl.classList.remove("hover-active");
        if (currentHoveredElement === htmlEl) {
          currentHoveredElement = null; // Reset the currently hovered element
        }
      });

      // We handle focus via handleElementSelection now, but keep blur styling
      htmlEl.addEventListener("blur", () => {
        htmlEl.classList.remove("focus-active");
        // Important: Turn off contentEditable when focus is lost to prevent accidental edits
        // if (htmlEl.hasAttribute("data-editable-text")) {
        //    htmlEl.contentEditable = "false";
        // }
      });

      // Add click listener (already exists, ensure it calls handleElementSelection)
      // Check if listener already exists to prevent duplicates if makeElementsEditable runs multiple times
      if (!(htmlEl as any).__clickListenerAttached) {
        htmlEl.addEventListener("click", (e) => {
          console.log("element clicked", htmlEl);
          e.preventDefault();
          e.stopPropagation();
          handleElementSelection(htmlEl);
        });
        (htmlEl as any).__clickListenerAttached = true;
      }
    });

    console.log(`Made ${selectableElements.length} elements selectable`);
  };

  // Debugging Iframe Ref
  // useEffect(() => {
  //   if (iframeRef.current) {
  //     console.log("Iframe ref is assigned", iframeRef.current);
  //   }
  // }, [iframeRef.current]);

  return (
    <div className="flex flex-col h-full w-full gap-4">
      {/* Floating Toolbar */}
      <FloatingToolbar
        show={showToolbar}
        position={toolbarPosition}
        activeFormats={activeFormats}
        elementType={elementType}
        selectedElement={selectedElement}
        onFormatText={formatText}
        onSetBackgroundColor={setBackgroundColor}
        onSetBackgroundImage={setBackgroundImage}
        onSetLink={setLink}
        onSetAltTag={setAltTag}
        onClose={closeToolbar}
      />

      {/* Iframe Container */}
      <div className="relative w-full h-full border rounded-lg overflow-hidden">
        {/* Sometimes "loads" infinitely for no reason @TODO: Fix */}
        {!isEditorReady && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center">
              <p className="mb-2">Loading editor...</p>
              <p className="text-sm text-muted-foreground">
                Click on any text element to edit it.
              </p>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={url}
          className="w-full h-full"
          sandbox="allow-same-origin allow-forms"
        />
      </div>
    </div>
  );
}
