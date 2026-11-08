import { useEffect, useState } from "react";
import axios from "axios";
import {
  MdVideocam,
  MdLogin,
  MdLogout,
  MdSensors,
  MdRefresh,
  MdTimeline,
  MdCreditCard,
  MdGroups2,
} from "react-icons/md";
import GradientAreaChart from "@/components/ui/demo";

interface PassengerLog {
  _id?: string;
  createdAt: string;
  in: number;
  out: number;
  inFrame: number;
}

interface PassengerStats {
  latest: PassengerLog;
  recent: PassengerLog[];
  totalRecords: number;
  totalIn: number;
  totalOut: number;
  currentInFrame: number;
}

interface AdminOverview {
  users: {
    total: number;
    clients: number;
    workers: number;
    admins: number;
  };
  transactions: {
    total: number;
    creditAdded: number;
    ticketSpent: number;
    netRevenue: number;
  };
  wallets: {
    totalBalance: number;
  };
  passengers: {
    totalRecords: number;
  };
  database: {
    status: string;
    cluster: string;
    name: string;
    latencyMs: number;
  };
}

function Dashboard() {
  const [stats, setStats] = useState<PassengerStats>({
    latest: { createdAt: new Date().toISOString(), in: 0, out: 0, inFrame: 0 },
    recent: [],
    totalRecords: 0,
    totalIn: 0,
    totalOut: 0,
    currentInFrame: 0,
  });
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const fetchStats = async () => {
    try {
      const [passengerRes, overviewRes] = await Promise.all([
        axios.get<PassengerStats>("/api/transaction/Passenger/stats?limit=30"),
        axios.get<AdminOverview>("/api/admin/overview").catch(() => null),
      ]);
      if (passengerRes?.data) setStats(passengerRes.data);
      if (overviewRes?.data) setOverview(overviewRes.data);
      setLastSyncTime(new Date());
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 2500);
    return () => clearInterval(interval);
  }, []);

  // Determine if camera stream is active (recent log received within last 30 seconds)
  const isStreamActive = Boolean(
    stats.latest?.createdAt &&
      new Date().getTime() - new Date(stats.latest.createdAt).getTime() < 30000
  );

  const netPassengers = Math.max(0, (stats.totalIn || 0) - (stats.totalOut || 0));

  return (
    <main className="h-full flex flex-col gap-5 sm:gap-6 text-white pb-10">
      {/* Header with Live Status & Manual Refresh */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold flex flex-wrap items-center gap-2 sm:gap-3">
            Admin Dashboard
            <span
              className={`text-xs px-2.5 py-0.5 sm:py-1 rounded-full font-medium flex items-center gap-1.5 ${
                isStreamActive
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isStreamActive ? "bg-emerald-400 animate-ping" : "bg-amber-400"
                }`}
              />
              {isStreamActive ? "LIVE CAMERA STREAM" : "STANDBY"}
            </span>
          </h1>
          <p className="text-white/50 text-xs sm:text-sm mt-1">
            Real-time YOLOv8 Computer Vision Passenger Traffic & System Overview
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
          <span className="text-[11px] sm:text-xs text-white/40">
            {lastSyncTime
              ? `Synced: ${lastSyncTime.toLocaleTimeString()}`
              : "Connecting..."}
          </span>
          <button
            onClick={fetchStats}
            title="Refresh now"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 rounded-md transition duration-200"
          >
            <MdRefresh className={`text-sm ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </header>

      {/* Real-time Passenger Metrics */}
      <section>
        <h2 className="text-base sm:text-lg font-semibold text-white/90 mb-3 flex items-center gap-2">
          <MdVideocam className="text-cyan-400 text-lg sm:text-xl" />
          Live People Counter Stream
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {/* People currently in frame */}
          <article className="Border p-3 sm:p-4 rounded-lg bg-white/[0.02] border border-cyan-500/30 relative overflow-hidden">
            <div className="flex justify-between items-center text-cyan-400">
              <span className="text-xs sm:text-sm font-medium">In Frame</span>
              <MdSensors className="text-xl sm:text-2xl opacity-80" />
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold text-cyan-400 my-1 sm:my-2">
              {stats.currentInFrame ?? stats.latest?.inFrame ?? 0}
            </div>
            <p className="text-white/60 text-[10px] sm:text-xs">Current in camera view</p>
          </article>

          {/* Total IN */}
          <article className="Border p-3 sm:p-4 rounded-lg bg-white/[0.02] border border-emerald-500/30">
            <div className="flex justify-between items-center text-emerald-400">
              <span className="text-xs sm:text-sm font-medium">Total In</span>
              <MdLogin className="text-xl sm:text-2xl opacity-80" />
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold text-emerald-400 my-1 sm:my-2">
              {stats.totalIn ?? stats.latest?.in ?? 0}
            </div>
            <p className="text-white/60 text-[10px] sm:text-xs">Boarded the tram</p>
          </article>

          {/* Total OUT */}
          <article className="Border p-3 sm:p-4 rounded-lg bg-white/[0.02] border border-rose-500/30">
            <div className="flex justify-between items-center text-rose-400">
              <span className="text-xs sm:text-sm font-medium">Total Out</span>
              <MdLogout className="text-xl sm:text-2xl opacity-80" />
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold text-rose-400 my-1 sm:my-2">
              {stats.totalOut ?? stats.latest?.out ?? 0}
            </div>
            <p className="text-white/60 text-[10px] sm:text-xs">Exited the tram</p>
          </article>

          {/* Net Occupancy */}
          <article className="Border p-3 sm:p-4 rounded-lg bg-white/[0.02] border border-indigo-500/30">
            <div className="flex justify-between items-center text-indigo-400">
              <span className="text-xs sm:text-sm font-medium">Net Occupancy</span>
              <MdTimeline className="text-xl sm:text-2xl opacity-80" />
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold text-indigo-400 my-1 sm:my-2">
              {netPassengers}
            </div>
            <p className="text-white/60 text-[10px] sm:text-xs">Inside tram (IN - OUT)</p>
          </article>
        </div>
      </section>

      {/* Live Passenger Activity Stream Table */}
      <section className="Border p-3 sm:p-4 rounded-lg bg-white/[0.02] border border-white/10 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-white/90">Live Activity Log</h3>
            <p className="text-[11px] sm:text-xs text-white/50">
              Showing recent batches received from YOLOv8 People Counter ({stats.totalRecords} total logs in DB)
            </p>
          </div>
          <span className="text-[10px] sm:text-xs px-2.5 py-1 bg-white/10 rounded-full text-white/70 self-start sm:self-auto font-mono">
            /api/transaction/Passenger
          </span>
        </div>

        <div className="touch-scroll overflow-x-auto mt-2">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/50 text-xs uppercase">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">IN Count</th>
                <th className="py-2.5 px-3">OUT Count</th>
                <th className="py-2.5 px-3">In Frame</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {stats.recent && stats.recent.length > 0 ? (
                stats.recent.slice(0, 10).map((log, idx) => (
                  <tr
                    key={log._id || idx}
                    className="hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="py-2.5 px-3 text-white/80">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-emerald-400 font-semibold">
                      +{log.in}
                    </td>
                    <td className="py-2.5 px-3 text-rose-400 font-semibold">
                      -{log.out}
                    </td>
                    <td className="py-2.5 px-3 text-cyan-400 font-semibold">
                      {log.inFrame}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Received
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-white/40">
                    No passenger data received yet. Start the Python counter app to send data!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Real-time Passenger Flow & Occupancy Area Chart */}
      <section>
        <GradientAreaChart
          logs={stats.recent}
          totalRecords={stats.totalRecords}
          isStreamActive={isStreamActive}
        />
      </section>

      {/* System Overview Cards (100% Real Database Metrics) */}
      <section className="grid md:grid-cols-3 grid-cols-1 gap-4">
        {[
          {
            title: "Total Registered Users",
            count: overview ? `${overview.users.total}` : "Loading...",
            description: overview
              ? `${overview.users.clients} Clients · ${overview.users.workers} Workers · ${overview.users.admins} Admins`
              : "Fetching registered users from MongoDB",
            icon: <MdGroups2 />,
          },
          {
            title: "Total Credit Added",
            count: overview
              ? `${overview.transactions.creditAdded.toLocaleString()} DZD`
              : "Loading...",
            description: overview
              ? `${overview.transactions.total} Transactions recorded in Atlas`
              : "Calculating transaction totals",
            icon: <MdCreditCard />,
          },
          {
            title: "Database Health",
            count: overview ? overview.database.status : "Connecting...",
            description: overview
              ? `${overview.database.cluster} (${overview.database.name}) · ${overview.database.latencyMs}ms latency`
              : "Connected to MongoDB Atlas",
            icon: <MdTimeline />,
          },
        ].map((card, idx) => (
          <article
            key={idx}
            className="Border p-4 rounded-lg bg-white/[0.02] border border-white/10"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-white/80 text-sm">{card.title}</span>
              <div className="text-xl text-white/60">{card.icon}</div>
            </div>
            <div className="text-2xl font-bold my-1 text-white">{card.count}</div>
            <p className="text-white/50 text-xs">{card.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Dashboard;
