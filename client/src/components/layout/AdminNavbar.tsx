import { BsCreditCard } from "react-icons/bs";
import { MdLogout, MdShield } from "react-icons/md";
import { profileSlice } from "../../store/signSlice";
import { useLogout } from "../../hooks/useSign";
import { useNavigate } from "react-router-dom";

function AdminNavbar() {
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
    <header className="h-16 border-b-2 border-white/10 border-opacity-40 w-full top-0 bg-[#09090B]">
      <article className="flex justify-between items-center h-full mx-auto w-11/12">
        <aside className="flex gap-2 items-center md:text-2xl text-lg text-white font-bold tracking-wide">
          <BsCreditCard className="text-cyan-400" />
          <span>TramCreditAlgeria</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
            <MdShield className="text-xs" /> Control Panel
          </span>
        </aside>

        <div className="flex items-center gap-4">
          {profile._id ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-semibold text-white">
                  {profile.fullName || "Admin"}
                </span>
                <span className="text-[10px] text-white/50">{profile.email}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold flex items-center justify-center text-xs">
                {(profile.fullName || "A").charAt(0).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/10 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30 border border-white/20 rounded-md transition duration-200 text-white/90"
              >
                <MdLogout className="text-sm" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-1.5 rounded-md text-white hover:text-black hover:bg-white border border-white text-xs font-medium transition"
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
