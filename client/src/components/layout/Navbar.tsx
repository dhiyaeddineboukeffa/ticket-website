import { useState } from "react";
import { BsCreditCard } from "react-icons/bs";
import {
  MdLogout,
  MdHistory,
  MdPerson,
  MdDashboard,
  MdQrCodeScanner,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { profileSlice } from "../../store/signSlice";
import { useLogout } from "../../hooks/useSign";

function Navbar() {
  const { profile } = profileSlice();
  const { logout } = useLogout();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    setMobileOpen(false);
    try {
      await logout();
    } catch {
      localStorage.clear();
    }
    navigate("/login");
  };

  const isAuth = Boolean(localStorage.getItem("auth"));
  const isAdmin = Boolean(profile.isAdmin || profile.role === "admin");
  const isWorker = profile.role === "worker" || isAdmin;

  return (
    <header className="border-b-2 border-sec border-opacity-30 w-full bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-xs">
      <article className="flex justify-between items-center h-16 max-w-7xl mx-auto w-11/12">
        {/* Brand */}
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex gap-2 items-center text-xl sm:text-2xl text-textPri font-bold tracking-wide hover:opacity-90 transition"
        >
          <BsCreditCard className="text-sec text-2xl" />
          <span>TramCreditAlgeria</span>
        </Link>

        {/* Nav Links for Authenticated Client (Desktop) */}
        {isAuth && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-textPri/70">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-sec transition-colors ${isActive ? "text-sec font-bold" : ""}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/TransactionHistory"
              className={({ isActive }) =>
                `flex items-center gap-1 hover:text-sec transition-colors ${
                  isActive ? "text-sec font-bold" : ""
                }`
              }
            >
              <MdHistory className="text-base" /> Transactions
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-1 hover:text-sec transition-colors ${
                  isActive ? "text-sec font-bold" : ""
                }`
              }
            >
              <MdPerson className="text-base" /> Profile
            </NavLink>

            {isWorker && (
              <NavLink
                to="/worker"
                className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 hover:bg-emerald-100 transition"
              >
                <MdQrCodeScanner className="text-sm" /> Worker Station
              </NavLink>
            )}

            {isAdmin && (
              <NavLink
                to="/admin"
                className="flex items-center gap-1 text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200 hover:bg-purple-100 transition"
              >
                <MdDashboard className="text-sm" /> Admin Panel
              </NavLink>
            )}
          </nav>
        )}

        {/* User Badge / Login / Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuth ? (
            <>
              {profile.balance !== undefined && (
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-[11px] uppercase tracking-wider text-textPri/50 font-medium">Balance</span>
                  <span className="text-xs font-bold text-sec">
                    {profile.balance.toLocaleString()} DZD
                  </span>
                </div>
              )}

              <Link
                to="/profile"
                className="w-8 h-8 rounded-full bg-sec/10 text-sec font-bold flex items-center justify-center text-xs border border-sec/30 hover:bg-sec/20 transition"
                title={profile.fullName || "User Profile"}
              >
                {(profile.fullName || "U").charAt(0).toUpperCase()}
              </Link>

              <button
                onClick={handleLogout}
                title="Log Out"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-md transition duration-200 font-medium"
              >
                <MdLogout className="text-sm" />
                <span>Logout</span>
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 active:scale-95 transition"
                aria-label="Toggle Menu"
              >
                {mobileOpen ? <MdClose className="text-xl" /> : <MdMenu className="text-xl" />}
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="button bg-sec px-5 py-1.5 rounded-md text-white hover:text-sec hover:bg-transparent border border-sec font-medium text-sm transition"
            >
              Login
            </Link>
          )}
        </div>
      </article>

      {/* Mobile Collapsible Navigation Menu */}
      {isAuth && mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2 animate-in fade-in duration-200 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 text-xs">
            <span className="font-semibold text-gray-700">{profile.fullName || "User Account"}</span>
            {profile.balance !== undefined && (
              <span className="font-bold text-sec">{profile.balance.toLocaleString()} DZD</span>
            )}
          </div>

          <div className="grid gap-1 pt-1">
            <NavLink
              to="/"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? "bg-sec/10 text-sec font-bold" : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              Home (Ticket)
            </NavLink>
            <NavLink
              to="/TransactionHistory"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? "bg-sec/10 text-sec font-bold" : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <MdHistory className="text-base" /> Transactions
            </NavLink>
            <NavLink
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? "bg-sec/10 text-sec font-bold" : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <MdPerson className="text-base" /> Profile
            </NavLink>

            {isWorker && (
              <NavLink
                to="/worker"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-200"
              >
                <MdQrCodeScanner className="text-base text-emerald-600" /> Worker Station
              </NavLink>
            )}

            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-purple-800 bg-purple-50 border border-purple-200"
              >
                <MdDashboard className="text-base text-purple-600" /> Admin Dashboard
              </NavLink>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 mt-1 border-t border-gray-100"
            >
              <MdLogout className="text-base" /> Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
