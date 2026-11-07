import { Outlet, useNavigate, useParams } from "react-router-dom";
import StartScan from "../../components/content/StartScan";
import { useGetClient } from "../../hooks/useSign";
import moment from "moment";
function Controle() {
  return (
    <main className="max-w-7xl w-11/12  px-4 my-4 py-2 mx-auto grid grid-rows-[auto_1fr]">
      <aside>
        <h1 className="text-3xl font-bold mb-5">Controle Client</h1>
        <h2 className="text-textSec mb-4">
          Scan a client's QR,then choose an action and amount
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

export const ControleClientInfo = () => {
  const { _id } = useParams();
  const { client } = useGetClient(_id);
  return (
    <main className="grid h-full md:grid-cols-[auto_1fr] gap-6">
      <article className="card md:w-80 w-full items-start space-y-2 grid grid-cols-2 gap-y-3 [&_h3]:line-clamp-1 [&_h3]:justify-self-end [&_h2]:text-black/60">
        <h1 className="tracking-wide font-medium text-lg !mb-4 col-span-2">
          Client Informations
        </h1>

        <h2>Full Name : </h2>
        <h3>{client.fullName}</h3>
        <h2>Email : </h2>
        <h3>{client.email}</h3>
        <h2>Phone Number : </h2>
        <h3>{client.phoneNumber}</h3>
        <h2>Balance : </h2>
        <h3
          className="font-medium"
          style={{ color: (client.balance || 0) > 0 ? "green" : "red" }}
        >
          {client.balance} <span className="text-xs">dzd</span>
        </h3>
        <h2>Role : </h2>
        <h3>{client.role}</h3>
        <h2>Account Created : </h2>
        <h3>{moment(client.createdAt).fromNow()}</h3>
      </article>

      <article className="card">
        <h1 className="tracking-wide font-medium text-lg !mb-4 col-span-2">
          Client Transaction History
        </h1>
        <table>
          <thead>
            <tr>
              <th></th>
            </tr>
          </thead>
        </table>
      </article>
    </main>
  );
};

export default Controle;
