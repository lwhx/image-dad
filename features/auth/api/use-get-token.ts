import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetToken = () => {
  const query = useQuery({
    queryKey: ["token"],
    queryFn: async () => {
      const response = await client.api.auth.token.$get();

      if (!response.ok) {
        throw new Error("Failed to get token");
      }

      const { data } = await response.json();

      return data;
    },
    enabled: false,
  });

  return query;
};
