"use client"

import Link from "next/link";
import { Nav } from "../core/nav";
import { services } from "@/config/services";
import { TbArrowLeft, TbEye, TbLink, TbShieldLock, TbSend, TbExternalLink, TbLogin } from "react-icons/tb";
import { authClient } from "@/util/auth-client";
import { useEffect, useState } from "react";
import Altcha from "../core/altcha";

interface UserService {
  serviceId: string;
  serviceName: string;
  serviceDescription: string;
  priceStatus: string;
  joinLink?: string;
  grantedAt: string | null;
  isOpen: boolean;
}

interface ServiceRequest {
  id: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  adminNotes?: string;
  reviewedAt?: string;
  createdAt: string;
  serviceName: string;
  serviceDescription: string;
}

function HumanPriceStatus(priceStatus: "open" | "invite-only" | "by-request") {
  switch (priceStatus) {
    case "open":
      return "Open";
    case "invite-only":
      return "Invite only";
    case "by-request":
      return "By request";
  }
}

function HumanPriceStatusColor(priceStatus: "open" | "invite-only" | "by-request") {
  switch (priceStatus) {
    case "open":
      return "bg-green-500";
    case "invite-only":
      return "bg-yellow-500";
    case "by-request":
      return "bg-red-500";
  }
}

function getUserAccessStatusColor(hasAccess: boolean, requestStatus?: string) {
  if (hasAccess) return "bg-green-500";
  if (requestStatus === 'pending') return "bg-yellow-500";
  if (requestStatus === 'denied') return "bg-red-500";
  return "bg-gray-500";
}

function getUserAccessStatusText(hasAccess: boolean, requestStatus?: string) {
  if (hasAccess) return "You Have Access";
  if (requestStatus === 'pending') return "Request Pending";
  if (requestStatus === 'denied') return "Request Denied";
  return "No Access";
}

function PriceStatusDesc(priceStatus: "open" | "invite-only" | "by-request", serviceName: string) {
  switch (priceStatus) {
    case "open":
      return `${serviceName} is open for public, self-service registration.`;
    case "invite-only":
      return `${serviceName} is invite-only. Please request an invite from an admin.`;
    case "by-request":
      return `${serviceName} is by-request. You may request access from an admin.`;
  }
}

function getServiceButtonContent(
  service: { name: string; priceStatus: string; joinLink?: string } | undefined,
  session: { user: { id: string; email: string } } | null,
  hasAccess: boolean,
  joinLink: string | undefined,
  serviceRequest: ServiceRequest | undefined,
  setShowRequestForm: (show: boolean) => void
) {
  const isLoggedIn = !!session;

  if (isLoggedIn && hasAccess && joinLink) {
    return (
      <Link href={joinLink} target="_blank" rel="noopener noreferrer">
        <button className="flex flex-row items-center justify-center gap-1 text-white bg-green-600 px-3 py-1.5 rounded-lg text-sm hover:bg-green-700 transition-all duration-300 cursor-pointer">
          <TbExternalLink size={14} />
          Open
        </button>
      </Link>
    );
  }

  if (isLoggedIn && !hasAccess && (service?.priceStatus === 'by-request' || service?.priceStatus === 'invite-only')) {
    if (service?.priceStatus === 'by-request' && !serviceRequest) {
      return (
        <button
          onClick={() => setShowRequestForm(true)}
          className="flex flex-row items-center justify-center gap-1 text-white bg-blue-600 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition-all duration-300 cursor-pointer"
        >
          <TbSend size={14} />
          Request
        </button>
      );
    } else {
      return (
        <Link href="/requests">
          <button className="flex flex-row items-center justify-center gap-1 text-white bg-blue-600 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition-all duration-300 cursor-pointer">
            <TbSend size={14} />
            Request
          </button>
        </Link>
      );
    }
  }

  if (isLoggedIn && service?.priceStatus === 'open' && joinLink) {
    return (
      <Link href={joinLink} target="_blank" rel="noopener noreferrer">
        <button className="flex flex-row items-center justify-center gap-1 text-white bg-green-600 px-3 py-1.5 rounded-lg text-sm hover:bg-green-700 transition-all duration-300 cursor-pointer">
          <TbExternalLink size={14} />
          Join
        </button>
      </Link>
    );
  }

  if (!isLoggedIn && service?.priceStatus === 'open' && joinLink) {
    return (
      <Link href={joinLink} target="_blank" rel="noopener noreferrer">
        <button className="flex flex-row items-center justify-center gap-1 text-white bg-green-600 px-3 py-1.5 rounded-lg text-sm hover:bg-green-700 transition-all duration-300 cursor-pointer">
          <TbExternalLink size={14} />
          Join
        </button>
      </Link>
    );
  }

  if (!isLoggedIn && (service?.priceStatus === 'invite-only' || service?.priceStatus === 'by-request')) {
    return (
      <Link href="/login">
        <button className="flex flex-row items-center justify-center gap-1 text-white bg-blue-600 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition-all duration-300 cursor-pointer">
          <TbLogin size={14} />
          Login
        </button>
      </Link>
    );
  }

  return null;
}

export function ServicesShell({ slug }: { slug: string }) {
  const { data: session, isPending } = authClient.useSession();
  const [userAccess, setUserAccess] = useState<UserService[]>([]);
  const [userRequests, setUserRequests] = useState<ServiceRequest[]>([]);
  const [, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestReason, setRequestReason] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const service = services.find((service) => service.name === slug);
  const Icon = service?.icon;

  useEffect(() => {
    if (session) {
      fetchUserData();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [session, isPending]);

  const fetchUserData = async () => {
    try {
      const [accessResponse, requestsResponse] = await Promise.all([
        fetch("/api/user-services"),
        fetch("/api/service-requests")
      ]);

      if (accessResponse.ok) {
        const accessData = await accessResponse.json();
        setUserAccess(accessData.services);
      }

      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        setUserRequests(requestsData.requests);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitRequest = async () => {
    if (!requestReason.trim() || !captchaToken) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/service-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: service?.name,
          reason: requestReason,
          captchaToken
        }),
      });

      if (response.ok) {
        setShowRequestForm(false);
        setRequestReason("");
        setCaptchaToken("");
        fetchUserData();
      } else {
        const error = await response.json();
        console.error("Request failed:", error.error);
      }
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const hasAccess = userAccess.some(access => access.serviceName === service?.name);
  const userService = userAccess.find(access => access.serviceName === service?.name);
  const isOpen = userService?.isOpen || false;
  const serviceRequest = userRequests.find(request => request.serviceName === service?.name);
  const joinLink = hasAccess
    ? userAccess.find(access => access.serviceName === service?.name)?.joinLink || service?.joinLink
    : service?.joinLink;

  return (
    <main>
      <Nav />
      <div className="flex flex-col items-center justify-between gap-4 my-12 sm:my-20 px-4">
        <div className="flex flex-row items-center justify-between gap-2">
          {Icon && <Icon size={32} className="sm:w-9 sm:h-9" />}
          <h1 className="text-3xl sm:text-4xl font-bold">
            {service?.name}
          </h1>
        </div>
        <p className="text-base sm:text-lg text-center">
          {service?.description}
        </p>
        <Link href={`/services`}>
          <button className="flex flex-row items-center justify-between gap-2 text-blue-500 px-4 py-2 rounded-2xl hover:underline transition-all duration-300 cursor-pointer">
            <TbArrowLeft size={16} />
            Back to services
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 px-4 sm:px-8 lg:px-14">
        <div className={`flex flex-col justify-between gap-4 rounded-2xl px-6 sm:px-8 py-4 ${
          session ? getUserAccessStatusColor(hasAccess, serviceRequest?.status) : HumanPriceStatusColor(service?.priceStatus as "open" | "invite-only" | "by-request")
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full my-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">
              {session ? getUserAccessStatusText(hasAccess, serviceRequest?.status) : HumanPriceStatus(service?.priceStatus as "open" | "invite-only" | "by-request")}
            </h2>
            {getServiceButtonContent(service, session, hasAccess, joinLink, serviceRequest, setShowRequestForm)}
          </div>
          <div className="text-sm sm:text-base text-white mb-3">
            {session ? (
              hasAccess ? (
                <div>
                  <p>You have access to {service?.name}! Click the button above to get started.</p>
                  {isOpen && (
                    <p className="mt-2 text-xs opacity-80">
                      Open service: {service?.quickLinks && service.quickLinks.length > 0 ? "Create an account to get started" : "Available for public registration"}
                    </p>
                  )}
                </div>
              ) : serviceRequest ? (
                <div>
                  <p>Request Status: <strong>{serviceRequest.status}</strong></p>
                  {serviceRequest.adminNotes && (
                    <p className="mt-2">Admin Notes: {serviceRequest.adminNotes}</p>
                  )}
                  <p className="mt-2 text-xs">
                    Submitted: {new Date(serviceRequest.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p>{PriceStatusDesc(service?.priceStatus as "open" | "invite-only" | "by-request", service?.name as string)}</p>
              )
            ) : (
              <p>{PriceStatusDesc(service?.priceStatus as "open" | "invite-only" | "by-request", service?.name as string)} Please sign in to check your access status.</p>
            )}
          </div>
        </div>
        {showRequestForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Request Access to {service?.name}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Reason for Request</label>
                  <textarea
                    value={requestReason}
                    onChange={(e) => setRequestReason(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
                    rows={3}
                    placeholder="Please explain why you need access to this service..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Verify you&apos;re human</label>
                  <Altcha onStateChange={(ev) => {
                    if ('detail' in ev) {
                      setCaptchaToken(ev.detail.payload || "");
                    }
                  }} />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={submitRequest}
                    disabled={!requestReason.trim() || !captchaToken || submitting}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
                  >
                    {submitting ? "Submitting..." : "Submit Request"}
                  </button>
                  <button
                    onClick={() => setShowRequestForm(false)}
                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={`flex flex-col justify-between gap-4 rounded-2xl px-6 sm:px-8 py-4 bg-gray-200`}>
          <div className="flex flex-row items-center gap-2 w-full my-2">
            <h2 className="flex flex-row items-center gap-2 text-xl sm:text-2xl font-semibold text-black">
              <TbEye size={28} className="sm:w-8 sm:h-8" />
              What admins can see
            </h2>
          </div>
          {Object.entries((service?.adminView ?? {}) as Record<string, {
            icon: React.ElementType;
            description: string;
          }>)
            .filter(([, value]) => value !== undefined)
            .map(([key, value], index) => (
              <div className="flex flex-col w-full mb-2" key={index}>
                <p className="flex flex-row items-center gap-1 text-sm sm:text-base font-semibold text-black">
                  <value.icon size={16} /> {key}
                </p>
                <p className="text-xs sm:text-sm text-black">
                  {value.description}
                </p>
              </div>
            ))}
        </div>
        <div className={`flex flex-col gap-4 rounded-2xl px-6 sm:px-8 py-4 bg-gray-200`}>
          <div className="flex flex-row items-center gap-2 w-full my-2">
            <h2 className="flex flex-row items-center gap-2 text-xl sm:text-2xl font-semibold text-black">
              <TbShieldLock size={28} className="sm:w-8 sm:h-8" />
              Our commitment to privacy
            </h2>
          </div>
          <p className="text-sm sm:text-base text-black">
            Privacy is a big concern to us, too. That&apos;s why we:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm text-black">
            <li>Never share your data to third parties.</li>
            <li>Never use your data for advertising.</li>
            <li>Never use your data for any other purpose than to provide you with the service you have requested.</li>
            <li>Always delete data upon request.</li>
            <li>Provide additional options to manage your data.</li>
          </ul>
        </div>
        {service?.quickLinks && (
          <div className="flex flex-col gap-4 rounded-2xl px-6 sm:px-8 py-4 bg-gray-200">
            <div className="flex flex-row items-center gap-2 w-full my-2">
              <h2 className="flex flex-row items-center gap-2 text-xl sm:text-2xl font-semibold text-black">
                <TbLink size={28} className="sm:w-8 sm:h-8" />
                Quick Links
              </h2>
            </div>
            <ul className="list-disc list-inside text-sm sm:text-base text-black">
              {service?.quickLinks?.map((link, index) => (
                <Link href={link.url} key={index}>
                  <button className="flex flex-row items-center gap-2 text-black hover:underline transition-all duration-300 cursor-pointer">
                    <link.icon size={16} /> {link.name}
                  </button>
                </Link>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  )
}