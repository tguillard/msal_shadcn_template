"use client";

import { InteractionStatus } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { LoaderCircle } from "lucide-react";

import LoginButton from "@/components/ButtonConnect";
import { useEffect, useState } from "react";
import { login } from "./msal";
import { notDeepEqual } from "assert";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  const { instance, accounts, inProgress } = useMsal();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    console.log(instance)
    if (inProgress !== InteractionStatus.None ||
    isConnecting ||
    accounts.length > 0) {
      return
    } else {
      login()
    }
  },  [inProgress, isConnecting, accounts]);
  if (accounts.length > 0) {
    return (
      <>
        {children}
      </>
    );
  }

  if (inProgress !== InteractionStatus.None) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginButton />
    </div>
  );
}