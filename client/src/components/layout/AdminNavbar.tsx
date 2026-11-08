import { BsCreditCard } from "react-icons/bs";
import { MdLogout, MdShield, MdMenu } from "react-icons/md";
import { profileSlice } from "../../store/signSlice";
import { useLogout } from "../../hooks/useSign";
import { useNavigate, Link } from "react-router-dom";

interface AdminNavbarProps {
  onToggleMenu?: () => void;
}

function AdminNavbar({ onToggleMenu }: AdminNavbarProps) {
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

  return (
    <header className="h-16 border-b border-white/10 w-full top-0 bg-[#09090B] sticky z-30">
      <article className="flex justify-between items-center h-full mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Menu Button */}
          {onToggleMenu && (
            <button
              onClick={onToggleMenu}
              className="md:hidden p-2 -ml-2 rounded-lg bg-white/5 text-white hover:bg-white/15 active:scale-95 transition flex items-center justify-center border border-white/10"
              aria-label="Toggle Navigation Drawer"
            >
              <MdMenu className="text-xl" />
            </button>
          )}

          <Link
            to="/admin"
            className="flex gap-2 items-center text-lg sm:text-xl text-white font-bold tracking-wide"
          >
            <BsCreditCard className="text-cyan-400 text-xl" />
            <span className="hidden xs:inline">TramCreditAlgeria</span>
            <span className="inline-flex sm:hidden font-mono text-xs text-cyan-400">Admin</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
              <MdShield className="text-xs" /> Control Panel
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {profile._id ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-semibold text-white">
                  {profile.fullName || "Administrator"}
                </span>
                <span className="text-[10px] text-white/50">{profile.email}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold flex items-center justify-center text-xs">
                {(profile.fullName || "A").charAt(0).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs bg-white/10 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30 border border-white/20 rounded-md transition duration-200 text-white/90 active:scale-95 font-medium"
              >
                <MdLogout className="text-sm" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-3.5 py-1.5 rounded-md text-white hover:text-black hover:bg-white border border-white text-xs font-medium transition"
            >
              Login
            </button>
          )}
        </div>
      </article>
    </header>
  );
}

export default AdminNavbar;
