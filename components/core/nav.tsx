"use client"

import Link from "next/link";
import { authClient } from "@/util/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TbMenu2, TbX } from "react-icons/tb";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <nav className="relative">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3">
        <Link href="/">
          <h1 className="text-2xl sm:text-3xl font-bold font-mono">
            p0ntus
          </h1>
        </Link>

        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <TbX size={24} /> : <TbMenu2 size={24} />}
        </button>

        <div className="hidden md:flex flex-row items-center gap-4 text-sm lg:text-base">
          <Link href="/" className="hover:underline transition-colors">Home</Link>
          <Link href="/about" className="hover:underline transition-colors">About</Link>
          <Link href="/servers" className="hover:underline transition-colors">Servers</Link>
          <Link href="/services" className="hover:underline transition-colors">Services</Link>
          {isPending ? (
            <div className="text-gray-500 dark:text-gray-400 animate-pulse">Loading...</div>
          ) : session ? (
            <div className="flex items-center gap-3 lg:gap-4">
              <Link href="/dashboard" className="hover:underline transition-colors">Dashboard</Link>
              <Link href="/requests" className="hover:underline transition-colors">Requests</Link>
              {(session.user as ExtendedUser).role === 'admin' && (
                <Link href="/admin" className="hover:underline text-red-500 transition-colors">Admin</Link>
              )}
              <div className="hidden lg:flex items-center gap-3 ml-4">
                <span className="text-gray-600 dark:text-gray-300">Hi, <span className="font-bold text-gray-900 dark:text-gray-100">{session.user.name || session.user.email}</span></span>
                <button
                  onClick={handleSignOut}
                  className="text-red-400 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:underline cursor-pointer transition-colors"
                >
                  Sign Out
                </button>
              </div>
              <div className="lg:hidden">
                <button
                  onClick={handleSignOut}
                  className="text-red-400 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:underline cursor-pointer transition-colors text-sm"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="hover:underline transition-colors">Login</Link>
              <Link href="/signup" className="bg-blue-500 dark:bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="hover:underline transition-colors py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="hover:underline transition-colors py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/servers"
              className="hover:underline transition-colors py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Servers
            </Link>
            <Link
              href="/services"
              className="hover:underline transition-colors py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </Link>

            {isPending ? (
              <div className="text-gray-500 dark:text-gray-400 animate-pulse py-1">Loading...</div>
            ) : session ? (
              <div className="flex flex-col gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/dashboard"
                  className="hover:underline transition-colors py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/requests"
                  className="hover:underline transition-colors py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Requests
                </Link>
                {(session.user as ExtendedUser).role === 'admin' && (
                  <Link
                    href="/admin"
                    className="hover:underline text-red-500 transition-colors py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <div className="py-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300 text-sm block mb-2">
                    Hi, <span className="font-bold text-gray-900 dark:text-gray-100">{session.user.name || session.user.email}</span>
                  </span>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-red-400 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:underline cursor-pointer transition-colors text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/login"
                  className="hover:underline transition-colors py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-500 dark:bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}