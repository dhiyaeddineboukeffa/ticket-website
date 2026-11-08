import { useEffect, useState } from "react";
import axios from "axios";
import {
  MdCreditCard,
  MdSearch,
  MdRefresh,
  MdAdd,
  MdRemove,
  MdAttachMoney,
  MdPeople,
  MdTrendingUp,
  MdCheckCircle,
  MdWarning,
  MdClose,
} from "react-icons/md";

interface Client {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  balance: number;
  createdAt: string;
}

interface CreditStats {
  totalBalance: number;
  averageBalance: number;
  totalClients: number;
  topClient: Client | null;
}

function ClientCredits() {
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<CreditStats>({
    totalBalance: 0,
    averageBalance: 0,
    totalClients: 0,
    topClient: null,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Adjust Credit Modal
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(100);
  const [adjustType, setAdjustType] = useState<"add" | "deduct">("add");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const fetchCredits = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);

      const res = await axios.get<{ clients: Client[]; stats: CreditStats }>(
        `/api/admin/credits?${params.toString()}`
      );
      setClients(res.data.clients);
      setStats(res.data.stats);
    } catch (err) {
      console.error("Error fetching client credits:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCredits();
  };

  const openAdjustModal = (client: Client, type: "add" | "deduct" = "add") => {
    setSelectedClient(client);
    setAdjustType(type);
    setAdjustAmount(type === "add" ? 200 : 50);
    setModalError("");
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    setModalError("");
    setModalLoading(true);

    const finalAmount = adjustType === "add" ? Math.abs(adjustAmount) : -Math.abs(adjustAmount);

    try {
      await axios.post("/api/admin/credits/adjust", {
        clientId: selectedClient._id,
        amount: finalAmount,
      });
      setSelectedClient(null);
      fetchCredits();
    } catch (err: any) {
      setModalError(err.response?.data?.error || "Failed to adjust balance");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <main className="h-full flex flex-col gap-6 text-white pb-10">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="md:text-3xl text-xl font-bold flex items-center gap-3">
            <MdCreditCard className="text-emerald-400" />
            Client Credits & Balances
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Monitor client card balances, recharge credits, and track tram subscriptions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCredits}
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
        <article className="Border p-3 sm:p-4 rounded-lg bg-white/[0.02] border border-emerald-500/30">
          <div className="flex justify-between items-center text-emerald-400">
            <span className="text-xs sm:text-sm font-medium">Total Balance</span>
            <MdAttachMoney className="text-xl sm:text-2xl opacity-80" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 my-1 sm:my-2">
            {stats.totalBalance.toLocaleString()} DZD
          </div>
          <p className="text-white/50 text-[10px] sm:text-xs">Sum of client balances</p>
        </article>

        <article className="Border p-3 sm:p-4 rounded-lg bg-white/[0.02] border border-cyan-500/30">
          <div className="flex justify-between items-center text-cyan-400">
            <span className="text-xs sm:text-sm font-medium">Clients</span>
            <MdPeople className="text-xl sm:text-2xl opacity-80" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 my-1 sm:my-2">
            {stats.totalClients}
          </div>
          <p className="text-white/50 text-[10px] sm:text-xs">Active rider wallets</p>
        </article>

        <article className="Border p-3 sm:p-4 rounded-lg bg-white/[0.02] border border-indigo-500/30">
          <div className="flex justify-between items-center text-indigo-400">
            <span className="text-xs sm:text-sm font-medium">Avg Balance</span>
            <MdTrendingUp className="text-xl sm:text-2xl opacity-80" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 my-1 sm:my-2">
            {stats.averageBalance.toLocaleString()} DZD
          </div>
          <p className="text-white/50 text-[10px] sm:text-xs">Mean balance per rider</p>
        </article>

        <article className="Border p-3 sm:p-4 rounded-lg bg-white/[0.02] border border-purple-500/30">
          <div className="flex justify-between items-center text-purple-400">
            <span className="text-xs sm:text-sm font-medium">Top Holder</span>
            <MdCheckCircle className="text-xl sm:text-2xl opacity-80" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-white mt-1 sm:mt-2 truncate">
            {stats.topClient ? stats.topClient.fullName : "None"}
          </div>
          <p className="text-purple-300 font-mono text-xs mt-0.5">
            {stats.topClient ? `${stats.topClient.balance.toLocaleString()} DZD` : "0 DZD"}
          </p>
        </article>
      </section>

      {/* Search Bar */}
      <section className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] p-4 rounded-lg border border-white/10">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[280px] max-w-md relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, email, or phone..."
            className="w-full bg-white/5 border border-white/15 rounded-md pl-10 pr-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
          />
        </form>

        <div className="text-xs text-white/50">
          Showing {clients.length} of {stats.totalClients} client accounts
        </div>
      </section>

      {/* Client Credits Table */}
      <section className="Border p-3 sm:p-4 rounded-lg bg-white/[0.02] border border-white/10 touch-scroll overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10 text-white/50 text-xs uppercase">
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Current Balance</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Account Created</th>
              <th className="py-3 px-4 text-right">Credit Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs">
            {clients.length > 0 ? (
              clients.map((client) => {
                const isLow = client.balance < 100;
                const isEmpty = client.balance === 0;

                return (
                  <tr key={client._id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-medium text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400">
                        {client.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-white/90">{client.fullName}</div>
                        <div className="text-white/40 text-[11px]">ID: {client._id.slice(-6)}</div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-white/70">
                      <div>{client.email}</div>
                      <div className="text-white/40">{client.phoneNumber || "No phone"}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono text-base font-bold text-emerald-400">
                        {client.balance.toLocaleString()} DZD
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {isEmpty ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Empty (0 DZD)
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <MdWarning className="text-xs" /> Low Balance
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <MdCheckCircle className="text-xs" /> Active
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-white/50">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openAdjustModal(client, "add")}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded transition"
                        >
                          <MdAdd className="text-sm" /> Add Credit
                        </button>
                        <button
                          onClick={() => openAdjustModal(client, "deduct")}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded transition"
                        >
                          <MdRemove className="text-sm" /> Deduct
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-white/40">
                  {loading ? "Loading clients..." : "No clients found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Adjust Credit Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#18181B] border border-white/20 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                <MdCreditCard className={adjustType === "add" ? "text-emerald-400" : "text-rose-400"} />
                {adjustType === "add" ? "Add Credit to Client" : "Deduct Balance"}
              </h2>
              <button
                onClick={() => setSelectedClient(null)}
                className="text-white/40 hover:text-white transition p-1"
              >
                <MdClose className="text-xl" />
              </button>
            </div>

            {/* Client summary in modal */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg mb-4 text-xs">
              <div className="font-semibold text-white text-sm">{selectedClient.fullName}</div>
              <div className="text-white/50">{selectedClient.email}</div>
              <div className="mt-2 text-white/70">
                Current Balance:{" "}
                <span className="font-mono font-bold text-emerald-400">
                  {selectedClient.balance.toLocaleString()} DZD
                </span>
              </div>
            </div>

            {modalError && (
              <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs rounded-md">
                {modalError}
              </div>
            )}

            <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
              {/* Type toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-lg border border-white/10">
                <button
                  type="button"
                  onClick={() => setAdjustType("add")}
                  className={`py-1.5 rounded-md font-semibold transition ${
                    adjustType === "add"
                      ? "bg-emerald-600 text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  + Add Credit
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType("deduct")}
                  className={`py-1.5 rounded-md font-semibold transition ${
                    adjustType === "deduct"
                      ? "bg-rose-600 text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  - Deduct Balance
                </button>
              </div>

              {/* Quick Select Buttons */}
              <div>
                <label className="block text-white/70 mb-2">Quick Select Amount:</label>
                <div className="grid grid-cols-4 gap-2">
                  {(adjustType === "add"
                    ? [100, 200, 500, 1000]
                    : [50, 100, 150, 200]
                  ).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAdjustAmount(val)}
                      className={`py-2 px-1 text-center rounded border font-mono font-medium transition ${
                        adjustAmount === val
                          ? adjustType === "add"
                            ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                            : "border-rose-400 bg-rose-500/20 text-rose-300"
                          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      {adjustType === "add" ? `+${val}` : `-${val}`} DZD
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom amount */}
              <div>
                <label className="block text-white/70 mb-1">Custom Amount (DZD) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Preview calculation */}
              <div className="p-3 rounded-lg bg-black/40 border border-white/10 flex justify-between items-center text-xs">
                <span className="text-white/60">New Balance after adjustment:</span>
                <span className="font-mono font-bold text-sm text-cyan-400">
                  {Math.max(
                    0,
                    selectedClient.balance + (adjustType === "add" ? adjustAmount : -adjustAmount)
                  ).toLocaleString()}{" "}
                  DZD
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedClient(null)}
                  className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className={`px-4 py-2 rounded-md font-semibold text-white transition disabled:opacity-50 ${
                    adjustType === "add"
                      ? "bg-emerald-600 hover:bg-emerald-500"
                      : "bg-rose-600 hover:bg-rose-500"
                  }`}
                >
                  {modalLoading
                    ? "Updating..."
                    : adjustType === "add"
                    ? `Add +${adjustAmount} DZD`
                    : `Deduct -${adjustAmount} DZD`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default ClientCredits;
