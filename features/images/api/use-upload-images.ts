import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<
  typeof client.api.images.upload.$post
>["form"];
type ResponseType = InferResponseType<
  typeof client.api.images.upload.$post,
  200
>;

export const useUploadImages = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (form) => {
      const response = await client.api.images.upload.$post({ form });

      if (!response.ok) {
        const error = (await response.json()) as { error: string };
        throw new Error(error.error);
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("文件上传成功");
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
