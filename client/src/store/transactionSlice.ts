import { create } from "zustand";

type TUser = {
  _id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
};

interface TTransaction {
  _id?: string;
  balance: number;
  worker: TUser;
  client: TUser;
  createdAt: string;
  updatedAt: string;
}

interface TTransactionSlice {
  transactions: TTransaction[];
  setTransaction: any;
}

export const useTransactionSlice = create<TTransactionSlice>((set) => ({
  transactions: [],
  setTransaction: (fn: any) =>
    set((state: any) => ({
      transactions: typeof fn === "function" ? fn(state.transactions) : fn,
    })),
}));
