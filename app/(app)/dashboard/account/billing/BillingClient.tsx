"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Star } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { managePolarSubscription } from "@/lib/polar";

interface BillingClientProps {
  subscription: any | null;
  products: any | null;
  customerPortalUrl: string | null;
}

const BillingClient: React.FC<BillingClientProps> = ({
  subscription,
  products,
  customerPortalUrl,
}) => {
  const limitsByPlan: Record<
    string,
    { websites: number; chat: number; label: string; popular?: boolean }
  > = {
    free: { websites: 2, chat: 5, label: "Free" },
    starter: { websites: 2, chat: 5, label: "Free" },
    pro: { websites: -1, chat: 20, label: "Pro", popular: true },
    enterprise: { websites: -1, chat: -1, label: "Enterprise" },
  };

  const formatLimit = (value: number, noun: string) =>
    value < 0 ? `Unlimited ${noun}` : `${value} ${noun}`;

  return (
    <div className="md:px-4">
      <SiteHeader title="Billing" />
      <div className="space-y-6 pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Manage Plans</CardTitle>
            <CardDescription>
              Choose the plan that fits your needs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product: any) => {
                const key = String(product.name || "").toLowerCase();
                const limits = limitsByPlan[key] || {
                  websites: 0,
                  chat: 0,
                  label: product.name,
                };
                const isCurrent = product.id === subscription?.product?.id;
                const priceAmount = product.prices?.[0]?.priceAmount ?? 0;
                const priceCurrency =
                  product.prices?.[0]?.priceCurrency?.toUpperCase?.() ?? "USD";
                const interval = product.recurringInterval
                  ? `Billed ${product.recurringInterval}ly`
                  : "";

                return (
                  <Card
                    key={product.id}
                    className={
                      isCurrent
                        ? "border-primary border-2 shadow-sm"
                        : "hover:shadow-sm transition-shadow"
                    }
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          {product.name}
                          {limits.popular ? (
                            <Badge variant="secondary" className="gap-1">
                              <Star size={14} /> Popular
                            </Badge>
                          ) : null}
                        </CardTitle>
                        {isCurrent ? (
                          <Badge variant="default">Current</Badge>
                        ) : null}
                      </div>
                      {product.description && (
                        <CardDescription>{product.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="text-3xl font-bold">
                          {priceAmount
                            ? `${priceAmount / 100} ${priceCurrency}`
                            : "Free"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {interval}
                        </div>
                      </div>

                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          {formatLimit(limits.websites, "websites")}
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          {formatLimit(limits.chat, "AI chat messages")}
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant={isCurrent ? "outline" : "default"}
                        onClick={() => {
                          if (customerPortalUrl) {
                            window.location.href = customerPortalUrl;
                          }
                        }}
                      >
                        {isCurrent ? "Manage" : "Select"}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingClient;
