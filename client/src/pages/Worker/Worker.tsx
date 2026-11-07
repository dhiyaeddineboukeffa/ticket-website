import { LuBadgeDollarSign, LuScanSearch } from "react-icons/lu";
import { MdQrCode2 } from "react-icons/md";
import { Link } from "react-router-dom";

function Worker() {
  return (
    <main className="my-6 px-4 max-w-7xl w-11/12 mx-auto ">
      <h1 className="md:text-3xl text-xl font-bold   mb-6">Worker Dashboard</h1>

      <section className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
        {[
          {
            title: "Controle Client",
            icon: <LuScanSearch />,
            text: "Scan a clien't QR code to view their information and last ticket status ",
            button: "Go To Controle",
            to: "contole",
          },
          {
            title: "Redeem Ticket",
            icon: <MdQrCode2 />,
            text: "Scan a clien't QR code to redeem a ticket from thei credit balance  ",
            button: "Go To Redeem",
            to: "redeem",
          },
          {
            title: "Add Sales / Credit",
            icon: <LuBadgeDollarSign />,
            text: "Scan a clien't QR code to add credit to their account or correct a previous transaction ",
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
