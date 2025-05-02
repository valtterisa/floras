"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PlusCircle,
  Layout,
  Type,
  ImageIcon,
  ListOrdered,
  FormInput,
} from "lucide-react";

export type ComponentType = {
  id: string;
  name: string;
  category: string;
  component: React.ReactNode;
  preview: React.ReactNode;
};

// Sample components that would be available in the library
const availableComponents: ComponentType[] = [
  {
    id: "hero",
    name: "Hero Section",
    category: "hero",
    component: <div>Hero Component</div>,
    preview: (
      <div className="h-24 flex items-center justify-center bg-muted/50 rounded-md">
        <span className="text-sm font-medium">Hero Section</span>
      </div>
    ),
  },
];

// Update the categoryIcons object to include the new categories
const categoryIcons = {
  layout: <Layout className="h-4 w-4" />,
  content: <Type className="h-4 w-4" />,
  media: <ImageIcon className="h-4 w-4" />,
  navigation: <ListOrdered className="h-4 w-4" />,
  form: <FormInput className="h-4 w-4" />,
  interactive: <Layout className="h-4 w-4" />,
};

interface ComponentLibraryProps {
  onSelectComponent?: (component: ComponentType) => void;
}

export function ComponentLibrary({ onSelectComponent }: ComponentLibraryProps) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredComponents = availableComponents.filter(
    (comp) => comp.category === activeTab
  );

  return (
    <div>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="Header">Header</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="form">Forms</TabsTrigger>
          <TabsTrigger value="interactive">Interactive</TabsTrigger>
        </TabsList>
        <ScrollArea className="h-[400px] w-full rounded-md border">
          <div className="grid w-full grid-cols-2 gap-4 p-4 md:grid-cols-3">
            {filteredComponents.map((component) => (
              <Card
                key={component.id}
                className="shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {component.name}
                    <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      {
                        categoryIcons[
                          component.category as keyof typeof categoryIcons
                        ]
                      }
                      <span className="ml-1">{component.category}</span>
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>{component.preview}</CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    size="sm"
                    onClick={() =>
                      onSelectComponent && onSelectComponent(component)
                    }
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
