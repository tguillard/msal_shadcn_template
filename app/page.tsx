"use client"
import { Button } from "@/components/ui/button"
import { getAccount } from "./auth/msal"
import { getCurrentUser, getUserPhoto } from "./auth/graph"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Page() {
  const [userPhoto, setUserPhoto] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>("Utilisateur")
  useEffect(() => {
          let cancelled = false
          let photoUrl: string | null = null

          async function loadUser() {
              const account = getAccount()

              if (account?.name && !cancelled) {
                  setUserName(account.name)
              }

              try {
                  photoUrl = await getUserPhoto()

                  if (!cancelled) {
                      setUserPhoto(photoUrl)
                  }
              } catch (error) {
                  console.error("Impossible de récupérer la photo utilisateur :", error)
              }
          }

          void loadUser()

          return () => {
              cancelled = true

              if (photoUrl?.startsWith("blob:")) {
                  URL.revokeObjectURL(photoUrl)
              }
          }
      }, [])
  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  const account = getAccount()

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <Avatar className="size-11 border-2 border-primary/20">
                                        <AvatarImage src={userPhoto ?? undefined} />
                                        <AvatarFallback className="font-semibold text-primary-foreground">
                                            {userInitials || "?"}
                                        </AvatarFallback>
                                    </Avatar>
          <h1 className="font-medium">Project ready!</h1>
          <p>Hello {account && account.name}</p>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <Button className="mt-2">Button</Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}
