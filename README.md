# Next.js template

This is a Next.js template with shadcn/ui and MSAL authentication.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```

## Use Msal authentication

To use the MSAL authentication, you must define your variables in .env.local :

```bash
NEXT_PUBLIC_TENANT_ID=
NEXT_PUBLIC_CLIENT_ID=
(optionnal) NEXT_PUBLIC_GRAPH_SCOPE=User.Read
```

Then, you can use the function getAccount() and getAccessToken() to query data from Graph.

## Prerequisite

You must create an application on your Azure EntraID.
Check this link : https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app