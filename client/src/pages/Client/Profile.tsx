import { useEffect, useState } from "react";
import Input from "../../components/common/Input";
import { profileSlice, type TMyProfile } from "../../store/signSlice";
import { deepEqual } from "../../utils/functions";
import { useUpdateProfile } from "../../hooks/useSign";
import Alert from "../../components/common/Alert";
import { MdPerson, MdEmail, MdPhone, MdShield, MdCreditCard } from "react-icons/md";

function Profile() {
  const { profile } = profileSlice();
  const [newProfile, setNewProfile] = useState<TMyProfile>(profile);

  useEffect(() => {
    setNewProfile({
      email: profile.email,
      _id: profile._id,
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber,
    });
  }, [profile]);

  const { loading, err, update, success } = useUpdateProfile();

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await update(newProfile);
  };

  return (
    <main className="grid items-center py-6">
      <form
        onSubmit={submitHandler}
        className="card max-w-[650px] w-[95%] my-2 mx-auto p-6 grid grid-rows-[auto_auto_1fr] shadow-xs"
      >
        <aside className="border-b pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <MdPerson className="text-sec" /> Your Profile
          </h1>
          <h2 className="text-textSec text-sm mt-1">
            Manage your personal information and contact details
          </h2>
        </aside>

        {/* Account Info Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
          <div className="p-3 bg-sec/5 border border-sec/20 rounded-md">
            <span className="text-[11px] uppercase tracking-wider text-textPri/50 font-medium flex items-center gap-1">
              <MdCreditCard className="text-sec" /> Balance
            </span>
            <span className="text-sm sm:text-base font-bold text-sec">
              {(profile.balance || 0).toLocaleString()} DZD
            </span>
          </div>

          <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
            <span className="text-[11px] uppercase tracking-wider text-purple-700/60 font-medium flex items-center gap-1">
              <MdShield className="text-purple-600" /> Account Role
            </span>
            <span className="text-sm sm:text-base font-bold text-purple-700 capitalize">
              {profile.role || "Client"}
            </span>
          </div>

          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md col-span-2 sm:col-span-1">
            <span className="text-[11px] uppercase tracking-wider text-textPri/50 font-medium">User ID</span>
            <span className="font-mono text-xs font-semibold text-textPri/80 truncate block">
              {profile._id ? `${profile._id.slice(0, 10)}...` : "N/A"}
            </span>
          </div>
        </div>

        <Alert show={Boolean(err.err)} type="error" className="mt-2">
          {err.err}
        </Alert>
        <Alert show={success} type="success" className="mt-2">
          Profile updated successfully!
        </Alert>

        <aside className="my-4 space-y-4">
          <Input
            name="fullName"
            value={newProfile.fullName}
            set={setNewProfile}
            title="Full Name"
            err={err.fullName}
            disabled={loading}
            icon={<MdPerson />}
            placeholder="Your full name"
          />
          <Input
            name="phoneNumber"
            value={newProfile.phoneNumber}
            type="tel"
            set={setNewProfile}
            title="Phone Number"
            err={err.phoneNumber}
            disabled={loading}
            icon={<MdPhone />}
            placeholder="e.g. 05xxxxxxxx"
          />
          <Input
            name="email"
            value={newProfile.email}
            set={setNewProfile}
            title="Email Address"
            err={err.email}
            disabled={loading}
            icon={<MdEmail />}
            placeholder="Your email address"
          />
        </aside>

        <button
          type="submit"
          disabled={deepEqual(newProfile, profile) || loading}
          className="self-end button bg-sec text-white font-medium px-6 py-2 rounded-md hover:bg-sec/90 disabled:opacity-50 transition"
        >
          {loading ? (
            <div className="loader w-5 h-5 !border-2 mx-auto" />
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </main>
  );
}

export default Profile;
