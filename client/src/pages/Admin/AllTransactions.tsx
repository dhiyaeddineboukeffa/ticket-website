import { useEffect, useState } from "react";
import axios from "axios";
import {
  MdCurrencyExchange,
  MdSearch,
  MdRefresh,
  MdTrendingUp,
  MdTrendingDown,
  MdReceiptLong,
  MdDirectionsTransit,
  MdAccountBalanceWallet,
} from "react-icons/md";

interface Transaction {
  _id: string;
  balance: number;
  client?: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
  };
  worker?: {
    _id: string;
    fullName: string;
    email: string;
    role: string;
  };
  createdAt: string;
}

interface TransactionStats {
  totalTransactions: number;
  totalCreditAdded: number;
  totalTicketSpent: number;
  netFlow: number;
}

function AllTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats>({
    totalTransactions: 0,
    totalCreditAdded: 0,
    totalTicketSpent: 0,
    netFlow: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "recharge" | "ride">("all");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filterType !== "all") params.append("type", filterType);

      const res = await axios.get<{
        transactions: Transaction[];
        stats: TransactionStats;
      }>(`/api/admin/transactions?${params.toString()}`);

      setTransactions(res.data.transactions);
      setStats(res.data.stats);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filterType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransactions();
  };

  return (
    <main className="h-full flex flex-col gap-6 text-white pb-10">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="md:text-3xl text-xl font-bold flex items-center gap-3">
            <MdCurrencyExchange className="text-indigo-400" />
            All Transactions
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Audit credit additions, tram ticket rides, and station operator logs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTransactions}
            title="Refresh"
            className="flex items-center gap-2 px-3 py-2 text-xs bg-white/10 hover:bg-white/20 border border-white/20 rounded-md transition"
          >
            <MdRefresh className={`text-base ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <article className="Border p-3 sm:p-4 rounded-lg bg-white/[0.02] border border-white/10">
          <div className="flex justify-between items-center text-white/70">
            <span className="text-xs sm:text-sm font-medium">Total Activity</span>
            <MdReceiptLong className="text-xl sm:text-2xl text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white my-1 sm:my-2">
            {stats.totalTransactions}
          </div>
          <p className="text-white/50 text-[10px] sm:text-xs">Ledger events recorded</p>
        </article>

        <article className="Border p-3 sm:p-4 rounded-lg bg-white/[0.02] border border-emerald-500/30">
          <div className="flex justify-between items-center text-emerald-400">
            <span className="text-xs sm:text-sm font-medium">Recharges</span>
            <MdTrendingUp className="text-xl sm:text-2xl opacity-80" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 my-1 sm:my-2">
            +{stats.totalCreditAdded.toLocaleString()} DZD
          </div>
          <p className="text-white/50 text-[10px] sm:text-xs">Credit purchases added</p>
        </article>

        <article className="Border p-3 sm:p-4 rounded-lg bg-white/[0.02] border border-rose-500/30">
          <div className="flex justify-between items-center text-rose-400">
            <span className="text-xs sm:text-sm font-medium">Ticket Rides</span>
            <MdTrendingDown className="text-xl sm:text-2xl opacity-80" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 my-1 sm:my-2">
            -{stats.totalTicketSpent.toLocaleString()} DZD
          </div>
          <p className="text-white/50 text-[10px] sm:text-xs">Fares redeemed for travel</p>
        </article>

        <article className="Border p-3 sm:p-4 rounded-lg bg-white/[0.02] border border-indigo-500/30">
          <div className="flex justify-between items-center text-indigo-400">
            <span className="text-xs sm:text-sm font-medium">Net Credit</span>
            <MdAccountBalanceWallet className="text-xl sm:text-2xl opacity-80" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 my-1 sm:my-2">
            {stats.netFlow.toLocaleString()} DZD
          </div>
          <p className="text-white/50 text-[10px] sm:text-xs">Recharges minus spent</p>
        </article>
      </section>

      {/* Tabs and Search Bar */}
      <section className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] p-4 rounded-lg border border-white/10">
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 text-xs">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              filterType === "all"
                ? "bg-white/15 text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            All Activity ({stats.totalTransactions})
          </button>
          <button
            onClick={() => setFilterType("recharge")}
            className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 ${
              filterType === "recharge"
                ? "bg-emerald-600 text-white"
                : "text-emerald-400/70 hover:text-emerald-300"
            }`}
          >
            <MdTrendingUp /> Recharges (+)
          </button>
          <button
            onClick={() => setFilterType("ride")}
            className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 ${
              filterType === "ride"
                ? "bg-rose-600 text-white"
                : "text-rose-400/70 hover:text-rose-300"
            }`}
          >
            <MdDirectionsTransit /> Tram Rides (-)
          </button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[280px] max-w-md relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client or worker name..."
            className="w-full bg-white/5 border border-white/15 rounded-md pl-10 pr-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-indigo-400"
          />
        </form>
      </section>

      {/* Transactions Table */}
      <section className="Border p-3 sm:p-4 rounded-lg bg-white/[0.02] border border-white/10 touch-scroll overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[750px]">
          <thead>
            <tr className="border-b border-white/10 text-white/50 text-xs uppercase">
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-4">Client / Rider</th>
              <th className="py-3 px-4">Processed By</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4 text-right">Date & Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs">
            {transactions.length > 0 ? (
              transactions.map((tx) => {
                const isRecharge = tx.balance > 0;

                return (
                  <tr key={tx._id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-mono text-white/60">
                      #{tx._id.slice(-8).toUpperCase()}
                    </td>

                    <td className="py-3 px-4">
                      {tx.client ? (
                        <div>
                          <div className="font-semibold text-white/90">
                            {tx.client.fullName}
                          </div>
                          <div className="text-white/40 text-[11px]">{tx.client.email}</div>
                        </div>
                      ) : (
                        <span className="text-white/40 italic">Account Deleted</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-white/70">
                      {tx.worker ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-white/80">
                            {tx.worker.fullName}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                            {tx.worker.role || "staff"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-white/40 italic">System / Self-service</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {isRecharge ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <MdTrendingUp className="text-xs" /> Credit Top-Up
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          <MdDirectionsTransit className="text-xs" /> Tram Ride Fare
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-sm">
                      {isRecharge ? (
                        <span className="text-emerald-400">
                          +{tx.balance.toLocaleString()} DZD
                        </span>
                      ) : (
                        <span className="text-rose-400">
                          {tx.balance.toLocaleString()} DZD
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right text-white/50">
                      {new Date(tx.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-white/40">
                  {loading ? "Loading transactions..." : "No transactions found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default AllTransactions;
