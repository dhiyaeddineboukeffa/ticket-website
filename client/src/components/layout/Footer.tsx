import { MdCopyright } from "react-icons/md";

function Footer() {
  return (
    <footer className=" w-full border-t font-medium opacity-70 gap-2 border-gray-500 border-opacity-40 flex justify-center items-center py-2.5 text-[15px]">
      <MdCopyright className="text-xl mt-px" />
      <h1>TramCreditAlgeria, All Rights Reserved</h1>
    </footer>
  );
}

export default Footer;
