import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Client/Home";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";
import AuthRoute from "./components/routes/Auth.route";
import Profile from "./pages/Client/Profile";
import Transactions from "./pages/Client/Transactions";
import Redeem from "./pages/Client/Redeem";
import WorkerRoute from "./components/routes/Worker.route";
import Worker from "./pages/Worker/Worker";
import AddSales, { AddBalance, Scanner } from "./pages/Worker/AddSales";
import { useEffect } from "react";
import AdminRoutes from "./components/routes/Admin.route";
import Dashboard from "./pages/Admin/Dashboard";
import UserManagement from "./pages/Admin/UserManagement";
import ClientCredits from "./pages/Admin/ClientCredits";
import AllTransactions from "./pages/Admin/AllTransactions";
import Controle, {
  ControleClientInfo,
  ControleScanner,
} from "./pages/Worker/Controle";
import RedeemTicket, { RedeemScanner } from "./pages/Worker/RedeemTicket";

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.document.title = pathname.split("/").pop() || "TramCreditAlgeria";
  }, [pathname]);

  return (
    <main className="w-full min-h-screen">
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AuthRoute />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="TransactionHistory" element={<Transactions />} />
          <Route path="Redeem" element={<Redeem />} />

          <Route path="worker" element={<WorkerRoute />}>
            <Route index element={<Worker />} />
            <Route path="addsales" element={<AddSales />}>
              <Route index element={<Scanner />} />
              <Route path=":_id" element={<AddBalance />} />
            </Route>
            <Route path="redeem" element={<RedeemTicket />}>
              <Route index element={<RedeemScanner />} />
            </Route>

            <Route path="contole" element={<Controle />}>
              <Route index element={<ControleScanner />} />
              <Route path=":_id" element={<ControleClientInfo />} />
            </Route>
          </Route>

          <Route path="*" element={<Home />} />
        </Route>
        <Route path="admin" element={<AdminRoutes />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="credits" element={<ClientCredits />} />
          <Route path="transactions" element={<AllTransactions />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
