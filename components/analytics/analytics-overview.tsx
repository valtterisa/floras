"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Users,
  Eye,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Sample data for the analytics overview
const overviewData = {
  daily: [
    { date: "Mon", engagement: 245, reach: 1245, clicks: 87, shares: 32 },
    { date: "Tue", engagement: 312, reach: 1312, clicks: 95, shares: 41 },
    { date: "Wed", engagement: 279, reach: 1279, clicks: 91, shares: 38 },
    { date: "Thu", engagement: 294, reach: 1294, clicks: 96, shares: 42 },
    { date: "Fri", engagement: 321, reach: 1321, clicks: 102, shares: 45 },
    { date: "Sat", engagement: 358, reach: 1358, clicks: 110, shares: 48 },
    { date: "Sun", engagement: 397, reach: 1397, clicks: 115, shares: 52 },
  ],
  weekly: [
    { date: "Week 1", engagement: 1897, reach: 8897, clicks: 623, shares: 245 },
    { date: "Week 2", engagement: 2154, reach: 9154, clicks: 687, shares: 278 },
    { date: "Week 3", engagement: 2489, reach: 9489, clicks: 712, shares: 301 },
    { date: "Week 4", engagement: 2756, reach: 9756, clicks: 745, shares: 324 },
  ],
  monthly: [
    { date: "Jan", engagement: 7897, reach: 35897, clicks: 2623, shares: 945 },
    { date: "Feb", engagement: 8154, reach: 38154, clicks: 2787, shares: 1078 },
    { date: "Mar", engagement: 9489, reach: 42489, clicks: 3012, shares: 1201 },
    {
      date: "Apr",
      engagement: 10756,
      reach: 45756,
      clicks: 3245,
      shares: 1324,
    },
    {
      date: "May",
      engagement: 11897,
      reach: 48897,
      clicks: 3423,
      shares: 1445,
    },
  ],
};

// Platform-specific metrics
const platformMetrics = [
  {
    platform: "twitter",
    name: "X (Twitter)",
    color: "#1DA1F2",
    engagement: 3245,
    engagementChange: 12.5,
    reach: 15678,
    reachChange: 8.3,
    followers: 4567,
    followersChange: 5.2,
  },
  {
    platform: "instagram",
    name: "Instagram",
    color: "#E1306C",
    engagement: 5678,
    engagementChange: 15.7,
    reach: 28945,
    reachChange: 10.2,
    followers: 8923,
    followersChange: 7.8,
  },
  {
    platform: "tiktok",
    name: "TikTok",
    color: "#000000",
    engagement: 7890,
    engagementChange: 25.3,
    reach: 45678,
    reachChange: 18.7,
    followers: 12456,
    followersChange: 22.5,
  },
];

export default function AnalyticsOverview() {
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">(
    "weekly"
  );
  const [selectedMetric, setSelectedMetric] = useState<
    "engagement" | "reach" | "clicks" | "shares"
  >("engagement");

  // Get the data for the selected time range
  const data = overviewData[timeRange];

  // Calculate total metrics and changes
  const totalEngagement = platformMetrics.reduce(
    (sum, platform) => sum + platform.engagement,
    0
  );
  const avgEngagementChange =
    platformMetrics.reduce(
      (sum, platform) => sum + platform.engagementChange,
      0
    ) / platformMetrics.length;

  const totalReach = platformMetrics.reduce(
    (sum, platform) => sum + platform.reach,
    0
  );
  const avgReachChange =
    platformMetrics.reduce((sum, platform) => sum + platform.reachChange, 0) /
    platformMetrics.length;

  const totalFollowers = platformMetrics.reduce(
    (sum, platform) => sum + platform.followers,
    0
  );
  const avgFollowersChange =
    platformMetrics.reduce(
      (sum, platform) => sum + platform.followersChange,
      0
    ) / platformMetrics.length;

  // Website traffic data
  const websiteTraffic = 12567;
  const websiteTrafficChange = 9.8;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Quick Analytics Overview</h3>
        <Tabs
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as any)}
        >
          <TabsList className="h-8">
            <TabsTrigger value="daily" className="text-xs px-3">
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="text-xs px-3">
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs px-3">
              Monthly
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Engagement */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Engagement
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalEngagement.toLocaleString()}
            </div>
            <div className="flex items-center mt-1">
              {avgEngagementChange > 0 ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={cn(
                  "text-xs",
                  avgEngagementChange > 0 ? "text-green-500" : "text-red-500"
                )}
              >
                {Math.abs(avgEngagementChange).toFixed(1)}% from previous period
              </span>
            </div>
            <div className="h-10 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <Area
                    type="monotone"
                    dataKey="engagement"
                    stroke="#8b5cf6"
                    fill="#8b5cf680"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Total Reach */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalReach.toLocaleString()}
            </div>
            <div className="flex items-center mt-1">
              {avgReachChange > 0 ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={cn(
                  "text-xs",
                  avgReachChange > 0 ? "text-green-500" : "text-red-500"
                )}
              >
                {Math.abs(avgReachChange).toFixed(1)}% from previous period
              </span>
            </div>
            <div className="h-10 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <Area
                    type="monotone"
                    dataKey="reach"
                    stroke="#06b6d4"
                    fill="#06b6d480"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Total Followers */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Followers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalFollowers.toLocaleString()}
            </div>
            <div className="flex items-center mt-1">
              {avgFollowersChange > 0 ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={cn(
                  "text-xs",
                  avgFollowersChange > 0 ? "text-green-500" : "text-red-500"
                )}
              >
                {Math.abs(avgFollowersChange).toFixed(1)}% from previous period
              </span>
            </div>
            <div className="h-10 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformMetrics}>
                  <Bar
                    dataKey="followers"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Website Traffic */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Website Traffic
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {websiteTraffic.toLocaleString()}
            </div>
            <div className="flex items-center mt-1">
              {websiteTrafficChange > 0 ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={cn(
                  "text-xs",
                  websiteTrafficChange > 0 ? "text-green-500" : "text-red-500"
                )}
              >
                {Math.abs(websiteTrafficChange).toFixed(1)}% from previous
                period
              </span>
            </div>
            <div className="h-10 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#f59e0b"
                    fill="#f59e0b80"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {platformMetrics.map((platform) => (
              <div key={platform.platform} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: platform.color }}
                  ></div>
                  <h4 className="font-medium">{platform.name}</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted p-2 rounded-md">
                    <div className="text-xs text-muted-foreground">
                      Engagement
                    </div>
                    <div className="font-medium">
                      {platform.engagement.toLocaleString()}
                    </div>
                    <div className="flex items-center mt-1">
                      {platform.engagementChange > 0 ? (
                        <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span
                        className={cn(
                          "text-xs",
                          platform.engagementChange > 0
                            ? "text-green-500"
                            : "text-red-500"
                        )}
                      >
                        {Math.abs(platform.engagementChange).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-muted p-2 rounded-md">
                    <div className="text-xs text-muted-foreground">Reach</div>
                    <div className="font-medium">
                      {platform.reach.toLocaleString()}
                    </div>
                    <div className="flex items-center mt-1">
                      {platform.reachChange > 0 ? (
                        <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span
                        className={cn(
                          "text-xs",
                          platform.reachChange > 0
                            ? "text-green-500"
                            : "text-red-500"
                        )}
                      >
                        {Math.abs(platform.reachChange).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Performance Trends</CardTitle>
          <Tabs
            value={selectedMetric}
            onValueChange={(value) => setSelectedMetric(value as any)}
            className="w-full max-w-[400px]"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="reach">Reach</TabsTrigger>
              <TabsTrigger value="clicks">Clicks</TabsTrigger>
              <TabsTrigger value="shares">Shares</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border rounded-md shadow-md">
                          <p className="font-medium">{label}</p>
                          <div className="mt-2 space-y-1 text-sm">
                            <p className="flex justify-between gap-4">
                              <span className="text-muted-foreground">
                                {selectedMetric}:
                              </span>
                              <span className="font-medium">
                                {payload[0].value}
                              </span>
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey={selectedMetric}
                  fill={
                    selectedMetric === "engagement"
                      ? "#8b5cf6"
                      : selectedMetric === "reach"
                        ? "#06b6d4"
                        : selectedMetric === "clicks"
                          ? "#f59e0b"
                          : "#10b981"
                  }
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
