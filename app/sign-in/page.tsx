"use client";

import Link from "next/link";

import { LoginForm } from "@/features/auth/components/login-form";

export default function SignIn() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-linear-to-br from-yellow-500 via-purple-600 to-orange-500 animate-gradient" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center space-x-2">
            <span className="bg-linear-to-r from-white to-blue-100 bg-clip-text">
              图片老豆👨
            </span>
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">简单易用的图片库</p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">欢迎回来</h1>
            <p className="text-sm text-muted-foreground">请选择以下方式登录</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
