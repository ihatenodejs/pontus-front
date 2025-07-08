"use client"

import Link from "next/link";
import { authClient } from "@/util/auth-client";
import { useRouter } from "next/navigation";

interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  role?: string;
}

export function Nav() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
      await authClient.signOut();
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-5 py-3 gap-3 sm:gap-0">
      <Link href="/">
        <h1 className="text-2xl sm:text-3xl font-bold font-mono">
          p0ntus
        </h1>
      </Link>
      <div className="flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 text-sm sm:text-base">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/about" className="hover:underline">About</Link>
        <Link href="/servers" className="hover:underline">Servers</Link>
        <Link href="/services" className="hover:underline">Services</Link>
        {isPending ? (
          <div className="text-gray-500">Loading...</div>
        ) : session ? (
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <Link href="/requests" className="hover:underline">Requests</Link>
            {(session.user as ExtendedUser).role === 'admin' && (
              <Link href="/admin" className="hover:underline text-red-500">Admin</Link>
            )}
            <span className="text-foreground-muted-light ml-6">Hi, <span className="font-bold text-foreground">{session.user.name || session.user.email}</span></span>
            <button
              onClick={handleSignOut}
              className="text-red-400 hover:underline cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="hover:underline">Login</Link>
            <Link href="/signup" className="bg-blue-400 text-white px-3 py-1 rounded-md hover:bg-blue-500">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}