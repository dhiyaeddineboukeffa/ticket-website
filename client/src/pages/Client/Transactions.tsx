import { useGetMyTransactions } from "../../hooks/useTransaction";
import { MdReceiptLong, MdArrowUpward, MdArrowDownward } from "react-icons/md";

function Transactions() {
  const { transactions, loading } = useGetMyTransactions();

  return (
    <main className="grid items-center py-6">
      <section className="card max-w-6xl mx-auto w-[95%] my-2 p-6 h-full grid grid-rows-[auto_1fr] shadow-xs">
        <aside className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <MdReceiptLong className="text-sec" /> Transaction History
            </h1>
            <h2 className="text-textSec text-sm mt-1">
              View your recent balance top-ups and ticket validations
            </h2>
          </div>
          <span className="text-xs px-3 py-1 bg-sec/10 text-sec font-semibold rounded-full w-fit">
            {transactions.length} Total Records
          </span>
        </aside>

        <article
          className={`space-y-2 grid overflow-x-auto ${
            loading && "grid-rows-[auto_1fr]"
          }`}
        >
          <aside className="hidden sm:grid border-b border-gray-300/80 pb-2.5 font-semibold text-xs uppercase tracking-wider text-textPri/60 grid-cols-[2fr_2fr_1fr]">
            <span className="pl-2">Date & Time</span>
            <span>Transaction Type</span>
            <span className="justify-self-end pr-2">Amount</span>
          </aside>

          {loading ? (
            <aside className="w-full h-48 grid place-content-center">
              <div className="loader w-10 h-10 !border-t-sec !border-sec/20 !border-4" />
            </aside>
          ) : transactions.length > 0 ? (
            transactions.map((t, i) => {
              const isCredit = t.balance > 0;
              const dateStr = t.createdAt
                ? new Date(t.createdAt).toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Unknown date";

              return (
                <aside
                  key={t._id || i}
                  className={`py-3 px-1 sm:px-0 flex flex-col sm:grid sm:grid-cols-[2fr_2fr_1fr] sm:items-center gap-1.5 sm:gap-2 hover:bg-black/[0.02] transition-colors rounded ${
                    i !== transactions.length - 1 ? "border-b border-gray-200/70" : ""
                  }`}
                >
                  <div className="flex sm:contents items-center justify-between w-full">
                    <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium sm:order-2">
                      {isCredit ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs font-semibold">
                          <MdArrowUpward className="text-sm" /> Balance Top-Up
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-xs font-semibold">
                          <MdArrowDownward className="text-sm" /> Tram Ticket Ride
                        </span>
                      )}
                    </span>
                    <span
                      className={`font-bold font-mono text-sm sm:order-3 sm:justify-self-end sm:pr-2 ${
                        isCredit ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {isCredit ? "+" : ""}
                      {t.balance} <span className="text-[11px] font-normal">DZD</span>
                    </span>
                  </div>

                  <span className="sm:pl-2 font-mono text-[11px] sm:text-sm text-textPri/60 sm:text-textPri/80 sm:order-1">
                    {dateStr}
                  </span>
                </aside>
              );
            })
          ) : (
            <div className="py-12 text-center text-textPri/50 flex flex-col items-center justify-center gap-2">
              <MdReceiptLong className="text-4xl text-gray-300" />
              <p className="text-sm font-medium">No transactions recorded yet.</p>
              <p className="text-xs text-textPri/40">
                Top up your balance or ride the tram to see your history here.
              </p>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}

export default Transactions;
