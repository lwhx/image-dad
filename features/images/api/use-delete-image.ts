import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<
  (typeof client.api.images)[":id"]["$delete"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.images)[":id"]["$delete"]
>;

interface useDeleteImageProps {
  onSuccess: () => void;
}

export const useDeleteImage = ({ onSuccess }: useDeleteImageProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.images[":id"].$delete({ param });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Image deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["images"] });
      onSuccess();
    },
    onError: () => {
      toast.error("Failed to delete image");
    },
  });

  return mutation;
};
