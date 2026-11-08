import { Outlet, useNavigate } from "react-router-dom";
import { useGetProfile, useLogout } from "../../hooks/useSign";
import { useEffect } from "react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

function AuthRoute() {
  const { logout } = useLogout();
  useGetProfile();
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("auth")) logout().then(() => navigate("/login"));
  }, []);

  if (localStorage.getItem("auth"))
    return (
      <main className="min-h-screen grid grid-rows-[auto_1fr_auto] text-textPri">
        <Navbar />
        <Outlet />
        <Footer />
      </main>
    );
}

export default AuthRoute;
