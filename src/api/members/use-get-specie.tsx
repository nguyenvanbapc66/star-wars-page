import { useState } from "react";
import { client } from "../common";

type Response = {
  skin_colors: string;
  hair_colors: string;
  eye_colors: string;
};

export const useGetSpecie = () => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<Response | null>(null);
  const [error, setError] = useState<any>(null);

  const fetcher = async (url: string) => {
    setLoading(true);

    try {
      const res = await client.get(url);

      setData(res.data);
    } catch (error) {
      setError(error);
    }

    setLoading(false);
  };

  return { data, mutate: fetcher, isLoading, error };
};
