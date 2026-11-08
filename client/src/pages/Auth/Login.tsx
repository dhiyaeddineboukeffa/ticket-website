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
        className="min-h-44 w-[500px] max-w-[95vw] p-6 space-y-4 bg-white rounded-lg shadow-sm"
      >
        <h1 className="flex gap-2 md:text-[34px] text-[28px] items-center mx-auto w-fit font-bold tracking-wide text-textPri">
          <BsCreditCard className="text-sec " /> TramCreditAlgeria
        </h1>

        <h2 className="text-[#8098ae] text-center text-sm">
          Enter your email and password to access your account
        </h2>

        <Alert show={err.err} type="error" className="!text-sm text-center">
          Please enter valid credentials
        </Alert>

        <Input
          title="Email"
          name="email"
          set={setLoginupInfo}
          placeholder="e.g. user@example.com"
          value={email}
          err={err.email}
        />
        <Input
          type="password"
          title="Password"
          name="password"
          value={password}
          err={err.password}
          set={setLoginupInfo}
          placeholder="••••••••••••"
        />
        <button
          disabled={loading}
          type="submit"
          className="w-full button flex !mt-6 text-white justify-center mb-6 items-center gap-2 bg-sec hover:bg-sec/90 py-2.5 rounded-md font-medium transition"
        >
          {loading ? (
            <div className="loader w-5 h-5 !border-2" />
          ) : (
            <>
              Login <MdLogin className="text-lg" />
            </>
          )}
        </button>

        <Link to="/signup">
          <h1 className="mx-auto text-sm pt-4 text-textPri text-center">
            Don't have an account?{" "}
            <span className="text-sec font-semibold cursor-pointer hover:underline">
              Register Here
            </span>
          </h1>
        </Link>
      </form>
    </main>
  );
}

export default Login;
