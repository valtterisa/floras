"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Filter, Search } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface AdvancedAnalyticsProps {
  filterBy?: "content" | "audience";
}

// Sample data for content performance
const contentPerformanceData = [
  {
    id: 1,
    title: "Exciting news coming soon! Stay tuned for our big announcement.",
    date: "May 2, 2025",
    platforms: ["twitter", "instagram"],
    engagement: 1245,
    reach: 8790,
    clicks: 342,
    shares: 87,
  },
  {
    id: 2,
    title: "Join our webinar on content strategy this Friday!",
    date: "May 5, 2025",
    platforms: ["twitter"],
    engagement: 876,
    reach: 5430,
    clicks: 213,
    shares: 54,
  },
  {
    id: 3,
    title: "Behind the scenes look at our new product line.",
    date: "May 8, 2025",
    platforms: ["instagram", "tiktok"],
    engagement: 2134,
    reach: 12450,
    clicks: 567,
    shares: 132,
  },
  {
    id: 4,
    title: "Our summer collection is now available!",
    date: "May 10, 2025",
    platforms: ["twitter", "instagram", "tiktok"],
    engagement: 3245,
    reach: 18790,
    clicks: 876,
    shares: 245,
  },
  {
    id: 5,
    title: "Weekend vibes! What are your plans for the weekend?",
    date: "May 12, 2025",
    platforms: ["instagram"],
    engagement: 1876,
    reach: 9870,
    clicks: 432,
    shares: 98,
  },
];

// Sample data for audience demographics
const audienceDemographicsData = {
  age: [
    { name: "18-24", value: 25 },
    { name: "25-34", value: 35 },
    { name: "35-44", value: 20 },
    { name: "45-54", value: 12 },
    { name: "55+", value: 8 },
  ],
  gender: [
    { name: "Male", value: 45 },
    { name: "Female", value: 52 },
    { name: "Other", value: 3 },
  ],
  location: [
    { name: "United States", value: 45 },
    { name: "United Kingdom", value: 15 },
    { name: "Canada", value: 10 },
    { name: "Australia", value: 8 },
    { name: "Germany", value: 7 },
    { name: "Other", value: 15 },
  ],
  interests: [
    { subject: "Technology", A: 120, fullMark: 150 },
    { subject: "Fashion", A: 98, fullMark: 150 },
    { subject: "Travel", A: 86, fullMark: 150 },
    { subject: "Food", A: 99, fullMark: 150 },
    { subject: "Fitness", A: 85, fullMark: 150 },
    { subject: "Entertainment", A: 65, fullMark: 150 },
  ],
};

// Sample data for engagement by time
const engagementByTimeData = [
  { time: "6 AM", engagement: 120 },
  { time: "9 AM", engagement: 345 },
  { time: "12 PM", engagement: 567 },
  { time: "3 PM", engagement: 789 },
  { time: "6 PM", engagement: 1023 },
  { time: "9 PM", engagement: 876 },
  { time: "12 AM", engagement: 456 },
];

// Sample data for engagement by day
const engagementByDayData = [
  { day: "Monday", engagement: 1245 },
  { day: "Tuesday", engagement: 1345 },
  { day: "Wednesday", engagement: 1567 },
  { day: "Thursday", engagement: 1789 },
  { day: "Friday", engagement: 2023 },
  { day: "Saturday", engagement: 1876 },
  { day: "Sunday", engagement: 1456 },
];

// Sample data for content type performance
const contentTypeData = [
  { name: "Images", value: 45, color: "#4ade80" },
  { name: "Videos", value: 30, color: "#f472b6" },
  { name: "Text Only", value: 15, color: "#60a5fa" },
  { name: "Links", value: 10, color: "#c084fc" },
];

// Sample data for hashtag performance
const hashtagPerformanceData = [
  { name: "#marketing", count: 45, engagement: 2345 },
  { name: "#socialmedia", count: 38, engagement: 1987 },
  { name: "#contentcreation", count: 32, engagement: 1765 },
  { name: "#digitalmarketing", count: 28, engagement: 1543 },
  { name: "#branding", count: 25, engagement: 1432 },
];

export default function AdvancedAnalytics({
  filterBy,
}: AdvancedAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<"7days" | "30days" | "90days">(
    "30days"
  );
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");

  // Determine which content to show based on filterBy prop
  const showContentAnalytics = !filterBy || filterBy === "content";
  const showAudienceAnalytics = !filterBy || filterBy === "audience";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-medium">Advanced Analytics</h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <Label
              htmlFor="platform-filter"
              className="text-sm whitespace-nowrap"
            >
              Platform:
            </Label>
            <Select
              value={selectedPlatform}
              onValueChange={setSelectedPlatform}
            >
              <SelectTrigger id="platform-filter" className="w-[140px]">
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="twitter">X (Twitter)</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as any)}
          >
            <TabsList className="h-8">
              <TabsTrigger value="7days" className="text-xs px-3">
                Last 7 Days
              </TabsTrigger>
              <TabsTrigger value="30days" className="text-xs px-3">
                Last 30 Days
              </TabsTrigger>
              <TabsTrigger value="90days" className="text-xs px-3">
                Last 90 Days
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Content Performance Analytics */}
      {showContentAnalytics && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
              <CardDescription>
                Analyze how your content is performing across platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Content Type Performance */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">
                    Content Type Performance
                  </h4>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={contentTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {contentTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      Images and videos generate the highest engagement rates.
                    </p>
                    <p>
                      Consider creating more visual content for better
                      performance.
                    </p>
                  </div>
                </div>

                {/* Engagement by Time */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">
                    Engagement by Time of Day
                  </h4>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={engagementByTimeData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="time" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Bar
                          dataKey="engagement"
                          fill="#8b5cf6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Peak engagement occurs between 6 PM and 9 PM.</p>
                    <p>
                      Consider scheduling your most important content during
                      these hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Hashtag Performance */}
              <div className="mt-8">
                <h4 className="text-sm font-medium mb-4">
                  Top Performing Hashtags
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Hashtag</th>
                        <th className="text-left py-2 px-4">Usage Count</th>
                        <th className="text-left py-2 px-4">
                          Total Engagement
                        </th>
                        <th className="text-left py-2 px-4">Avg. Engagement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hashtagPerformanceData.map((hashtag) => (
                        <tr
                          key={hashtag.name}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="py-2 px-4 font-medium">
                            {hashtag.name}
                          </td>
                          <td className="py-2 px-4">{hashtag.count}</td>
                          <td className="py-2 px-4">
                            {hashtag.engagement.toLocaleString()}
                          </td>
                          <td className="py-2 px-4">
                            {Math.round(
                              hashtag.engagement / hashtag.count
                            ).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Content */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top Performing Content</CardTitle>
                <CardDescription>
                  Your best performing posts across platforms
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search content..."
                    className="pl-8 w-[200px]"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Content</th>
                      <th className="text-left py-2 px-4">Date</th>
                      <th className="text-left py-2 px-4">Platforms</th>
                      <th className="text-left py-2 px-4">Engagement</th>
                      <th className="text-left py-2 px-4">Reach</th>
                      <th className="text-left py-2 px-4">Clicks</th>
                      <th className="text-left py-2 px-4">Shares</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contentPerformanceData.map((content) => (
                      <tr
                        key={content.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="py-2 px-4 font-medium max-w-[300px] truncate">
                          {content.title}
                        </td>
                        <td className="py-2 px-4">{content.date}</td>
                        <td className="py-2 px-4">
                          <div className="flex gap-1">
                            {content.platforms.map((platform) => (
                              <Badge
                                key={platform}
                                variant="outline"
                                className={
                                  platform === "twitter"
                                    ? "bg-blue-50 text-blue-600 border-blue-200"
                                    : platform === "instagram"
                                      ? "bg-pink-50 text-pink-600 border-pink-200"
                                      : "bg-gray-900 text-white border-gray-700"
                                }
                              >
                                {platform === "twitter"
                                  ? "X"
                                  : platform === "instagram"
                                    ? "IG"
                                    : "TT"}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          {content.engagement.toLocaleString()}
                        </td>
                        <td className="py-2 px-4">
                          {content.reach.toLocaleString()}
                        </td>
                        <td className="py-2 px-4">
                          {content.clicks.toLocaleString()}
                        </td>
                        <td className="py-2 px-4">
                          {content.shares.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Audience Analytics */}
      {showAudienceAnalytics && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Audience Demographics</CardTitle>
              <CardDescription>
                Understand who your audience is across platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Age Distribution */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Age Distribution</h4>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={audienceDemographicsData.age}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {audienceDemographicsData.age.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`hsl(${index * 45}, 70%, 60%)`}
                            />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Gender Distribution */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Gender Distribution</h4>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={audienceDemographicsData.gender}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          <Cell fill="#60a5fa" />
                          <Cell fill="#f472b6" />
                          <Cell fill="#a78bfa" />
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Location Distribution */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Location Distribution</h4>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={audienceDemographicsData.location}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis type="number" fontSize={12} />
                        <YAxis
                          dataKey="name"
                          type="category"
                          fontSize={12}
                          width={100}
                        />
                        <Tooltip />
                        <Bar
                          dataKey="value"
                          fill="#8b5cf6"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Interests */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Audience Interests</h4>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        outerRadius={90}
                        data={audienceDemographicsData.interests}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} />
                        <Radar
                          name="Audience"
                          dataKey="A"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.6}
                        />
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Patterns */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Patterns</CardTitle>
              <CardDescription>
                When your audience is most active
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Engagement by Time */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">
                    Engagement by Time of Day
                  </h4>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={engagementByTimeData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="time" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Bar
                          dataKey="engagement"
                          fill="#8b5cf6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Peak engagement occurs between 6 PM and 9 PM.</p>
                    <p>
                      Consider scheduling your most important content during
                      these hours.
                    </p>
                  </div>
                </div>

                {/* Engagement by Day */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">
                    Engagement by Day of Week
                  </h4>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={engagementByDayData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="day" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Bar
                          dataKey="engagement"
                          fill="#06b6d4"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Friday has the highest engagement rate.</p>
                    <p>
                      Monday and Tuesday show lower engagement compared to other
                      days.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
