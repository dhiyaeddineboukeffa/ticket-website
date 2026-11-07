import { useState } from "react";
import StartScan from "../../components/content/StartScan";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { useGetClient } from "../../hooks/useSign";
import { profileSlice } from "../../store/signSlice";
import { IoTicketOutline, IoTriangleSharp } from "react-icons/io5";
import Modal from "../../components/common/Modal";
import { MdClose } from "react-icons/md";
import { useCreateTransaction } from "../../hooks/useTransaction";

function AddSales() {
  return (
    <main className="max-w-7xl w-11/12  px-4 my-4 py-2 mx-auto grid grid-rows-[auto_1fr]">
      <aside>
        <h1 className="text-3xl font-bold mb-5">Add Sales / Manage Credit</h1>
        <h2 className="text-textSec mb-4">
          Scan a client's QR,then choose an action and amount
        </h2>
      </aside>

      <Outlet />
    </main>
  );
}

export const Scanner = () => {
  const navigate = useNavigate();

  return (
    <StartScan
      handler={(result: any) => {
        navigate(result);
      }}
    />
  );
};

export const AddBalance = () => {
  const { _id } = useParams();
  const { client, getClient } = useGetClient(_id);

  const { profile } = profileSlice();
  const [ticket, setTicket] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const { createTransaction, loading } = useCreateTransaction();

  const submitHandler = async () => {
    await createTransaction(client._id, ticket * 40);
    await getClient();
    setOpen(false);
    setTicket(0);
  };

  return (
    <main className="grid md:grid-cols-[auto_1fr]  h-full gap-6 ">
      <article className="space-y-4 md:w-96 w-full  h-full grid  [&_h1]:text-xl [&_h1]:font-semibold   [&_h2]:text-black/50 [&_h3]:justify-self-end">
        <aside className=" card space-y-2 h-fit">
          <h1 className="tracking-wide !mb-4">Client Informations</h1>
          <div className="grid grid-cols-2 gap-y-3 [&_h3]:line-clamp-1">
            <h2>Client Id :</h2>
            <h3>{client._id}</h3>
            <h2>Full Name :</h2>
            <h3>{client.fullName}</h3>
            <h2>Email :</h2>
            <h3>{client.email}</h3>
            <h2>Phone Number :</h2>
            <h3>{client.phoneNumber || "N/A"}</h3>
            <h2>Balance :</h2>
            <h3
              className="font-medium"
              style={{ color: (client.balance || 0) < 1 ? "red" : "green" }}
            >
              {client.balance} DZD
            </h3>
          </div>
        </aside>
        <aside className=" card space-y-2 self-end">
          <h1 className="tracking-wide !mb-4">Worker Informations</h1>
          <div className="grid grid-cols-2 gap-y-3 ">
            <h2>Full Name :</h2>
            <h3>{profile.fullName}</h3>
            <h2>Email :</h2>
            <h3>{profile.email}</h3>
            <h2>Phone Number :</h2>
            <h3>{profile.phoneNumber || "N/A"}</h3>
          </div>
        </aside>
      </article>

      <article className="card !p-7 grid select-none ">
        <h1 className="font-bold tracking-wide text-2xl">Add Balance</h1>

        <aside className="grid text-center grid-cols-[auto_auto_1fr] items-center my-4">
          <IoTicketOutline className="md:text-8xl text-4xl" />

          <div className="space-y-2 md:px-12 px-4 md:text-4xl text-2xl">
            <IoTriangleSharp
              onClick={() => setTicket(ticket + 1)}
              className=" cursor-pointer hover:scale-110 duration-200"
            />
            <h1 className="md:text-3xl text-xl pointer-events-none ">
              {ticket}
            </h1>
            <IoTriangleSharp
              onClick={() => ticket !== 0 && setTicket(ticket - 1)}
              className="rotate-180 cursor-pointer hover:scale-110 duration-200"
            />
          </div>

          <div className="flex md:text-4xl text-2xl font-semibold tracking-wide justify-end">
            <h1 className="font-bold">Total: &nbsp; </h1>
            <h2 style={{ color: ticket > 0 ? "green" : "" }}>
              {ticket ? "+" : ""} {ticket * 40} DZD
            </h2>
          </div>
        </aside>
        <aside className="justify-self-end self-end space-x-4 font-semibold md:text-[17px] text-sm">
          <Link
            to="/worker/addsales"
            className="button border border-red-600 text-red-600 py-2 px-8 rounded-md "
          >
            Cancel
          </Link>
          <button
            disabled={loading || !ticket}
            onClick={() => setOpen(true)}
            className="button bg-sec text-white py-2 px-8 rounded-md"
          >
            Submit
          </button>
        </aside>
      </article>

      <Modal onClose={setOpen} open={open}>
        <section className="w-[95vw] card relative max-w-[450px] bg-white rounded-md border border-black/20 ">
          <div
            onClick={() => setOpen(false)}
            className="absolute w-7 right-3 top-3 text-red-600 text-opacity-60 hover:scale-105 duration-200 hover:text-opacity-100 aspect-square rounded-full bg-black/10 grid place-content-center cursor-pointer"
          >
            <MdClose className="text-lg " />
          </div>
          <h1 className="-translate-y-1 font-semibold text-lg">
            Are you sure?
          </h1>
          <h2 className="text-sm text-black/60 mt-1">
            Are you sure you want to add balance to this user
          </h2>
          <aside className="flex justify-end mt-3 gap-3">
            <button
              onClick={() => setOpen(false)}
              className="button border border-red-600 text-red-600 py-1.5 px-6 text-sm rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={submitHandler}
              className="button border border-sec text-white bg-sec py-1.5 w-28 grid place-content-center text-sm rounded-md"
            >
              {loading ? (
                <div className="loader w-5 h-5 !border-2" />
              ) : (
                "Yes' I'm sure"
              )}
            </button>
          </aside>
        </section>
      </Modal>
    </main>
  );
};

export default AddSales;
