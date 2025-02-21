import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

interface useGetImagesProps {
  pageNo: number;
  pageSize: number;
}

export type ResponseType = InferResponseType<typeof client.api.images.$get>['data'];

export const useGetImages = ({ pageNo, pageSize }: useGetImagesProps) => {
  const query = useQuery({
    queryKey: ["images", pageNo, pageSize],
    queryFn: async () => {
      const response = await client.api.images.$get({
        query: { pageNo: `${pageNo}`, pageSize: `${pageSize}` },
      });
      const { data } = await response.json();

      return data;
    },
  });

  return query;
};