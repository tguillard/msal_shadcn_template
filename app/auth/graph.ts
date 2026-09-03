import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { getAccount, loginRequest, msalInstance } from "./msal";

async function getAccessToken(): Promise<string> {
  const account = getAccount();
  if (!account) throw new Error("AUTHENTICATION_REQUIRED");

  try {
    const result = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account,
    });
    return result.accessToken;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      await msalInstance.acquireTokenRedirect({ ...loginRequest, account });
    }
    throw error;
  }
}

export async function graphGet<T>(path: string): Promise<T> {
  const token = await getAccessToken();
  const response = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });

  if (!response.ok) {
    const requestId = response.headers.get("request-id") ?? "non fourni";
    throw new Error(`Graph ${response.status}, request-id ${requestId}`);
  }

  return response.json() as Promise<T>;
}


export async function graphRequest<T>(
  endpoint: string,
  init?: RequestInit
): Promise<T> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Utilisateur non connecté");
  }

  const response = await fetch(
    `https://graph.microsoft.com/v1.0${endpoint}`,
    {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...init?.headers,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Graph API Error: ${response.status}`
    );
  }

  return response.json();
}

export async function getCurrentUser() {
  return await graphRequest<{
    displayName: string;
    givenName: string;
    surname: string;
    userPrincipalName: string;
    mail: string;
    id: string;
  }>("/me");
}

export async function getUserPhoto(): Promise<string | null> {
  const token = await getAccessToken();

  if (!token) {
    return null;
  }

  const response = await fetch(
    "https://graph.microsoft.com/v1.0/me/photo/$value",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  const blob = await response.blob();

  return URL.createObjectURL(blob);
}