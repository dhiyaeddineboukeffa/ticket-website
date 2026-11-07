import { useEffect } from "react";
import { profileSlice } from "../../store/signSlice";
import { Outlet, useNavigate } from "react-router-dom";

function WorkerRoute() {
  const { profile } = profileSlice();
  console.log(profile);

  const navigate = useNavigate();
  useEffect(() => {
    if (profile.role && profile.role !== "worker") navigate("/");
  }, [profile.role]);

  if (!profile.role)
    return (
      <aside className="grid w-full h-full place-content-center">
        <div className="w-16 h-16 !border-8 loader !border-white !border-t-sec" />
      </aside>
    );
  if (profile.role) return <Outlet />;
}

export default WorkerRoute;
