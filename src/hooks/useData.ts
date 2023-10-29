//this is a generic hook for retrieving backend data via axios

import { SetStateAction, useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { AxiosRequestConfig, CanceledError } from "axios";

interface FetchResponse<T> {
  count: number;
  results: T[];
}

const useData = <T>(endpoint: string, requestConfig?: AxiosRequestConfig, deps?: any[], pollInterval: number = 2100) => {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get<FetchResponse<T>>(endpoint, { signal: controller.signal, ...requestConfig });
        setData(res.data as any);
        setLoading(false);
      } catch (error) {
        if (error instanceof CanceledError) return;
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, pollInterval);

    return () => {
      controller.abort();
      clearInterval(intervalId);
    };
  }, deps ? [...deps] : []);

  return { data, error, loading };
};

export default useData;