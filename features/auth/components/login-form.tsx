"use client";

import { GithubIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

export function LoginForm() {
  const handleSignIn = async () => {
    await signIn.social({
      provider: "github",
      callbackURL: "/overview",
    });
  };

  return (
    <div className="grid gap-6">
      <Button
        variant="outline"
        size="icon"
        className="w-full"
        onClick={handleSignIn}
      >
        <GithubIcon className="h-4 w-4" />
        Github 登录
      </Button>
    </div>
  );
}
