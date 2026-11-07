import {
  MdAutorenew,
  MdHistory,
  MdOutlineFileDownload,
  MdQrCode,
  MdWifi,
} from "react-icons/md";
import { BsCreditCard } from "react-icons/bs";
import { Link } from "react-router-dom";
import { profileSlice } from "../../store/signSlice";
import QRCode from "react-qr-code";
import { useDownloadPng } from "../../utils/hooks";
import { useState } from "react";

function Home() {
  const { profile } = profileSlice();
  const [blur, setBlur] = useState<boolean>(true);
  const { onClick, ref } = useDownloadPng(`Qr ${profile._id}`);

  return (
    <main className="h-full max-w-6xl w-full mx-auto py-6 px-4 ">
      <header className="flex justify-between gap-4 h-fit mb-6">
        <h1 className="md:text-3xl text-xl font-bold   ">
          Welcom {profile.fullName}
        </h1>
        <aside className="flex gap-2 items-center opacity-80 ">
          <MdWifi className="text-green-600 text-lg" />{" "}
          <div className="w-px h-[60%] bg-textPri" />{" "}
          <p className="line-clamp-2 break-all">Last synced: 5min ago</p>
        </aside>
      </header>

      <section
        className="grid md:grid-cols-2 gap-6 
      "
      >
        <article className="w-full card    grid grid-rows-[auto_auto_1fr]  space-y-2">
          <aside className="flex justify-between ">
            <h1>Current Credit</h1>
            <BsCreditCard className="text-sec text-xl" />
          </aside>

          <h1 className="md:text-4xl text-2xl font-bold">
            {profile.balance} DZD
          </h1>

          <p className="text-textPri opacity-60 text-sm font-medium self-end">
            Your Available Balance for tram ticket
          </p>
        </article>

        <article className="w-full card space-y-2 ">
          <aside className="flex justify-between font-medium">
            <h1>Actions</h1>
            <MdQrCode className="text-sec text-xl" />
          </aside>

          <Link
            to="/TransactionHistory"
            className="button w-full py-2 rounded-md bg-pri  text-opacity-60 flex justify-center items-center gap-4"
          >
            <MdHistory className="text-xl" />{" "}
            <p className="line-clamp-1">View Transaction History</p>
          </Link>
          <button className="button w-full py-2 !mt-3 rounded-md bg-sec text-white   flex justify-center items-center gap-4">
            <MdAutorenew className="text-xl" />{" "}
            <p className="line-clamp-1">View Transaction History</p>
          </button>

          {!localStorage.getItem("auth") && (
            <h1 className="">Login to sync real data</h1>
          )}
        </article>
      </section>

      <section className="p-5 card max-w-[420px] w-11/12 relative z-10 mt-6 text-center mx-auto">
        <h1 className="font-bold md:text-2xl text-xl mb-3">
          Your Ticket QR Code
        </h1>
        <h2 className="opacity-70 mb-2">Present This QR Code for scanning</h2>

        <div
          onClick={() => setBlur(!blur)}
          ref={ref}
          className="p-4 cursor-pointer relative grid "
        >
          <QRCode className="mx-auto w-10/12 max-w-64" value={profile._id} />
          <span
            className={`absolute w-10/12 left-1/2 -translate-x-1/2 h-full duration-200 backdrop-blur-[5px] bg-white/5 ${
              blur ? " opacity-100" : "opacity-0"
            }`}
          />
        </div>

        <p className="font-medium mb-4 cursor-pointer mt-2">
          User Id: {blur ? "***************************" : profile._id}
        </p>

        <button
          disabled={!ref || blur}
          onClick={onClick}
          className="button w-full py-2 bg-pri rounded-md flex justify-center items-center gap-3 font-medium"
        >
          <MdOutlineFileDownload className="text-xl" /> Download QR Code
        </button>
      </section>
    </main>
  );
}

export default Home;
