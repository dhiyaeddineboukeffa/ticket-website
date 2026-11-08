import { BsCreditCard } from "react-icons/bs";
import { useSignSlice } from "../../store/signSlice";
import Input from "../../components/common/Input";
import { MdPersonAddAlt } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSignup } from "../../hooks/useSign";

function SignUp() {
  const { setSignupInfo, signupInfo } = useSignSlice();

  const { signup, loading, err } = useSignup();

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(err);
    await signup();
  };

  return (
    <main className="w-full min-h-screen grid place-content-center py-6">
      <form
        onSubmit={submitHandler}
        className="min-h-44 w-[520px] max-w-[95vw] p-6 space-y-4 bg-white rounded-lg"
      >
        <h1 className="flex gap-2 md:text-[34px] text-[28px] items-center mx-auto w-fit font-bold tracking-wide text-textPri">
          <BsCreditCard className="text-sec " /> TramCreditAlgeria
        </h1>

        <h2 className=" text-[#8098ae] text-center">
          Create your client account to start using digital tickets
        </h2>

        <Input
          title="Full Name"
          name="fullName"
          set={setSignupInfo}
          placeholder="e.g. Fatima Zahra"
          value={signupInfo.fullName}
          err={err.fullName}
        />
        <Input
          title="Phone Number"
          name="phoneNumber"
          type="tel"
          set={setSignupInfo}
          value={signupInfo.phoneNumber}
          placeholder="e.g. 05xxxxxxxx"
          err={err.phoneNumber}
        />
        <Input
          title="Email "
          name="email"
          err={err.email}
          set={setSignupInfo}
          value={signupInfo.email}
          placeholder="e.g. a@b.c"
        />
        <Input
          type="password"
          err={err.password}
          title="Password "
          value={signupInfo.password}
          name="password"
          set={setSignupInfo}
          placeholder="....................."
        />
        <Input
          type="password"
          title="Confirm Password"
          name="confirmPassword"
          err={err.confirmPassword}
          value={signupInfo.confirmPassword}
          placeholder="....................."
          set={setSignupInfo}
        />

        <button
          disabled={loading}
          type="submit"
          className="w-full flex text-white justify-center mb-6 items-center gap-2 bg-sec py-2 rounded-md active:translate-y-px duration-200"
        >
          {loading ? (
            <div className="loader w-6 h-6 !border-2" />
          ) : (
            <>
              Register <MdPersonAddAlt className="text-lg" />
            </>
          )}
        </button>

        <Link to="/login">
          <h1 className="mx-auto text-sm pt-5 text-textPri text-center">
            Already Have An Account?{" "}
            <span className="text-sec cursor-pointer hover:text-blue-400 duration-150">
              Login Here
            </span>
          </h1>
        </Link>
      </form>
    </main>
  );
}

export default SignUp;
