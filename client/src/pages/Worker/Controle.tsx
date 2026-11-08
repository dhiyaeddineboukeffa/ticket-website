import { Outlet, useNavigate, useParams, Link } from "react-router-dom";
import StartScan from "../../components/content/StartScan";
import { useGetClient } from "../../hooks/useSign";
import moment from "moment";
import { useEffect, useState } from "react";
import axios from "axios";
import { MdReceiptLong, MdArrowBack, MdCheckCircle, MdCancel } from "react-icons/md";

function Controle() {
  return (
    <main className="max-w-7xl w-11/12 px-4 my-4 py-2 mx-auto grid grid-rows-[auto_1fr]">
      <aside className="mb-4">
        <h1 className="text-3xl font-bold mb-2">Control Client</h1>
        <h2 className="text-textSec text-sm">
          Scan a client's QR code to inspect identity, balance, and validation history
        </h2>
      </aside>

      <Outlet />
    </main>
  );
}

export const ControleScanner = () => {
  const navigate = useNavigate();

  return (
    <StartScan
      handler={(result: any) => {
        navigate(result);
      }}
    />
  );
};

interface ClientTx {
  _id: string;
  balance: number;
  createdAt: string;
}

export const ControleClientInfo = () => {
  const { _id } = useParams();
  const { client } = useGetClient(_id);
  const [transactions, setTransactions] = useState<ClientTx[]>([]);
  const [loadingTx, setLoadingTx] = useState<boolean>(true);

  useEffect(() => {
    if (_id) {
      setLoadingTx(true);
      axios
        .get<ClientTx[]>(`/api/transaction/pay/${_id}`)
        .then((res) => {
          setTransactions(Array.isArray(res.data) ? res.data : []);
        })
        .catch(() => {
          setTransactions([]);
        })
        .finally(() => {
          setLoadingTx(false);
        });
    }
  }, [_id]);

  const hasValidBalance = (client.balance || 0) >= 40;

  return (
    <main className="grid h-full md:grid-cols-[auto_1fr] gap-6">
      <article className="card md:w-80 w-full items-start space-y-2 grid grid-cols-2 gap-y-3 [&_h3]:line-clamp-1 [&_h3]:justify-self-end [&_h2]:text-black/60 shadow-xs">
        <div className="col-span-2 flex items-center justify-between border-b pb-2 mb-2">
          <h1 className="tracking-wide font-bold text-lg">
            Client Information
          </h1>
          <Link
            to="/worker/contole"
            className="text-xs text-sec hover:underline flex items-center gap-1"
          >
            <MdArrowBack /> Rescan
          </Link>
        </div>

        <h2>Full Name:</h2>
        <h3 className="font-semibold">{client.fullName || "Loading..."}</h3>
        <h2>Email:</h2>
        <h3 className="text-xs">{client.email || "N/A"}</h3>
        <h2>Phone:</h2>
        <h3>{client.phoneNumber || "N/A"}</h3>
        <h2>Balance:</h2>
        <h3
          className="font-bold text-base"
          style={{ color: hasValidBalance ? "green" : "red" }}
        >
          {client.balance !== undefined ? `${client.balance} DZD` : "0 DZD"}
        </h3>
        <h2>Status:</h2>
        <h3 className="flex items-center gap-1 font-semibold text-xs">
          {hasValidBalance ? (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
              <MdCheckCircle /> Valid Fare
            </span>
          ) : (
            <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1">
              <MdCancel /> Low Balance
            </span>
          )}
        </h3>
        <h2>Account Role:</h2>
        <h3 className="capitalize font-medium">{client.role || "Client"}</h3>
        <h2>Member Since:</h2>
        <h3 className="text-xs">{moment(client.createdAt).fromNow()}</h3>
      </article>

      {/* Transaction History Card */}
      <article className="card shadow-xs flex flex-col">
        <h1 className="tracking-wide font-bold text-lg mb-3 flex items-center gap-2 border-b pb-2">
          <MdReceiptLong className="text-sec" /> Client Transaction History
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b text-xs text-textPri/60 uppercase">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono text-xs">
              {loadingTx ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-400">
                    <div className="loader w-6 h-6 !border-sec !border-2 mx-auto" />
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-black/[0.02]">
                    <td className="py-2 px-3">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 px-3">
                      {tx.balance > 0 ? (
                        <span className="text-emerald-600 font-sans font-medium">Recharge</span>
                      ) : (
                        <span className="text-rose-600 font-sans font-medium">Ticket Ride</span>
                      )}
                    </td>
                    <td
                      className={`py-2 px-3 text-right font-bold ${
                        tx.balance > 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {tx.balance > 0 ? "+" : ""}
                      {tx.balance} DZD
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-textPri/40">
                    No transactions recorded for this client.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
    </main>
  );
};

export default Controle;
