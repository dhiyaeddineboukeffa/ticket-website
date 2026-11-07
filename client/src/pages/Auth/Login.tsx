import { BsCreditCard } from "react-icons/bs";
import Input from "../../components/common/Input";
import { useSignSlice } from "../../store/signSlice";
import { Link } from "react-router-dom";
import { MdLogin } from "react-icons/md";
import { useLogin } from "../../hooks/useSign";
import Alert from "../../components/common/Alert";

function Login() {
  const {
    setLoginupInfo,
    loginInfo: { email, password },
  } = useSignSlice();
  const { login, err, loading } = useLogin();

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login();
  };
  return (
    <main className="w-full min-h-screen grid place-content-center py-6">
      <form
        onSubmit={submitHandler}
        className="min-h-44 w-[500px] max-w-[95vw] p-6 space-y-4 bg-white rounded-lg"
      >
        <h1 className="flex gap-2 md:text-[34px] text-[28px] items-center mx-auto w-fit font-bold tracking-wide text-textPri">
          <BsCreditCard className="text-sec " /> TramCreditAlgeria
        </h1>

        <h2 className=" text-[#8098ae] text-center">
          Enter your email and password to access your account
        </h2>

        <Alert show={err.err} type="error" className="!text-base text-center">
          Please Enter Valid Informations 
        </Alert>

        <Input
          title="Email "
          name="email"
          set={setLoginupInfo}
          placeholder="e.g. a@b.c"
          value={email}
          err={err.email}
        />
        <Input
          type="password"
          title="Password "
          name="password"
          value={password}
          err={err.password}
          set={setLoginupInfo}
          placeholder="....................."
        />
        <button
          disabled={loading}
          className="w-full button flex !mt-6 text-white justify-center mb-6 items-center gap-2 bg-sec py-2 rounded-md "
        >
          {loading ? (
            <div className="loader w-6 h-6 !border-2" />
          ) : (
            <>
              Login <MdLogin className="lg" />
            </>
          )}
        </button>

        <Link to="/signup">
          <h1 className="mx-auto text-sm pt-5 text-textPri text-center">
            Don't have an account?{" "}
            <span className="text-sec cursor-pointer hover:text-blue-400 duration-150">
              Register Here
            </span>
          </h1>
        </Link>

        <Link to="/forgotpassword">
          <h1 className="mx-auto text-sm pt-5 text-sec cursor-pointer hover:text-blue-400 duration-150 text-center">
            Forgot Password ?
          </h1>
        </Link>
      </form>
    </main>
  );
}

export default Login;
