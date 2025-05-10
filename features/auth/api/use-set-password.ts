import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
  (typeof client.api.accounts)["set-password"]["$post"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.accounts)["set-password"]["$post"]
>;

export const useSetPassword = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.accounts["set-password"].$post({
        form,
      });

      if (!response.ok) {
        throw new Error("Failed to set password");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("密码设置成功");
    },
    onError: ({ message }) => {
      toast.error(message || "密码设置失败");
    },
  });

  return mutation;
};
