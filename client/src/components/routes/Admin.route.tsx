import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import AdminSidebar from "../layout/AdminSidebar";
import AdminNavbar from "../layout/AdminNavbar";
import { profileSlice } from "../../store/signSlice";
import { useGetProfile } from "../../hooks/useSign";
import { MdLock, MdHome, MdLogin } from "react-icons/md";

function AdminRoutes() {
  const navigate = useNavigate();
  const { profile } = profileSlice();
  const { loading } = useGetProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = "#09090B";

    const authId = localStorage.getItem("auth");
    if (!authId) {
      navigate("/login");
    }

    return () => {
      document.body.style.backgroundColor = "transparent";
    };
  }, [navigate]);

  const authId = localStorage.getItem("auth");
  if (!authId) {
    return null;
  }

  // Loading state while verifying user credentials
  if (loading && !profile._id) {
    return (
      <main className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-white gap-3">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-white/60 text-sm font-medium">Verifying Admin Permissions...</p>
      </main>
    );
  }

  // Access Denied: User is authenticated but does not possess admin role
  const isAdmin = Boolean(profile.isAdmin || profile.role === "admin");
  if (profile._id && !isAdmin) {
    return (
      <main className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-white p-4">
        <div className="bg-[#18181B] border border-rose-500/30 rounded-2xl max-w-md w-full p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-rose-400 text-3xl">
            <MdLock />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-white/60 text-sm mb-6">
            Your account (<span className="text-white font-medium">{profile.email}</span>) does not have administrator privileges.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition"
            >
              <MdHome className="text-lg" /> Return to Home
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition"
            >
              <MdLogin className="text-lg" /> Log In as Admin
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090B] flex flex-col text-white/90">
      <AdminNavbar onToggleMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

      <div className="flex flex-1 relative w-full overflow-x-hidden">
        {/* Desktop Sidebar (Permanent) */}
        <aside className="hidden md:block w-56 shrink-0 bg-[#18181B] border-r border-white/10 min-h-[calc(100vh-64px)]">
          <AdminSidebar />
        </aside>

        {/* Mobile Slide-Over Drawer with Backdrop */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-black/70 backdrop-blur-xs flex animate-in fade-in duration-200">
            <div className="w-64 max-w-[80vw] bg-[#18181B] h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-250">
              <AdminSidebar onClose={() => setMobileMenuOpen(false)} />
            </div>
            <div
              className="flex-1 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            />
          </div>
        )}

        {/* Content Viewport (Full width on mobile) */}
        <section
          className="flex-1 w-full min-w-0 p-3 sm:p-6 overflow-x-hidden 
          [&_.Border]:border [&_.Border]:border-white/10 [&_.Border]:rounded-lg
          [&_h3]:font-bold [&_h3]:text-xl sm:[&_h3]:text-2xl
          [&_h4]:text-white/60 [&_h4]:text-xs sm:[&_h4]:text-sm"
        >
          <Outlet />
        </section>
      </div>
    </main>
  );
}

export default AdminRoutes;
