"use client"

import { Geist, Geist_Mono } from "next/font/google";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { useSocketStore } from "@/store/socketStore";
import "./globals.css";
import SocketInit from "./SocketInit";

// 🎨 Font configuration
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🏗️ Root layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* 🔥 This runs once per tab, not per page */}
            <header>
              {/* 🔓 Show sign in/up for non-authenticated users */}
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              {/* 🔐 Show user button for authenticated users */}
              <SignedIn>
                <UserButton />
              </SignedIn>
          {/* 🔌 Initialize socket connection */}
          <SocketInit />
            </header>
            {children}
         
        </body>
      </html>
    </ClerkProvider>
  );
}
