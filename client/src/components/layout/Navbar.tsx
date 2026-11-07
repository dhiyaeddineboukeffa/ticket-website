import { BsCreditCard } from "react-icons/bs";

function Navbar() {
  return (
    <header className="h-16 border-b-2 border-sec border-opacity-40 w-full ">
      <article className="flex justify-between items-center h-full max-w-7xl mx-auto w-11/12">
        <aside className="flex gap-2 items-center text-2xl text-textPri font-bold tracking-wide">
          <BsCreditCard className="text-sec " /> TramCreditAlgeria
        </aside>

        <button className="button bg-sec px-5 py-1.5 rounded-md text-white hover:text-sec hover:bg-transparent border border-sec">Login</button>
      </article>
    </header>
  );
}

export default Navbar;
