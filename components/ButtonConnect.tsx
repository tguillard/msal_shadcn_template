"use client";

import { isAuthenticated, login, loginRequest, logout } from "@/app/auth/msal";


import { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { LoaderCircle, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function LoginButton() {
  const { instance } = useMsal();
  const [isConnecting, setIsConnecting] = useState(false);

  async function handleLogin() {
    setIsConnecting(true);

    try {
      await instance.loginRedirect({
        scopes: loginRequest.scopes,
        prompt: "select_account",
      });
    } catch (error) {
      console.error("Erreur pendant la connexion Microsoft 365 :", error);
      setIsConnecting(false);
    }
  }

  return (
    <Button
      type="button"
      size="lg"
      className="w-1/4"
      onClick={handleLogin}
      disabled={isConnecting}
    >
      {isConnecting ? (
        <>
          <LoaderCircle className="mr-2 size-4 animate-spin" />
          Connexion en cours…
        </>
      ) : (
        <>
          <LogIn className="mr-2 size-4" />
          Se connecter avec Microsoft 365
        </>
      )}
    </Button>
  );
}

export function LogoutButton() {
    if (isAuthenticated()) {
        return (
            <button onClick={logout}>
                Deconnexion
            </button>
        );
    } else {
        return (<></>)
    }
}