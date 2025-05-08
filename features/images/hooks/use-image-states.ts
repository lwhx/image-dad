import { parseAsBoolean, parseAsInteger, useQueryStates } from "nuqs";

export const useImageStates = () => {
  return useQueryStates({
    page: parseAsInteger.withDefault(1).withOptions({
      clearOnDefault: true,
    }),
    size: parseAsInteger.withDefault(12).withOptions({
      clearOnDefault: true,
    }),
    id: parseAsInteger.withOptions({
      clearOnDefault: true,
    }),
    delete: parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true,
    }),
  });
};
