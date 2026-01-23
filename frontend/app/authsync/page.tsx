"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// 🔄 Auth sync page - syncs user data with database after sign in/up
export default function AuthSyncPage() {
  // 🔐 Get authentication state
  const { isSignedIn } = useAuth();
  const router = useRouter();

  // 🔄 Sync user data on mount
  useEffect(() => {
    if (!isSignedIn) return;

    // 📡 Call sync API to create/update user in database
    const sync = async () => {
      try {
        await fetch("/api/user/sync", {
          method: "POST",
        });
      } finally {
        router.replace("/dashboard"); // ⚡ instant redirect
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
