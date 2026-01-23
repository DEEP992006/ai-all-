"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthSyncPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) return;

    const sync = async () => {
      try {
        await fetch("/api/user/sync", {
          method: "POST",
        });
      } finally {
        router.replace("/dashboard"); // instant redirect
      }
    };

    sync();
    router.push("/dashboard")
  }, [isSignedIn, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      Setting up your account…
    </div>
  );
}
