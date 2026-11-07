import { useGetMyTransactions } from "../../hooks/useTransaction";

function Transactions() {
  const { transactions, loading } = useGetMyTransactions();

  return (
    <main className="grid items-center py-4">
      <section className="card max-w-6xl mx-auto w-[95%] my-4 p-5  h-full grid grid-rows-[auto_1fr]">
        <aside className="mb-6">
          <h1 className="text-[28px] font-bold mb-2">Transaction History </h1>
          <h2 className="text-textSec">View Your Recent Amount Activity</h2>
        </aside>

        <article
          className={`space-y-3 grid overflow-x-clip  ${
            loading && "grid-rows-[auto_1fr]"
          }`}
        >
          <aside className="border-b border-gray-300 h-9 font-medium gap-2  border-opacity-50 grid grid-cols-[3fr_2fr_2fr]">
            <h1 className="pl-2">Date</h1>
            <h2 className="">Description</h2>
            <h3 className="justify-self-end pr-2">Amount</h3>
          </aside>
          {loading ? (
            <aside className="w-full h-full grid place-content-center">
              <div className="loader w-16 h-16 !border-t-black/80 !border-black/20 !border-[6px]" />
            </aside>
          ) : (
            transactions.map((t, i) => (
              <aside
                className={` border-gray-300 gap-2  border-opacity-50 grid grid-cols-[3fr_2fr_2fr] ${
                  i !== 4 && "border-b"
                }`}
              >
                <h1 className="pl-2">
                  {t.createdAt.split("T").join("  ").split(".")[0]}
                </h1>
                <h2 className="">
                  {t.balance > 0 ? "Credit Purchase" : "Ticket redeemed"}
                </h2>
                <h3
                  style={{
                    color: t.balance > 0 ? "green" : "red",
                  }}
                  className="justify-self-end pr-2"
                >
                  {t.balance > 0 ? "+" : ""}
                  {t.balance} <span className="text-xs">DZD</span>
                </h3>
              </aside>
            ))
          )}
        </article>
      </section>
    </main>
  );
}

export default Transactions;
