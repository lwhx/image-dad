"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { GithubIcon, Loader2, TriangleAlertIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

import { loginSchema } from "../schemas";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("error");

  const form = useForm<z.infer<typeof loginSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      setIsLoading(true);
      const res = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/overview",
      });

      if (res.error) {
        throw new Error(res.error.message);
      }

      toast.success("登录成功");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "登录失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithub = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/overview",
      errorCallbackURL: "/sign-in",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>密码</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "登录"}
        </Button>
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            <TriangleAlertIcon className="h-4 w-4 shrink-0" />
            {errorMessage.replace(/_/g, " ")}
          </div>
        )}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              或者
            </span>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="w-full"
          onClick={handleGithub}
        >
          <GithubIcon className="h-4 w-4" />
          Github 登录
        </Button>
      </form>
    </Form>
  );
}
