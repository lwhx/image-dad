"use client";

import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";

const SignoutButton = () => {
  const router = useRouter();

  function handleSignOut() {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  }

  return (
    <Button onClick={handleSignOut}>
      <LogOutIcon className="w-4 h-4" />
      退出登录
    </Button>
  );
};

export default SignoutButton;
