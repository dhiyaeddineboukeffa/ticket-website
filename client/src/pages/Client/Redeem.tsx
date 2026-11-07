import StartScan from "../../components/content/StartScan";

function Redeem() {
  const handler = () => {};

  return (
    <main className="max-w-7xl px-2 w-11/12 py-4 mx-auto">
      <h1 className="text-3xl font-bold mb-5">Redeem Ticket</h1>
      <h2 className="text-textSec">
        Scan a client's QR Code to redeem on ticket (40 dzd).
      </h2>

      <StartScan handler={handler} />
    </main>
  );
}

export default Redeem;
