import { BsCreditCard } from "react-icons/bs";
import { MdLogout, MdHistory, MdPerson, MdDashboard, MdQrCodeScanner } from "react-icons/md";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { profileSlice } from "../../store/signSlice";
import { useLogout } from "../../hooks/useSign";

function Navbar() {
  const { profile } = profileSlice();
  const { logout } = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      localStorage.clear();
    }
    navigate("/login");
  };

  const isAuth = Boolean(localStorage.getItem("auth"));

  return (
    <header className="h-16 border-b-2 border-sec border-opacity-30 w-full bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-xs">
      <article className="flex justify-between items-center h-full max-w-7xl mx-auto w-11/12">
        {/* Brand */}
        <Link
          to="/"
          className="flex gap-2 items-center text-2xl text-textPri font-bold tracking-wide hover:opacity-90 transition"
        >
          <BsCreditCard className="text-sec text-2xl" />
          <span>TramCreditAlgeria</span>
        </Link>

        {/* Nav Links for Authenticated Client */}
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

            {(profile.role === "worker" || profile.role === "admin" || profile.isAdmin) && (
              <NavLink
                to="/worker"
                className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 hover:bg-emerald-100 transition"
              >
                <MdQrCodeScanner className="text-sm" /> Worker
              </NavLink>
            )}

            {(profile.isAdmin || profile.role === "admin") && (
              <NavLink
                to="/admin"
                className="flex items-center gap-1 text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200 hover:bg-purple-100 transition"
              >
                <MdDashboard className="text-sm" /> Admin
              </NavLink>
            )}
          </nav>
        )}

        {/* User Badge / Login / Logout */}
        <div className="flex items-center gap-3">
          {isAuth ? (
            <div className="flex items-center gap-3">
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
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-md transition duration-200 font-medium"
              >
                <MdLogout className="text-sm" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
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
    </header>
  );
}

export default Navbar;
