import { useEffect, useState } from "react";
import { useTransactionSlice } from "../store/transactionSlice";
import { api } from "./api";

//////!   GET MY TRANSACTION   !//////

export const useGetMyTransactions = (getOnMount = true) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);
  const { setTransaction, transactions } = useTransactionSlice();

  const getTransactions = async () => {
    try {
      setLoading(true);
      const resp = await api.get("/api/transaction/getMy");
      setTransaction(resp.data);
      setErr(false);
    } catch (error) {
      setErr(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (getOnMount) getTransactions();
  }, []);

  return { err, loading, setTransaction, getTransactions, transactions };
};

export const useCreateTransaction = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);

  const createTransaction = async (client: string, balance: number) => {
    try {
      setLoading(true);
      const resp = await api.post("/api/transaction/create", { balance, client });
      console.log(resp);
      
      setErr(false);
    } catch (error) {
      setErr(true);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, err, createTransaction };
};


