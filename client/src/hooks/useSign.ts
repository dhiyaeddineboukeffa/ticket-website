import axios from "axios";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import {
  authSlice,
  clientSlice,
  profileSlice,
  useSignSlice,
  type TMyProfile,
} from "../store/signSlice";
import { api } from "./api";

//////!   LOGIN   !//////

export const useLogin = () => {
  const [loading, setloading] = useState(false);
  const [err, seterr] = useState({ email: "", password: "", err: false });
  const navigate = useNavigate();
  const { setAuth } = authSlice();
  const {
    loginInfo: { email, password },
  } = useSignSlice();

  const login = async () => {
    const cleanEmail = email?.trim().toLowerCase();
    const cleanPassword = password?.trim();

    if (
      !cleanEmail ||
      !cleanPassword ||
      !/^(?=.*\d).{6,}$/.test(cleanPassword) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
      seterr({
        password: !cleanPassword
          ? "Please fill the input with your password"
          : /^(?=.*\d).{6,}$/.test(cleanPassword)
          ? ""
          : "Please Enter Valid Password",
        email: !cleanEmail
          ? "Please fill the input with your email"
          : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
          ? ""
          : "Please Enter Valid Email",
        err: true,
      });
      return;
    }

    setloading(true);

    try {
      const resp = await axios.post("/api/auth/", { email: cleanEmail, password: cleanPassword });
      seterr({ email: "", password: "", err: true });
      setAuth(resp.data._id);
      if (resp.data.isAdmin || resp.data.role === "admin") {
        navigate("/admin");
      } else if (resp.data.role === "worker") {
        navigate("/worker");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      if (error.response.status === 402 || error.response.status === 403)
        seterr({
          password: error.response.status === 402 ? "Incorrect Password" : "",
          email: error.response.status === 403 ? "Email Not Found" : "",
          err: true,
        });
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  return { login, loading, err };
};

//////!   SIGNUP   !//////

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
    phoneNumber: "",
    err: false,
  });
  const navigate = useNavigate();
  const { setAuth } = authSlice();
  const { signupInfo: props } = useSignSlice();

  const signup = async () => {
    if (handleSignup({ ...props, setErr })) return;
    setLoading(true);
    try {
      const resp = await axios.post("/api/auth/signup", props);
      setErr({
        email: "",
        password: "",
        fullName: "",
        confirmPassword: "",
        phoneNumber: "",
        err: true,
      });
      setAuth(resp.data._id);
      if (resp.data.isAdmin || resp.data.role === "admin") {
        navigate("/admin");
      } else if (resp.data.role === "worker") {
        navigate("/worker");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      if (error.response.status === 402)
        setErr({ ...err, email: "Email Already Exist" });
      if (error.response.status === 403)
        setErr({ ...err, fullName: "Full name Already Exist" });
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup, err };
};

const handleSignup = ({
  email,
  password,
  confirmPassword,
  fullName,
  phoneNumber,
  setErr,
}: any) => {
  if (
    !email ||
    !password ||
    !fullName ||
    !confirmPassword ||
    !phoneNumber ||
    !/.{3,}/.test(fullName) ||
    !/^(0[567])\d{8}$/.test(phoneNumber) ||
    !/^(?=.*\d).{6,}$/.test(password) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    password !== confirmPassword
  ) {
    setErr(() => ({
      password: !password
        ? "Please fill the input with new password"
        : /^(?=.*\d).{6,}$/.test(password)
        ? ""
        : "Please Enter Valid Password",
      email: !email
        ? "Please fill the input with your email"
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? ""
        : "Please Enter Valid Email",
      phoneNumber: !phoneNumber
        ? "Please fill the input with your phone number"
        : /^(0[567])\d{8}$/.test(phoneNumber)
        ? ""
        : "Please Enter Valid Phone Number",
      fullName: !fullName
        ? "Please fill the input with your full name"
        : /.{3,}/.test(fullName)
        ? ""
        : "Please Enter Valid full name",
      confirmPassword: !confirmPassword
        ? "Please fill the input with same password"
        : confirmPassword !== password
        ? "Please Enter The Same Password"
        : "",
    }));
    return true;
  }
  return false;
};

// //////!   Logout   !//////

export const useLogout = () => {
  const [loading, setloading] = useState(false);
  const [err, seterr] = useState("");
  const { setAuth } = authSlice();
  const navigate = useNavigate();

  const logout = async () => {
    setloading(true);
    try {
      const resp = await api.get("/api/auth/logout");
      if (resp.data) {
        setAuth("");
        navigate("/");
        localStorage.clear();
      }
    } catch (error: any) {
      if (error.response.status === 401) seterr("Not Authorized");

      console.log({ error });
    } finally {
      setloading(false);
    }
  };
  return { loading, err, logout };
};

// //////!   GetProfile   !//////

export const useGetProfile = (onMount = true) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);
  const { setProfile } = profileSlice();

  const Get = async () => {
    try {
      setLoading(true);
      const resp = await api.get("/api/auth/myProfile");
      setProfile(resp.data);
    } catch (error: any) {
      setErr(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onMount && Get();
  }, []);

  return { loading, err, Get };
};

// //////!   UPDATE PROFILE   !//////

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [err, setErr] = useState({
    email: "",
    fullName: "",
    phoneNumber: "",
    err: "",
  });
  const { setProfile } = profileSlice();

  const update = async (info: TMyProfile) => {
    try {
      setSuccess(false);
      if (handleUpdateError(setErr, info)) return;
      console.log({ err });

      setLoading(true);
      const resp = await api.put("/api/auth/MyProfile", {
        email: info.email,
        fullName: info.fullName,
        phoneNumber: info.phoneNumber,
      });
      setProfile(resp.data);
      setErr({
        email: "",
        fullName: "",
        phoneNumber: "",
        err: "",
      });
      setSuccess(true);
    } catch (error: any) {
      const err = error.response.data;
      setErr({
        email: err.error === "Email Already Exist" ? "Email Already Exist" : "",
        fullName: "",
        phoneNumber: "",
        err: "Somthing Went Wrong",
      });
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, err, success };
};

const handleUpdateError = (
  setErr: any,
  { fullName, phoneNumber, email }: any
) => {
  if (
    (fullName.length < 3 && Boolean(fullName)) ||
    (Boolean(phoneNumber) && !/^(0[567])\d{8}$/.test(phoneNumber)) ||
    (Boolean(email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  ) {
    setErr({
      fullName:
        fullName.length < 3 && Boolean(fullName)
          ? "Please Enter Valid Full Name"
          : "",
      phoneNumber:
        Boolean(phoneNumber) && !/^(0[567])\d{8}$/.test(phoneNumber)
          ? "Please Enter Valid Phone Number"
          : "",
      email:
        Boolean(email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? "Please Enter Valid Email"
          : "",
    });

    return true;
  }
  return false;
};

// //////!   GET CLIENT PROFILE   !//////

export const useGetClient = (_id: string | undefined, OnMount = true) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);
  const { setClient, client } = clientSlice();

  const getClient = async () => {
    try {
      if (!_id) return;
      setLoading(true);
      const resp = await axios.get(`/api/auth/getProfile/${_id}`);
      setClient(resp.data);
      setErr(false);
    } catch (error) {
      setErr(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (OnMount) getClient();
  }, [_id]);

  return { loading, err, client, getClient };
};
