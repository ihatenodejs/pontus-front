"use client"

import Link from "next/link";
import { SiForgejo, SiJellyfin, SiOllama, SiVaultwarden } from "react-icons/si";
import { TbMail, TbKey, TbServer, TbArrowRight, TbTool } from "react-icons/tb";
import { Nav } from "@/components/core/nav";
import { useEffect, useState } from "react";

interface Service {
  id: string;
  name: string;
  description: string;
  priceStatus: string;
  joinLink?: string;
  enabled: boolean;
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
    case 'pass':
      return SiVaultwarden;
    case 'keybox':
      return TbKey;
    default:
      return TbTool;
  }
};

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      if (response.ok) {
        const data = await response.json();
        setServices(data.services.slice(0, 6));
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Nav />
      <div className="flex flex-col items-center justify-center gap-10 sm:gap-16 my-8 sm:my-12 px-4">
        <div className="flex flex-col items-center justify-center gap-4 sm:gap-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold">
            p0ntus
          </h1>
          <p className="text-lg sm:text-2xl font-light max-w-2xl">
            a simple platform for privacy-conscious users who want to take control of their digital life
          </p>
        </div>
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-center items-start gap-8 lg:gap-12">
            <div className="flex flex-col items-center justify-start gap-6 w-full lg:max-w-md">
              <h2 className="text-2xl sm:text-3xl font-bold text-center w-full">Services</h2>
              <h3 className="text-lg sm:text-xl italic text-center w-full text-gray-600 hidden sm:block">what can we offer you?</h3>
              {loading ? (
                <div className="animate-pulse text-lg">Loading services...</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 my-6 sm:my-8">
                  {services.map((service) => {
                    const IconComponent = getServiceIcon(service.name);
                    return (
                      <div key={service.id} className="flex flex-col items-center justify-center gap-3">
                        <Link href={`/services/${service.name}`} className="flex flex-col items-center gap-2 hover:opacity-75 transition-opacity">
                          <IconComponent size={40} className="sm:w-12 sm:h-12" />
                          <h3 className="text-base sm:text-lg font-bold">{service.name}</h3>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-col items-center justify-start gap-6 w-full lg:max-w-md">
              <h2 className="text-2xl sm:text-3xl font-bold text-center w-full">Where we are</h2>
              <h3 className="text-lg sm:text-xl italic text-center w-full text-gray-600 hidden sm:block">how can you find us?</h3>
              <div className="flex flex-col items-center gap-6 mt-6">
                <p className="text-base sm:text-lg text-center">
                  p0ntus is fully on the public internet! our servers are mainly located in the united states.
                </p>
                <p className="text-base sm:text-lg text-center">
                  we also operate servers in the united states, canada and germany.
                </p>
                <Link href="/servers" className="flex flex-row items-center gap-2 text-base sm:text-lg text-center text-blue-500 hover:underline transition-colors">
                  our servers <TbArrowRight size={20} />
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-center justify-start gap-6 w-full lg:max-w-md">
              <h2 className="text-2xl sm:text-3xl font-bold text-center w-full">Why is p0ntus free?</h2>
              <h3 className="text-lg sm:text-xl italic text-center w-full text-gray-600 hidden sm:block">what&apos;s the point?</h3>
              <div className="flex flex-col items-center gap-6 mt-6">
                <p className="text-base sm:text-lg text-center">
                  everything today includes microtransactions, and we were fed up with it.
                </p>
                <p className="text-base sm:text-lg text-center">
                  p0ntus exists to show that it is possible to have a free and open set of services that people have fun using.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
