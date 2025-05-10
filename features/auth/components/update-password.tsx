"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LockIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useGetAccounts } from "../api/use-get-accounts";
import { useSetPassword } from "../api/use-set-password";
import { useUpdatePassword } from "../api/use-update-password";
import { updatePasswordSchema } from "../schemas";

function UpdatePassword() {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(updatePasswordSchema),
  });

  const { data: accounts } = useGetAccounts();
  const isEmptyPassword = !!!accounts?.some(
    (acc) => acc.provider === "credential"
  );

  const { mutate: setPassword, isPending: isSetting } = useSetPassword();
  const { mutate: updatePassword, isPending: isUpdating } = useUpdatePassword();

  const onSubmit = (data: z.infer<typeof updatePasswordSchema>) => {
    if (isEmptyPassword) {
      setPassword(
        { form: data },
        {
          onSuccess: () => {
            setIsOpen(false);
            form.reset();
          },
        }
      );
    } else {
      updatePassword(
        { form: data },
        {
          onSuccess: () => {
            setIsOpen(false);
            form.reset();
          },
        }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <LockIcon className="size-4" />
          {isEmptyPassword ? "设置密码" : "修改密码"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEmptyPassword ? "设置密码" : "修改密码"}</DialogTitle>
          <DialogDescription>
            {isEmptyPassword
              ? "请设置一个密码，以便于登录"
              : "请输入当前密码和新的密码"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!isEmptyPassword && (
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>当前密码</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>新密码</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>确认密码</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={isSetting || isUpdating} type="submit">
                {isSetting || isUpdating ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "提交"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdatePassword;
