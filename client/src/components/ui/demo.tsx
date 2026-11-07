import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/area-chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

const chartData = [
  { month: "January", desktop: 342, mobile: 245 },
  { month: "February", desktop: 876, mobile: 654 },
  { month: "March", desktop: 512, mobile: 387 },
  { month: "April", desktop: 629, mobile: 521 },
  { month: "May", desktop: 458, mobile: 412 },
  { month: "June", desktop: 781, mobile: 598 },
  { month: "July", desktop: 394, mobile: 312 },
  { month: "August", desktop: 925, mobile: 743 },
  { month: "September", desktop: 647, mobile: 489 },
  { month: "October", desktop: 532, mobile: 476 },
  { month: "November", desktop: 803, mobile: 687 },
  { month: "December", desktop: 271, mobile: 198 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function GradientAreaChart() {
  return (
    <Card className="bg-[#18181B] border-white/10 text-white shadow-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            Monthly Tram Ridership & Passenger Volume
            <Badge
              variant="outline"
              className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 ml-2"
            >
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              <span>+18.4%</span>
            </Badge>
          </span>
        </CardTitle>
        <CardDescription className="text-white/60">
          Showing passenger transit traffic and mobile validations across tram lines
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
          <AreaChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#27272A" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="#A1A1AA"
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient
                id="gradient-chart-desktop"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.6}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.05}
                />
              </linearGradient>
              <linearGradient
                id="gradient-chart-mobile"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.6}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="mobile"
              name="Mobile App Validations"
              fill="url(#gradient-chart-mobile)"
              fillOpacity={0.4}
              stroke="var(--chart-2)"
              stackId="a"
              strokeWidth={1.5}
            />
            <Area
              dataKey="desktop"
              name="Physical Station Scans"
              fill="url(#gradient-chart-desktop)"
              fillOpacity={0.4}
              stroke="var(--chart-1)"
              stackId="a"
              strokeWidth={1.5}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
