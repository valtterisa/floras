"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminClientProps {
  websiteCount: number;
}

export default function AdminClient({ websiteCount }: AdminClientProps) {
  const [isCreatingPreview, setIsCreatingPreview] = useState(false);
  const { toast } = useToast();

  const createPreviewEnvironment = async () => {
    setIsCreatingPreview(true);
    try {
      // Here you would implement the logic to create a preview environment
      // For now, just show a success message
      toast({
        title: "Preview Environment Created",
        description: "New preview environment has been set up successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create preview environment",
        variant: "destructive",
      });
    } finally {
      setIsCreatingPreview(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Badge variant="secondary">Admin Access</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Total Websites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{websiteCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview Environments</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={createPreviewEnvironment}
              disabled={isCreatingPreview}
              className="w-full"
            >
              {isCreatingPreview ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Preview Environment
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
