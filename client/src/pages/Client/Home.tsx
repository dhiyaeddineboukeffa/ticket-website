import {
  MdAutorenew,
  MdHistory,
  MdOutlineFileDownload,
  MdQrCode,
  MdWifi,
  MdVisibility,
} from "react-icons/md";
import { BsCreditCard } from "react-icons/bs";
import { Link } from "react-router-dom";
import { profileSlice } from "../../store/signSlice";
import QRCode from "react-qr-code";
import { useDownloadPng } from "../../utils/hooks";
import { useState } from "react";
import { useGetProfile } from "../../hooks/useSign";

function Home() {
  const { profile } = profileSlice();
  const [blur, setBlur] = useState<boolean>(true);
  const { onClick, ref } = useDownloadPng(`Qr ${profile._id}`);
  const { Get: refreshProfile, loading: refreshing } = useGetProfile(false);

  return (
    <main className="h-full max-w-6xl w-full mx-auto py-4 px-3 sm:py-6 sm:px-4">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
        <h1 className="md:text-3xl text-xl sm:text-2xl font-bold">
          Welcome, {profile.fullName || "Valued Passenger"}
        </h1>
        <aside className="flex gap-2 items-center opacity-80 text-xs sm:text-sm">
          <MdWifi className="text-green-600 text-base sm:text-lg" />
          <div className="w-px h-3.5 bg-textPri" />
          <p className="line-clamp-1">MongoDB Cloud: Synced</p>
        </aside>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Credit Card */}
        <article className="w-full card grid grid-rows-[auto_auto_1fr] space-y-2">
          <aside className="flex justify-between items-center">
            <h1 className="font-semibold text-textPri/80 text-sm sm:text-base">Current Credit</h1>
            <BsCreditCard className="text-sec text-2xl" />
          </aside>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-sec my-1">
            {(profile.balance || 0).toLocaleString()} DZD
          </h1>

          <p className="text-textPri opacity-60 text-xs sm:text-sm font-medium self-end">
            Available balance for tram tickets (40 DZD per ride)
          </p>
        </article>

        {/* Quick Actions */}
        <article className="w-full card space-y-3">
          <aside className="flex justify-between font-medium items-center">
            <h1 className="font-semibold text-textPri/80 text-sm sm:text-base">Quick Actions</h1>
            <MdQrCode className="text-sec text-2xl" />
          </aside>

          <Link
            to="/TransactionHistory"
            className="button w-full min-h-[46px] py-2.5 rounded-md bg-pri hover:bg-pri/80 text-textPri font-medium flex justify-center items-center gap-2 transition"
          >
            <MdHistory className="text-xl" />
            <span>View Transaction History</span>
          </Link>

          <button
            onClick={() => refreshProfile()}
            disabled={refreshing}
            className="button w-full min-h-[46px] py-2.5 rounded-md bg-sec hover:bg-sec/90 text-white font-medium flex justify-center items-center gap-2 transition"
          >
            <MdAutorenew className={`text-xl ${refreshing ? "animate-spin" : ""}`} />
            <span>{refreshing ? "Refreshing Balance..." : "Refresh Balance & Sync"}</span>
          </button>
        </article>
      </section>

      {/* Ticket QR Code Card */}
      <section className="p-4 sm:p-6 card max-w-[420px] w-full relative z-10 mt-4 sm:mt-6 text-center mx-auto shadow-md">
        <h1 className="font-bold md:text-2xl text-xl mb-1">
          Your Ticket QR Code
        </h1>
        <h2 className="opacity-70 text-xs sm:text-sm mb-4">
          Present this QR code to the station scanner or inspector
        </h2>

        <div
          onClick={() => setBlur(!blur)}
          ref={ref}
          className="p-4 cursor-pointer relative grid rounded-lg bg-gray-50 border border-gray-200"
          title="Click to toggle privacy blur"
        >
          <QRCode className="mx-auto w-10/12 max-w-64" value={profile._id || "tram-user"} />
          {blur && (
            <div className="absolute inset-0 backdrop-blur-md bg-white/40 flex flex-col items-center justify-center rounded-lg transition-all">
              <MdVisibility className="text-3xl text-sec mb-1" />
              <span className="text-xs font-semibold text-sec bg-white px-3 py-1 rounded-full shadow-xs">
                Click to Reveal QR
              </span>
            </div>
          )}
        </div>

        <p className="font-mono text-xs mb-4 cursor-pointer mt-3 text-textPri/70">
          User ID: {blur ? "••••••••••••••••••••••••" : profile._id}
        </p>

        <button
          disabled={!ref || blur}
          onClick={onClick}
          className="button w-full py-2.5 bg-pri hover:bg-pri/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-md flex justify-center items-center gap-2 font-medium text-sm transition"
        >
          <MdOutlineFileDownload className="text-xl" />
          <span>{blur ? "Reveal QR to Download" : "Download QR Code (PNG)"}</span>
        </button>
      </section>
    </main>
  );
}

export default Home;
