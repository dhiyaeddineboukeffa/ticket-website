import { useEffect, useState } from "react";
import axios from "axios";
import {
  MdGroup,
  MdPersonAdd,
  MdSearch,
  MdRefresh,
  MdShield,
  MdBadge,
  MdPerson,
  MdDeleteOutline,
  MdClose,
} from "react-icons/md";

interface User {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  isAdmin: boolean;
  balance: number;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  clientCount: number;
  workerCount: number;
  adminCount: number;
}

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    clientCount: 0,
    workerCount: 0,
    adminCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Add User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "normal",
    balance: 0,
  });
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // Role Edit state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (roleFilter !== "all") params.append("role", roleFilter);

      const res = await axios.get<{ users: User[]; stats: Stats }>(
        `/api/admin/users?${params.toString()}`
      );
      setUsers(res.data.users);
      setStats(res.data.stats);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await axios.put(`/api/admin/users/${userId}`, {
        role: newRole,
        isAdmin: newRole === "admin",
      });
      setEditingUserId(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"? This will also remove their transaction history.`)) {
      return;
    }
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete user");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);

    try {
      await axios.post("/api/admin/users", newUser);
      setShowAddModal(false);
      setNewUser({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        role: "normal",
        balance: 0,
      });
      fetchUsers();
    } catch (err: any) {
      setAddError(err.response?.data?.error || "Failed to create user");
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <main className="h-full flex flex-col gap-6 text-white pb-10">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="md:text-3xl text-xl font-bold flex items-center gap-3">
            <MdGroup className="text-cyan-400" />
            User Management
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Manage system clients, station workers, and administrators
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 rounded-md transition shadow-lg shadow-emerald-900/30"
          >
            <MdPersonAdd className="text-lg" />
            Add New User
          </button>
          <button
            onClick={fetchUsers}
            title="Refresh"
            className="p-2 text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-md transition"
          >
            <MdRefresh className={`text-lg ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <article className="Border p-3 sm:p-4 rounded-lg bg-white/[0.02] border border-white/10">
          <div className="flex justify-between items-center text-white/70">
            <span className="text-xs sm:text-sm font-medium">Total Users</span>
            <MdGroup className="text-xl sm:text-2xl text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white my-1 sm:my-2">
            {stats.totalUsers}
          </div>
          <p className="text-white/50 text-[10px] sm:text-xs">Registered system accounts</p>
        </article>

        <article className="Border p-3 sm:p-4 rounded-lg bg-white/[0.02] border border-white/10">
          <div className="flex justify-between items-center text-white/70">
            <span className="text-xs sm:text-sm font-medium">Clients</span>
            <MdPerson className="text-xl sm:text-2xl text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 my-1 sm:my-2">
            {stats.clientCount}
          </div>
          <p className="text-white/50 text-[10px] sm:text-xs">Normal rider accounts</p>
        </article>

        <article className="Border p-3 sm:p-4 rounded-lg bg-white/[0.02] border border-white/10">
          <div className="flex justify-between items-center text-white/70">
            <span className="text-xs sm:text-sm font-medium">Workers</span>
            <MdBadge className="text-xl sm:text-2xl text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 my-1 sm:my-2">
            {stats.workerCount}
          </div>
          <p className="text-white/50 text-[10px] sm:text-xs">Ticket & scanner staff</p>
        </article>

        <article className="Border p-3 sm:p-4 rounded-lg bg-white/[0.02] border border-white/10">
          <div className="flex justify-between items-center text-white/70">
            <span className="text-xs sm:text-sm font-medium">Admins</span>
            <MdShield className="text-xl sm:text-2xl text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 my-1 sm:my-2">
            {stats.adminCount}
          </div>
          <p className="text-white/50 text-[10px] sm:text-xs">Full system control</p>
        </article>
      </section>

      {/* Filters and Search Bar */}
      <section className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] p-4 rounded-lg border border-white/10">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[280px] max-w-md relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full bg-white/5 border border-white/15 rounded-md pl-10 pr-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-cyan-400"
          />
        </form>

        <div className="flex items-center gap-3">
          <label className="text-xs text-white/60">Filter Role:</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#18181B] border border-white/15 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Roles ({stats.totalUsers})</option>
            <option value="normal">Clients ({stats.clientCount})</option>
            <option value="worker">Workers ({stats.workerCount})</option>
            <option value="admin">Admins ({stats.adminCount})</option>
          </select>
        </div>
      </section>

      {/* Users Table */}
      <section className="Border p-3 sm:p-4 rounded-lg bg-white/[0.02] border border-white/10 touch-scroll overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10 text-white/50 text-xs uppercase">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Balance</th>
              <th className="py-3 px-4">Joined</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3 px-4 font-medium text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-cyan-400">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-white/90">{user.fullName}</div>
                      <div className="text-white/40 text-[11px]">ID: {user._id.slice(-6)}</div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-white/70">
                    <div>{user.email}</div>
                    <div className="text-white/40">{user.phoneNumber || "No phone"}</div>
                  </td>

                  <td className="py-3 px-4">
                    {editingUserId === user._id ? (
                      <div className="flex items-center gap-1.5">
                        <select
                          defaultValue={user.isAdmin ? "admin" : user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="bg-[#18181B] text-white text-xs border border-cyan-400 rounded px-2 py-1"
                        >
                          <option value="normal">Client</option>
                          <option value="worker">Worker</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="p-1 hover:bg-white/10 rounded"
                          title="Cancel"
                        >
                          <MdClose className="text-white/60" />
                        </button>
                      </div>
                    ) : (
                      <span
                        onClick={() => setEditingUserId(user._id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium cursor-pointer hover:opacity-80 transition ${
                          user.isAdmin || user.role === "admin"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : user.role === "worker"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                        title="Click to change role"
                      >
                        {user.isAdmin || user.role === "admin" ? (
                          <>
                            <MdShield className="text-xs" /> Admin
                          </>
                        ) : user.role === "worker" ? (
                          <>
                            <MdBadge className="text-xs" /> Worker
                          </>
                        ) : (
                          <>
                            <MdPerson className="text-xs" /> Client
                          </>
                        )}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono font-semibold text-emerald-400">
                    {user.balance.toLocaleString()} DZD
                  </td>

                  <td className="py-3 px-4 text-white/50">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(user._id, user.fullName)}
                      title="Delete User"
                      className="p-1.5 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition"
                    >
                      <MdDeleteOutline className="text-base" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-white/40">
                  {loading ? "Loading users..." : "No users found matching your criteria."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#18181B] border border-white/20 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                <MdPersonAdd className="text-emerald-400 text-xl" />
                Add New User
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/40 hover:text-white transition p-1"
              >
                <MdClose className="text-xl" />
              </button>
            </div>

            {addError && (
              <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs rounded-md">
                {addError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/70 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  placeholder="e.g. Youcef Hamidi"
                  className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newUser.phoneNumber}
                  onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                  placeholder="e.g. 0550123456"
                  className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full bg-[#27272A] border border-white/15 rounded-md px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="normal">Client</option>
                    <option value="worker">Station Worker</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1">Initial Balance (DZD)</label>
                  <input
                    type="number"
                    min="0"
                    value={newUser.balance}
                    onChange={(e) => setNewUser({ ...newUser, balance: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 font-semibold text-white transition disabled:opacity-50"
                >
                  {addLoading ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default UserManagement;
