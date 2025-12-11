"use client";

import { Nav } from "@/components/core/nav";
import { authClient } from "@/util/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SiForgejo, SiJellyfin, SiOllama } from "react-icons/si";
import {
  TbDashboard,
  TbUser,
  TbMail,
  TbCalendar,
  TbShield,
  TbDeviceTv,
  TbExternalLink,
  TbServer,
  TbCheck,
  TbReceipt,
} from "react-icons/tb";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [mounted, setMounted] = useState(false);
  const [userServices, setUserServices] = useState<string[]>([]);
  const [openServices, setOpenServices] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect -- Client-side hydration check
  }, []);

  useEffect(() => {
    if (mounted && !isPending && !session) {
      router.push("/login?message=Please sign in to access the dashboard");
    }
  }, [session, isPending, mounted, router]);

  const fetchUserServices = useCallback(async () => {
    try {
      const response = await fetch("/api/user-services");
      if (response.ok) {
        const data = await response.json();
        const services = data.services;
        setUserServices(
          services.map((s: { serviceName: string }) => s.serviceName)
        );
        setOpenServices(
          services
            .filter((s: { isOpen: boolean }) => s.isOpen)
            .map((s: { serviceName: string }) => s.serviceName)
        );
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchUserServices(); // eslint-disable-line react-hooks/set-state-in-effect -- Fetching user services from API on session change
    }
  }, [session, fetchUserServices]);

  if (!mounted || isPending) {
    return (
      <main>
        <Nav />
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
          <div className="animate-pulse text-lg">loading dashboard...</div>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main>
        <Nav />
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
          <div className="text-lg">redirecting to login...</div>
        </div>
      </main>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <main>
      <Nav />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-row items-center justify-start gap-3 mb-8">
          <TbDashboard size={32} className="text-blue-500" />
          <h1 className="text-3xl sm:text-4xl font-bold">Dashboard</h1>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl mb-8">
          <h2 className="text-2xl font-semibold">
            Welcome back, {session.user.name || "User"}! 👋
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ServiceCard
            title="TV"
            icon={<TbDeviceTv />}
            link="https://tv.ihate.college"
            signupType="request"
            signupLink="https://t.me/p0ntus"
            hasAccess={userServices.includes("tv")}
            isOpen={openServices.includes("tv")}
          />
          <ServiceCard
            title="TV Requests"
            icon={<SiJellyfin />}
            link="https://requests.ihate.college"
            signupType="request"
            signupLink="https://t.me/p0ntus"
            hasAccess={userServices.includes("tv")}
            isOpen={openServices.includes("tv")}
          />
          <ServiceCard
            title="Git"
            icon={<SiForgejo />}
            link="https://git.p0ntus.com"
            signupType="self"
            signupLink="https://git.p0ntus.com/user/sign_up"
            hasAccess={userServices.includes("git")}
            isOpen={openServices.includes("git")}
          />
          <ServiceCard
            title="Mail"
            icon={<TbMail />}
            link="https://pontusmail.org"
            signupType="self"
            signupLink="https://pontusmail.org/admin/user/signup"
            hasAccess={userServices.includes("mail")}
            isOpen={openServices.includes("mail")}
          />
          <ServiceCard
            title="AI"
            icon={<SiOllama />}
            link="https://ai.ihate.college"
            signupType="request"
            signupLink="https://t.me/p0ntus"
            hasAccess={userServices.includes("ai")}
            isOpen={openServices.includes("ai")}
          />
          <ServiceCard
            title="Hosting"
            icon={<TbServer />}
            signupType="request"
            signupLink="https://t.me/p0ntus"
            hasAccess={userServices.includes("hosting")}
            isOpen={openServices.includes("hosting")}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl justify-between shadow-sm border border-gray-200 dark:border-gray-700 flex flex-row items-center gap-3 mb-8">
          <h3 className="text-xl font-semibold">Need access to a service?</h3>
          <Link
            href="/requests"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <TbReceipt className="w-4 h-4" />
            Make a Request
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <TbUser className="text-blue-500 w-6 h-6" />
              <h3 className="text-xl font-semibold">My Profile</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TbUser className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Name:</span>
                <span className="font-medium">
                  {session.user.name || "Not provided"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TbMail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Email:</span>
                <span className="font-medium">{session.user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <TbShield className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Email Verified:</span>
                <span
                  className={`font-medium ${
                    session.user.emailVerified
                      ? "text-green-600"
                      : "text-orange-500"
                  }`}
                >
                  {session.user.emailVerified ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <TbCalendar className="text-green-500 w-6 h-6" />
              <h3 className="text-xl font-semibold">Account Details</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TbCalendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Account Created:</span>
                <span className="font-medium text-sm">
                  {formatDate(session.user.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TbCalendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Last Updated:</span>
                <span className="font-medium text-sm">
                  {formatDate(session.user.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ServiceCard({
  title,
  icon,
  link,
  signupType,
  signupLink,
  hasAccess,
  isOpen,
}: {
  title: string;
  icon: React.ReactNode;
  link?: string;
  signupType: "request" | "self" | "invite";
  signupLink: string;
  hasAccess: boolean;
  isOpen: boolean;
}) {
  const cardClassName = hasAccess
    ? "bg-green-50 dark:bg-green-900/20 p-6 rounded-xl shadow-sm border border-green-200 dark:border-green-700"
    : "bg-red-50 dark:bg-red-900/20 p-6 rounded-xl shadow-sm border border-red-200 dark:border-red-700";

  return (
    <div className={cardClassName}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => hasAccess && link && window.open(link, "_blank")}
        >
          {icon}
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        {hasAccess && link && (
          <div className="flex items-center gap-2">
            <TbExternalLink
              className="text-blue-500 w-6 h-6 cursor-pointer"
              onClick={() => window.open(link, "_blank")}
            />
          </div>
        )}
      </div>
      {hasAccess ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <TbCheck className="w-4 h-4" />
            <span className="text-sm font-medium">Access granted</span>
          </div>
          {isOpen && (
            <p className="text-sm text-gray-500">
              Open service:{" "}
              <Link href={signupLink} className="text-blue-500 hover:underline">
                {signupType === "request"
                  ? "Request account"
                  : "Create account"}
              </Link>
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-4">
          Need an account?{" "}
          <Link href={signupLink} className="text-blue-500 hover:underline">
            {signupType === "request" ? "Request one!" : "Sign up!"}
          </Link>
        </p>
      )}
    </div>
  );
}
