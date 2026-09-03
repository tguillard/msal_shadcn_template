import {
  BrowserCacheLocation,
  EventType,
  PublicClientApplication,
  type AccountInfo,
  type Configuration,
} from "@azure/msal-browser";

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;
const tenantId = process.env.NEXT_PUBLIC_TENANT_ID!;

if (!clientId || !tenantId) {
  throw new Error("ENTRA_CLIENT_ID et ENTRA_TENANT_ID sont obligatoires.");
}

const scopes = (process.env.NEXT_PUBLIC_GRAPH_SCOPE ?? "User.Read")
  .split(",")
  .map((scope: string) => scope.trim())
  .filter(Boolean);

const configuration : Configuration = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri:
      typeof window !== "undefined"
        ? window.location.origin
        : "/",
  },
  cache: {
    cacheLocation: "localStorage" as const,
  },
};

export const loginRequest = { scopes };
export const msalInstance = new PublicClientApplication(configuration);

export async function initializeMsal(): Promise<void> {
  await msalInstance.initialize();
  const redirectResult = await msalInstance.handleRedirectPromise();

  if (redirectResult?.account) {
    msalInstance.setActiveAccount(redirectResult.account);
  } else if (!msalInstance.getActiveAccount()) {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) msalInstance.setActiveAccount(accounts[0]);
  }

  msalInstance.addEventCallback((event) => {
    if (
      event.eventType === EventType.LOGIN_SUCCESS &&
      event.payload &&
      "account" in event.payload
    ) {
      const account = event.payload.account as AccountInfo | null;
      if (account) msalInstance.setActiveAccount(account);
    }
  });
}

export async function login() {
  return await msalInstance.loginRedirect(loginRequest);
}
export function getAccount(): AccountInfo | null {
  const accounts = msalInstance.getAllAccounts()

  if (accounts.length === 0) {
    return null;
  }

  return accounts[0];
}

export async function logout() {
  const account = getAccount();
    console.log("disconnect")

  if (!account) return;
  await msalInstance.logoutPopup({
    account,
  });
}
export function isAuthenticated(): boolean {
  return getAccount() !== null;
}

