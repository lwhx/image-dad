import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
  (typeof client.api.accounts)["update-password"]["$post"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.accounts)["update-password"]["$post"]
>;

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.accounts["update-password"].$post({
        form,
      });

      if (!response.ok) {
        const error = (await response.json()) as { error: string };
        throw new Error(error.error);
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
