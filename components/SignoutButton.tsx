import { LogOutIcon } from "lucide-react";

import { signOut } from "@/lib/auth";
import { Button } from "./ui/button";

const SignoutButton = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button type="submit">
        <LogOutIcon className="w-4 h-4" />
        退出登录
      </Button>
    </form>
  );
};

export default SignoutButton;
