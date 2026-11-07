import { Outlet, useNavigate } from "react-router-dom";
import { useCreateTransaction } from "../../hooks/useTransaction";
import StartScan from "../../components/content/StartScan";
import { toast } from "react-toastify";

function RedeemTicket() {
  return (
    <main className="max-w-7xl w-11/12  px-4 my-4 py-2 mx-auto grid grid-rows-[auto_1fr]">
      <aside>
        <h1 className="text-3xl font-bold mb-5">Redeem Ticket</h1>
        <h2 className="text-textSec mb-4">
          Scan a client's QR,to redeem 40dzd
        </h2>
      </aside>

      <Outlet />
    </main>
  );
}

export const RedeemScanner = () => {
  const { createTransaction } = useCreateTransaction();
  const navigate = useNavigate();
  return (
    <StartScan
      handler={(result: any) => {
        try {
          createTransaction(result, -40);
          toast.success("Ticket Redeemed Successfuly");
          navigate("/worker")
        } catch (error) {
          toast.error("Somthing Went Wrong");
        }
      }}
    />
  );
};

export default RedeemTicket;
