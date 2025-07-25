"use client"

import { Nav } from "@/components/core/nav";
import Altcha from "@/components/core/altcha";
import { authClient } from "@/util/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  TbSend,
  TbClock,
  TbCheck,
  TbX,
  TbEye,
  TbNotes,
  TbInfoCircle,
} from "react-icons/tb";
import Link from "next/link";

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

interface Service {
  id: string;
  name: string;
  description: string;
  priceStatus: string;
  joinLink?: string;
  enabled: boolean;
}

export default function ServiceRequests() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [mounted, setMounted] = useState(false);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [userServices, setUserServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [reason, setReason] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isPending && !session) {
      router.push("/login?message=Please sign in to access service requests");
    }
  }, [session, isPending, mounted, router]);

  useEffect(() => {
    if (session) {
      fetchRequests();
      fetchUserServices();
      fetchServices();
    }
  }, [session]);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/service-requests");
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserServices = async () => {
    try {
      const response = await fetch("/api/user-services");
      if (response.ok) {
        const data = await response.json();
        setUserServices(data.services.map((s: { serviceName: string }) => s.serviceName));
      }
    } catch (error) {
      console.error("Error fetching user services:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      if (response.ok) {
        const data = await response.json();
        setServices(data.services);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !reason || !captchaToken) {
      setMessage("Please fill in all fields and complete the captcha");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/service-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: selectedService,
          reason,
          captchaToken
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Request submitted successfully!");
        setSelectedService("");
        setReason("");
        setCaptchaToken("");
        fetchRequests();
      } else {
        setMessage(data.error || "Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      setMessage("An error occurred while submitting the request");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <TbClock className="w-5 h-5 text-yellow-500" />;
      case 'approved':
        return <TbCheck className="w-5 h-5 text-green-500" />;
      case 'denied':
        return <TbX className="w-5 h-5 text-red-500" />;
      default:
        return <TbClock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'denied':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!mounted || isPending) {
    return (
      <main>
        <Nav />
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
          <div className="animate-pulse text-lg">loading...</div>
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

  return (
    <main>
      <Nav />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-row items-center justify-start gap-3 mb-8">
          <TbSend size={32} className="text-blue-500" />
          <h1 className="text-3xl sm:text-4xl font-bold">Service Requests</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
            <h2 className="text-xl font-semibold mb-4">Request Service Access</h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700 mb-6">
              <div className="flex items-start gap-3">
                <TbInfoCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Note:</strong> Open services (like Git and Mail) don&apos;t require requests - you already have access!
                    Visit the <Link href="/dashboard" className="underline hover:no-underline">dashboard</Link> to see your available services
                    and create accounts directly.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="service" className="block text-sm font-medium mb-2">
                  Service
                </label>
                <select
                  id="service"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                  required
                >
                  <option value="">Select a service</option>
                  {services
                    .filter(s => (s.priceStatus === "by-request" || s.priceStatus === "invite-only") && !userServices.includes(s.name))
                    .map((service) => (
                    <option key={service.name} value={service.name}>
                      {service.name.charAt(0).toUpperCase() + service.name.slice(1)} - {service.description}
                    </option>
                  ))}
                </select>
                {services.filter(s => (s.priceStatus === "by-request" || s.priceStatus === "invite-only") && !userServices.includes(s.name)).length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    No services require requests at this time. All available services are either open or you already have access.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-medium mb-2">
                  Reason for Request
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                  placeholder="Please explain why you need access to this service..."
                  required
                />
              </div>

              <div>
                <Altcha onStateChange={(ev) => {
                  if ('detail' in ev) {
                    setCaptchaToken(ev.detail.payload || "");
                  }
                }} />
              </div>

              <button
                type="submit"
                disabled={submitting || !selectedService || !reason || !captchaToken}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <TbSend className="w-4 h-4" />
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </form>

            {message && (
              <div className={`mt-4 p-3 rounded-lg ${message.includes("success") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {message}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TbEye className="w-5 h-5" />
              My Requests
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-pulse">Loading requests...</div>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No requests found. Submit your first request above!
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {request.serviceName.charAt(0).toUpperCase() + request.serviceName.slice(1)}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {request.serviceDescription}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="text-sm font-medium capitalize">{request.status}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reason:</p>
                      <p className="text-sm">{request.reason}</p>
                    </div>

                    {request.adminNotes && (
                      <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                          <TbNotes className="w-4 h-4" />
                          Admin Notes:
                        </p>
                        <p className="text-sm">{request.adminNotes}</p>
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      Submitted: {new Date(request.createdAt).toLocaleDateString()}
                      {request.reviewedAt && (
                        <span className="ml-4">
                          Reviewed: {new Date(request.reviewedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
