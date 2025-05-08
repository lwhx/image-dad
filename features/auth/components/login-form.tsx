"use client";

import { GithubIcon } from "lucide-react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function LoginForm() {
  return (
    <div className="grid gap-6">
      <Button
        variant="outline"
        size="icon"
        className="w-full"
        onClick={() => signIn("github", { callbackUrl: "/overview" })}
      >
        <GithubIcon className="h-4 w-4" />
        Github 登录
      </Button>
    </div>
  );
}
