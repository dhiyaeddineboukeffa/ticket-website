import {
  MdBarChart,
  MdCreditCard,
  MdCurrencyExchange,
  MdDashboard,
  MdGroup,
  MdClose,
  MdArrowBack,
} from "react-icons/md";
import { NavLink, Link } from "react-router-dom";

interface AdminSidebarProps {
  onClose?: () => void;
}

function AdminSidebar({ onClose }: AdminSidebarProps) {
  return (
    <nav className="h-full w-full bg-[#18181B] flex flex-col justify-between p-3">
      <div>
        <header className="flex items-center justify-between my-2 pb-3 border-b border-white/10">
          <div className="flex gap-2 text-xl font-bold items-center text-white">
            <MdBarChart className="text-3xl text-cyan-400" />
            <span>Admin Panel</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 active:scale-95 transition"
              aria-label="Close Sidebar"
            >
              <MdClose className="text-xl" />
            </button>
          )}
        </header>

        <aside className="mt-4 space-y-1.5">
          {[
            { icon: <MdDashboard className="text-lg" />, text: "Dashboard", link: "/admin" },
            { icon: <MdGroup className="text-lg" />, text: "User Management", link: "/admin/users" },
            {
              icon: <MdCreditCard className="text-lg" />,
              text: "Client Credits",
              link: "/admin/credits",
            },
            {
              icon: <MdCurrencyExchange className="text-lg" />,
              text: "All Transactions",
              link: "/admin/transactions",
            },
          ].map((nav) => (
            <NavLink
              key={nav.link}
              to={nav.link}
              end={nav.link === "/admin"}
              onClick={onClose}
              className={({ isActive }) =>
                `py-2.5 px-3 rounded-lg flex items-center font-medium tracking-wide duration-150 text-white gap-3 transition min-h-[44px] active:scale-[0.98] ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {nav.icon}
              <span className="text-sm">{nav.text}</span>
            </NavLink>
          ))}
        </aside>
      </div>

      <div className="pt-4 border-t border-white/10">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-2 py-2.5 px-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 text-xs transition"
        >
          <MdArrowBack /> Return to Passenger Portal
        </Link>
      </div>
    </nav>
  );
}

export default AdminSidebar;
