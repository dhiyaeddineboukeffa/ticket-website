import { LuBadgeDollarSign, LuScanSearch } from "react-icons/lu";
import { MdQrCode2, MdShield } from "react-icons/md";
import { Link } from "react-router-dom";
import { profileSlice } from "../../store/signSlice";

function Worker() {
  const { profile } = profileSlice();
  const isAdmin = Boolean(profile.isAdmin || profile.role === "admin");

  return (
    <main className="my-6 px-4 max-w-7xl w-11/12 mx-auto ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="md:text-3xl text-xl font-bold">Worker Dashboard</h1>
          <p className="text-xs sm:text-sm text-textSec mt-0.5">
            Ticket scanning, balance recharging, and passenger validation station
          </p>
        </div>
        {isAdmin && (
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#09090B] text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-semibold hover:bg-white/10 transition shadow-sm active:scale-95 w-fit"
          >
            <MdShield className="text-base text-purple-400" />
            <span>Return to Admin Panel</span>
          </Link>
        )}
      </div>

      <section className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
        {[
          {
            title: "Control Client",
            icon: <LuScanSearch />,
            text: "Scan a client's QR code to view their information and last ticket status",
            button: "Go To Control",
            to: "contole",
          },
          {
            title: "Redeem Ticket",
            icon: <MdQrCode2 />,
            text: "Scan a client's QR code to redeem a ticket from their credit balance",
            button: "Go To Redeem",
            to: "redeem",
          },
          {
            title: "Add Sales / Credit",
            icon: <LuBadgeDollarSign />,
            text: "Scan a client's QR code to add credit to their account or correct a previous transaction",
            button: "Go To Add Sales",
            to: "addsales",
          },
        ].map((nav) => (
          <WorkerNav key={nav.title} {...nav} />
        ))}
      </section>
    </main>
  );
}

const WorkerNav = ({
  title,
  icon,
  text,
  to,
  button,
}: {
  title: string;
  icon: React.ReactElement;
  text: string;
  to: string;
  button: string;
}) => (
  <article className="grid card w-full grid-rows-[1fr_auto]">
    <aside className="space-y-2 mb-6">
      <div className="text-sec text-4xl">{icon}</div>
      <h1 className="text-2xl font-bold">{title}</h1>

      <p className="text-sm text-textSec">{text}</p>
    </aside>

    <Link
      to={to}
      className="button py-2 self-end w-full text-center  text-white font-medium bg-sec rounded-md"
    >
      {button}
    </Link>
  </article>
);

export default Worker;
