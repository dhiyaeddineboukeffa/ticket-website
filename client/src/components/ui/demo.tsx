"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import { Activity, Video, Users, ArrowUpRight, ArrowDownRight, Eye } from "lucide-react";

export interface PassengerLog {
  _id?: string;
  createdAt: string;
  in: number;
  out: number;
  inFrame: number;
}

interface GradientAreaChartProps {
  logs?: PassengerLog[];
  totalRecords?: number;
  isStreamActive?: boolean;
}

const chartConfig: ChartConfig = {
  in: {
    label: "Entered (+IN)",
    color: "#22d3ee",
  },
  out: {
    label: "Exited (-OUT)",
    color: "#f43f5e",
  },
  inFrame: {
    label: "In Camera Frame",
    color: "#818cf8",
  },
  net: {
    label: "Net Occupancy",
    color: "#10b981",
  },
};

export default function GradientAreaChart({
  logs = [],
  totalRecords = 0,
  isStreamActive = false,
}: GradientAreaChartProps) {
  const [metricFilter, setMetricFilter] = useState<"all" | "flow" | "inFrame" | "net">("all");

  const chartData = useMemo(() => {
    if (!logs || logs.length === 0) return [];
    return [...logs].reverse().map((item, index) => {
      const d = new Date(item.createdAt);
      const time = d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      return {
        id: index + 1,
        time,
        fullTime: d.toLocaleString(),
        in: Number(item.in) || 0,
        out: Number(item.out) || 0,
        inFrame: Number(item.inFrame) || 0,
        net: Math.max(0, (Number(item.in) || 0) - (Number(item.out) || 0)),
      };
    });
  }, [logs]);

  // Aggregate stats over this window
  const latestPoint = chartData[chartData.length - 1] || { in: 0, out: 0, inFrame: 0, net: 0 };

  return (
    <Card className="bg-[#18181B] border-white/10 text-white shadow-xl">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
        <div>
          <CardTitle className="text-white flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-2">
              <Video className="w-5 h-5 text-cyan-400" />
              Real-Time YOLOv8 Passenger Flow & Occupancy
            </span>
            <Badge
              variant="outline"
              className={
                isStreamActive
                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30 ml-2"
                  : "text-cyan-400 bg-cyan-500/10 border-cyan-500/30 ml-2"
              }
            >
              <Activity className={`h-3.5 w-3.5 mr-1 ${isStreamActive ? "animate-pulse" : ""}`} />
              <span>{isStreamActive ? "LIVE CAMERA STREAM" : `SYNCED (${totalRecords || logs.length} Records)`}</span>
            </Badge>
          </CardTitle>
          <CardDescription className="text-white/60 mt-1">
            Visualizing passenger batches entering, exiting, and detected in-camera frame from /api/transaction/Passenger
          </CardDescription>
        </div>

        {/* View toggle filters */}
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-lg border border-white/10 text-xs">
          <button
            onClick={() => setMetricFilter("all")}
            className={`px-2.5 py-1 rounded transition-colors ${
              metricFilter === "all"
                ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                : "text-white/60 hover:text-white"
            }`}
          >
            All Channels
          </button>
          <button
            onClick={() => setMetricFilter("flow")}
            className={`px-2.5 py-1 rounded transition-colors ${
              metricFilter === "flow"
                ? "bg-rose-500/20 text-rose-300 font-semibold"
                : "text-white/60 hover:text-white"
            }`}
          >
            In vs Out
          </button>
          <button
            onClick={() => setMetricFilter("inFrame")}
            className={`px-2.5 py-1 rounded transition-colors ${
              metricFilter === "inFrame"
                ? "bg-indigo-500/20 text-indigo-300 font-semibold"
                : "text-white/60 hover:text-white"
            }`}
          >
            In Frame
          </button>
          <button
            onClick={() => setMetricFilter("net")}
            className={`px-2.5 py-1 rounded transition-colors ${
              metricFilter === "net"
                ? "bg-emerald-500/20 text-emerald-300 font-semibold"
                : "text-white/60 hover:text-white"
            }`}
          >
            Net Occupancy
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* Quick batch KPI badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="px-3 py-2 rounded-md bg-white/[0.03] border border-cyan-500/20 flex items-center justify-between">
            <span className="text-xs text-white/60 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" /> Latest IN
            </span>
            <span className="font-mono font-bold text-cyan-400">+{latestPoint.in}</span>
          </div>
          <div className="px-3 py-2 rounded-md bg-white/[0.03] border border-rose-500/20 flex items-center justify-between">
            <span className="text-xs text-white/60 flex items-center gap-1">
              <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" /> Latest OUT
            </span>
            <span className="font-mono font-bold text-rose-400">-{latestPoint.out}</span>
          </div>
          <div className="px-3 py-2 rounded-md bg-white/[0.03] border border-indigo-500/20 flex items-center justify-between">
            <span className="text-xs text-white/60 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-indigo-400" /> In Camera Frame
            </span>
            <span className="font-mono font-bold text-indigo-400">{latestPoint.inFrame}</span>
          </div>
          <div className="px-3 py-2 rounded-md bg-white/[0.03] border border-emerald-500/20 flex items-center justify-between">
            <span className="text-xs text-white/60 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-400" /> Net Occupancy
            </span>
            <span className="font-mono font-bold text-emerald-400">{latestPoint.net}</span>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="h-[280px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-lg text-white/40">
            <Video className="w-8 h-8 mb-2 opacity-50 animate-pulse" />
            <p className="text-sm">Waiting for incoming YOLOv8 passenger records...</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
            <AreaChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#27272A" />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="#A1A1AA"
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                stroke="#A1A1AA"
                width={30}
                allowDecimals={false}
              />
              <ChartTooltip cursor={{ stroke: "#ffffff20", strokeWidth: 1 }} content={<ChartTooltipContent />} />
              <defs>
                {/* Cyan Gradient for Entered (IN) */}
                <linearGradient id="gradient-in" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05} />
                </linearGradient>

                {/* Rose Gradient for Exited (OUT) */}
                <linearGradient id="gradient-out" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05} />
                </linearGradient>

                {/* Indigo Gradient for In Frame */}
                <linearGradient id="gradient-inFrame" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.05} />
                </linearGradient>

                {/* Emerald Gradient for Net Occupancy */}
                <linearGradient id="gradient-net" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              {(metricFilter === "all" || metricFilter === "flow") && (
                <Area
                  type="monotone"
                  dataKey="in"
                  name="Entered (+IN)"
                  fill="url(#gradient-in)"
                  fillOpacity={0.4}
                  stroke="#22d3ee"
                  strokeWidth={2}
                />
              )}

              {(metricFilter === "all" || metricFilter === "flow") && (
                <Area
                  type="monotone"
                  dataKey="out"
                  name="Exited (-OUT)"
                  fill="url(#gradient-out)"
                  fillOpacity={0.4}
                  stroke="#f43f5e"
                  strokeWidth={2}
                />
              )}

              {(metricFilter === "all" || metricFilter === "inFrame") && (
                <Area
                  type="monotone"
                  dataKey="inFrame"
                  name="In Camera Frame"
                  fill="url(#gradient-inFrame)"
                  fillOpacity={0.4}
                  stroke="#818cf8"
                  strokeWidth={2}
                />
              )}

              {metricFilter === "net" && (
                <Area
                  type="monotone"
                  dataKey="net"
                  name="Net Occupancy"
                  fill="url(#gradient-net)"
                  fillOpacity={0.5}
                  stroke="#10b981"
                  strokeWidth={2.5}
                />
              )}
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
