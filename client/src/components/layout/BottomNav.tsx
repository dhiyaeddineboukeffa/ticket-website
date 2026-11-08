import { NavLink } from "react-router-dom";
import { MdQrCode2, MdReceiptLong, MdPerson, MdDashboard, MdSensors } from "react-icons/md";
import { profileSlice } from "../../store/signSlice";

function BottomNav() {
  const { profile } = profileSlice();
  const isAuth = Boolean(localStorage.getItem("auth"));

  if (!isAuth) return null;

  const isAdmin = Boolean(profile.isAdmin || profile.role === "admin");
  const isWorker = profile.role === "worker";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-safe">
      <div className="grid grid-flow-col auto-cols-fr items-center px-1 py-1 max-w-lg mx-auto">
        {/* Ticket / Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-all duration-150 active:scale-95 ${
              isActive
                ? "text-sec font-bold"
                : "text-gray-500 hover:text-gray-800 font-medium"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1 rounded-full ${isActive ? "bg-sec/10" : ""}`}>
                <MdQrCode2 className="text-xl" />
              </div>
              <span className="text-[10px] mt-0.5 leading-none">Ticket</span>
            </>
          )}
        </NavLink>

        {/* Transactions */}
        <NavLink
          to="/TransactionHistory"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-all duration-150 active:scale-95 ${
              isActive
                ? "text-sec font-bold"
                : "text-gray-500 hover:text-gray-800 font-medium"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1 rounded-full ${isActive ? "bg-sec/10" : ""}`}>
                <MdReceiptLong className="text-xl" />
              </div>
              <span className="text-[10px] mt-0.5 leading-none">History</span>
            </>
          )}
        </NavLink>

        {/* Profile */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-all duration-150 active:scale-95 ${
              isActive
                ? "text-sec font-bold"
                : "text-gray-500 hover:text-gray-800 font-medium"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1 rounded-full ${isActive ? "bg-sec/10" : ""}`}>
                <MdPerson className="text-xl" />
              </div>
              <span className="text-[10px] mt-0.5 leading-none">Profile</span>
            </>
          )}
        </NavLink>

        {/* Staff Hub: Admin or Worker */}
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-all duration-150 active:scale-95 ${
                isActive
                  ? "text-purple-600 font-bold"
                  : "text-purple-600/70 hover:text-purple-700 font-medium"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-full ${isActive ? "bg-purple-100" : ""}`}>
                  <MdDashboard className="text-xl" />
                </div>
                <span className="text-[10px] mt-0.5 leading-none">Admin</span>
              </>
            )}
          </NavLink>
        )}

        {!isAdmin && isWorker && (
          <NavLink
            to="/worker"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-all duration-150 active:scale-95 ${
                isActive
                  ? "text-emerald-600 font-bold"
                  : "text-emerald-600/70 hover:text-emerald-700 font-medium"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-full ${isActive ? "bg-emerald-100" : ""}`}>
                  <MdSensors className="text-xl" />
                </div>
                <span className="text-[10px] mt-0.5 leading-none">Worker</span>
              </>
            )}
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default BottomNav;
