import { useEffect, useState } from "react";
import Input from "../../components/common/Input";
import { profileSlice, type TMyProfile } from "../../store/signSlice";
import { deepEqual } from "../../utils/functions";
import { useUpdateProfile } from "../../hooks/useSign";
import Alert from "../../components/common/Alert";

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

  console.log(profile);

  const { loading, err, update, success } = useUpdateProfile();

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await update(newProfile);
    console.log(err);
  };

  return (
    <main className="grid items-center">
      <form
        onSubmit={submitHandler}
        className="card max-w-[650px] w-[95%] my-4 mx-auto p-5 grid grid-rows-[auto_auto_1fr]"
      >
        <aside>
          {" "}
          <h1 className="text-[28px] font-bold mb-2">Your Profile </h1>
          <h2 className="text-textSec">Manage Your Personal informations</h2>
        </aside>

        <Alert show={Boolean(err.err)} type="error" className="mt-2">
          {err.err}
        </Alert>
        <Alert show={success} type="success" className="mt-2">
            Profile Updated Successfuly
        </Alert>

        <aside className="my-5 space-y-4">
          <Input
            name="fullName"
            value={newProfile.fullName}
            set={setNewProfile}
            title="Full Name"
            err={err.fullName}
            disabled={loading}
          />
          <Input
            name="phoneNumber"
            value={newProfile.phoneNumber}
            type="number"
            set={setNewProfile}
            title="Phone Number"
            err={err.phoneNumber}
            disabled={loading}
          />
          <Input
            name="email"
            value={newProfile.email}
            set={setNewProfile}
            title="Email"
            err={err.email}
            disabled={loading}
          />
        </aside>

        <button
          disabled={deepEqual(newProfile, profile) || loading}
          className="self-end button bg-sec text-white font-medium w-20 py-1.5 rounded-md"
        >
          {loading ? (
            <div className="loader w-6 h-6 !border-2 mx-auto" />
          ) : (
            <>Save</>
          )}
        </button>
      </form>
    </main>
  );
}

export default Profile;
