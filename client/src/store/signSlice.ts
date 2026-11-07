import { create } from "zustand";

export interface TSignUpInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface TLoginInfo {
  email: string;
  password: string;
}

interface TSignSlice {
  signupInfo: TSignUpInfo;
  setSignupInfo: any;
  loginInfo: TLoginInfo;
  setLoginupInfo: any;
}

export const useSignSlice = create<TSignSlice>((set) => ({
  signupInfo: {
    email: "",
    fullName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  },
  setSignupInfo: (fn: any) =>
    set((state: any) => ({
      signupInfo: typeof fn === "function" ? fn(state.signupInfo) : fn,
    })),
  loginInfo: { email: "", password: "" },
  setLoginupInfo: (fn: any) =>
    set((state: any) => ({
      loginInfo: typeof fn === "function" ? fn(state.loginInfo) : fn,
    })),
}));

interface TAuthSlice {
  auth: string;
  isAdmin: boolean;
  setAuth: any;
  setAdmin: (value: boolean) => any;
}

export const authSlice = create<TAuthSlice>((set) => ({
  auth: localStorage.getItem("auth") || "",
  setAuth: (auth: string) =>
    set(() => {
      localStorage.setItem("auth", auth);
      return { auth };
    }),
  isAdmin: false,
  setAdmin: (value: boolean) => set(() => ({ isAdmin: value })),
}));

export interface TMyProfile {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  isAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
  role?: string;
  balance?: number;
}

interface TProfileSlice {
  profile: TMyProfile;
  setProfile: (value: TMyProfile) => any;
}

export const profileSlice = create<TProfileSlice>((set) => ({
  profile: { _id: "", fullName: "", phoneNumber: "", email: "" },
  setProfile: (fn: any) =>
    set((state: any) => ({
      profile: typeof fn === "function" ? fn(state.profile) : fn,
    })),
}));

interface TClientSlice {
  client: TMyProfile;
  setClient: (value: TMyProfile) => any;
}

export const clientSlice = create<TClientSlice>((set) => ({
  client: { _id: "", fullName: "", phoneNumber: "", email: "" },
  setClient: (fn: any) =>
    set((state: any) => ({
      client: typeof fn === "function" ? fn(state.client) : fn,
    })),
}));
