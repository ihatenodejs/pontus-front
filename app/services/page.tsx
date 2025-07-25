"use client"

import { Nav } from "@/components/core/nav"
import { SiForgejo, SiJellyfin, SiOllama, SiVaultwarden } from "react-icons/si"
import { TbMail, TbServer, TbTool, TbKey, TbSend, TbExternalLink, TbInfoCircle } from "react-icons/tb"
import Link from "next/link"
import { useEffect, useState } from "react"
import { authClient } from "@/util/auth-client"

interface Service {
  id: string;
  name: string;
  description: string;
  priceStatus: string;
  joinLink?: string;
  enabled: boolean;
}

interface UserService {
  serviceId: string;
  serviceName: string;
  serviceDescription: string;
  priceStatus: string;
  joinLink?: string;
  grantedAt: string | null;
  isOpen: boolean;
}

const getServiceIcon = (serviceName: string) => {
  switch (serviceName.toLowerCase()) {
    case 'git':
      return SiForgejo;
    case 'tv':
      return SiJellyfin;
    case 'ai':
      return SiOllama;
    case 'mail':
    case 'email':
      return TbMail;
    case 'hosting':
      return TbServer;
    case 'keybox':
      return TbKey;
    case 'pass':
      return SiVaultwarden;
    default:
      return TbTool;
  }
};

export default function Services() {
  const { data: session, isPending } = authClient.useSession();
  const [services, setServices] = useState<Service[]>([]);
  const [userServices, setUserServices] = useState<UserService[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchServices();
    if (session) {
      fetchUserServices();
    }
  }, [session]);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      if (response.ok) {
        const data = await response.json();
        setServices(data.services);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserServices = async () => {
    try {
      const response = await fetch("/api/user-services");
      if (response.ok) {
        const data = await response.json();
        setUserServices(data.services);
      }
    } catch (error) {
      console.error("Error fetching user services:", error);
    }
  };

  const hasAccess = (serviceName: string) => {
    return userServices.some(userService => userService.serviceName === serviceName);
  };

  const getUserJoinLink = (serviceName: string) => {
    const userService = userServices.find(us => us.serviceName === serviceName);
    return userService?.joinLink;
  };

  const getServiceButtonContent = (service: Service) => {
    const isLoggedIn = !!session;
    const userHasAccess = hasAccess(service.name);
    const userJoinLink = getUserJoinLink(service.name);
    const joinLink = userJoinLink || service.joinLink;

    if (isLoggedIn && userHasAccess && joinLink) {
      return (
        <Link href={joinLink} target="_blank" rel="noopener noreferrer">
          <button className="flex flex-row items-center justify-center gap-1 text-white bg-green-600 px-3 py-1.5 rounded-lg text-sm hover:bg-green-700 transition-all duration-300 cursor-pointer">
            <TbExternalLink size={14} />
            Open
          </button>
        </Link>
      );
    }

    if (isLoggedIn && !userHasAccess && (service.priceStatus === 'by-request' || service.priceStatus === 'invite-only')) {
      return (
        <Link href="/requests">
          <button className="flex flex-row items-center justify-center gap-1 text-white bg-blue-600 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition-all duration-300 cursor-pointer">
            <TbSend size={14} />
            Request
          </button>
        </Link>
      );
    }

    if (isLoggedIn && service.priceStatus === 'open' && joinLink) {
      return (
        <Link href={joinLink} target="_blank" rel="noopener noreferrer">
          <button className="flex flex-row items-center justify-center gap-1 text-white bg-green-600 px-3 py-1.5 rounded-lg text-sm hover:bg-green-700 transition-all duration-300 cursor-pointer">
            <TbExternalLink size={14} />
            Join
          </button>
        </Link>
      );
    }

    if (!isLoggedIn && service.priceStatus === 'open' && joinLink) {
      return (
        <Link href={joinLink} target="_blank" rel="noopener noreferrer">
          <button className="flex flex-row items-center justify-center gap-1 text-white bg-green-600 px-3 py-1.5 rounded-lg text-sm hover:bg-green-700 transition-all duration-300 cursor-pointer">
            <TbExternalLink size={14} />
            Join
          </button>
        </Link>
      );
    }

    if (!isLoggedIn && (service.priceStatus === 'invite-only' || service.priceStatus === 'by-request')) {
      return (
        <Link href="/login">
          <button className="flex flex-row items-center justify-center gap-1 text-white bg-blue-600 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition-all duration-300 cursor-pointer">
            <TbSend size={14} />
            Request
          </button>
        </Link>
      );
    }

    return null;
  };

  const getServiceCardColor = (service: Service) => {
    const isLoggedIn = !!session;
    const userHasAccess = hasAccess(service.name);

    if (isLoggedIn && userHasAccess) {
      return "bg-green-400 text-white";
    }

    switch (service.priceStatus) {
      case 'open':
        return "bg-blue-400 text-white";
      case 'invite-only':
        return "bg-orange-400 text-white";
      case 'by-request':
        return "bg-purple-400 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  if (!mounted || isPending) {
    return (
      <main>
        <Nav />
        <div className="flex flex-col items-center justify-between gap-6 sm:gap-10 my-12 sm:my-16 px-4">
          <div className="flex flex-row items-center justify-between gap-2">
            <TbTool size={32} className="sm:w-9 sm:h-9" />
            <h1 className="text-3xl sm:text-4xl font-bold">
              services
            </h1>
          </div>
          <div className="flex flex-col items-center justify-between gap-2">
            <h2 className="text-2xl sm:text-3xl font-light text-center w-full flex flex-wrap items-center justify-center">
              please select a service.
            </h2>
          </div>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-pulse text-lg">Loading services...</div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Nav />
      <div className="flex flex-col items-center justify-between gap-6 sm:gap-10 my-12 sm:my-16 px-4">
        <div className="flex flex-row items-center justify-between gap-2">
          <TbTool size={32} className="sm:w-9 sm:h-9" />
          <h1 className="text-3xl sm:text-4xl font-bold">
            services
          </h1>
        </div>
        <div className="flex flex-col items-center justify-between gap-2">
          <h2 className="text-2xl sm:text-3xl font-light text-center w-full flex flex-wrap items-center justify-center">
            please select a service.
          </h2>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-pulse text-lg">Loading services...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-14 sm:gap-y-6 my-8 w-full max-w-6xl mx-auto px-4">
          {services.map((service) => {
            const IconComponent = getServiceIcon(service.name);

            return (
              <div key={service.id} className="group">
                <Link href={`/services/${service.name}`} className="block">
                  <div className={`flex flex-col gap-4 text-base sm:text-lg px-6 sm:px-8 py-6 sm:py-8 rounded-2xl transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-xl cursor-pointer ${getServiceCardColor(service)} shadow-lg hover:shadow-2xl`}>
                    <div className="flex flex-row items-center gap-3">
                      <IconComponent size={32} className="sm:w-10 sm:h-10" />
                      <span className="text-xl sm:text-2xl font-bold">
                        {service.name === 'mail' ? 'email' : service.name}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base opacity-90 line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                </Link>
                <div className="flex flex-row mt-4 gap-3 justify-center">
                  {getServiceButtonContent(service)}
                  <Link href={`/services/${service.name}`}>
                    <button className="flex flex-row items-center justify-center gap-1 text-white bg-gray-600 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-700 transition-all duration-300 cursor-pointer">
                      <TbInfoCircle size={14} />
                      Info
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  )
}
