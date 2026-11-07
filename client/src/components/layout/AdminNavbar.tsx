import { BsCreditCard } from "react-icons/bs";

function AdminNavbar() {
  return (
    <header className="h-16 border-b-2 border-white/10 border-opacity-40 w-full  top-0 bg-[#09090B]">
      <article className="flex justify-between items-center h-full  mx-auto w-11/12">
        <aside className="flex gap-2 items-center md:text-2xl text-lg text-white font-bold tracking-wide">
          <BsCreditCard className="text-white " /> TramCreditAlgeria
        </aside>

        <button className="button bg-transparent px-5 py-1.5 rounded-md text-white hover:text-black hover:bg-white border border-white font-medium">
          Login
        </button>
      </article>
    </header>
  );
}

export default AdminNavbar;
