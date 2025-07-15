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
import { Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

interface BillingClientProps {
  subscription: any | null;
  products: any | null;
}

const BillingClient: React.FC<BillingClientProps> = ({
  subscription,
  products,
}) => {
  console.log("products", products);

  return (
    <div className="px-4 md:px-6">
      <SiteHeader title="Billing" />
      <div className="space-y-6 pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              Manage your subscription and view billing details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscription ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold capitalize">
                    {subscription.product?.name || "Unknown"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Renews on{" "}
                    {new Date(
                      subscription.currentPeriodEnd
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ) : (
              <div>No active subscription found.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
            <CardDescription>Upgrade or change your plan.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={
                    plan.id === currentPlanId ? "border-primary border-2" : ""
                  }
                >
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {plan.prices && plan.prices[0]
                        ? `${(plan.prices[0].price_amount / 100).toFixed(2)} ${plan.prices[0].price_currency}`
                        : "Free"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {plan.recurring_interval
                        ? `Billed ${plan.recurring_interval}`
                        : ""}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {plan.id === currentPlanId ? (
                      <Badge variant="default">Current Plan</Badge>
                    ) : (
                      <Button
                        variant="outline"
                        disabled={!!isUpgrading}
                        onClick={() => {
                          window.location.href = plan.url;
                        }}
                      >
                        {isUpgrading === plan.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Upgrade
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingClient;
