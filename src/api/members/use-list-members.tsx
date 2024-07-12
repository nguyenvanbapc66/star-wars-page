import { useCallback, useEffect, useState } from "react";

import { client } from "../common";
import { PaginationQueryType } from "../types";
import { PaginationType } from "@/types";

export type MemberType = {
  name: string;
  height: string;
  mass: string;
  birth_year: string;
  species: string[];
  gender: string;
};

type Response = PaginationQueryType<MemberType>;

type Variables = PaginationType;

export const useListMember = (params: Variables) => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<Response | null>(null);
  const [error, setError] = useState<any>(null);

  const fetcher = useCallback(async () => {
    setLoading(true);

    try {
      const res = await client.get("/people/", {
        params,
      });

      setData(res.data);
    } catch (error) {
      setError(error);
    }

    setLoading(false);
  }, [params]);

  useEffect(() => {
    fetcher();
  }, [fetcher]);

  return { isLoading, data, error };
};
