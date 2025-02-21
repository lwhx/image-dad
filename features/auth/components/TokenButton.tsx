"use client";

import { Button } from "@/components/ui/button";
import { useGetToken } from "@/features/auth/api/use-get-token";
import { useCopy } from "@/hooks/use-copy";
import { KeyRound, Loader2 } from "lucide-react";

export default function TokenButton() {
  const { refetch, isLoading } = useGetToken();
  const { copy } = useCopy();

  async function getToken() {
    const { data } = await refetch();
    if (data) {
      copy(data);
    }
  }

  return (
    <Button onClick={getToken} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" />
          获取中...
        </>
      ) : (
        <>
          <KeyRound />
          获取Token
        </>
      )}
    </Button>
  );
}
