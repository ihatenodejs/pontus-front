import Link from "next/link";
import { Nav } from "../core/nav";
import { services } from "@/config/services";
import { TbArrowLeft, TbEye, TbLink, TbShieldLock } from "react-icons/tb";

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

export function ServicesShell({ slug }: { slug: string }) {
  const service = services.find((service) => service.name === slug);
  const Icon = service?.icon;

  return (
    <main>
      <Nav />
      <div className="flex flex-col items-center justify-between gap-4 my-20">
        <div className="flex flex-row items-center justify-between gap-2">
          {Icon && <Icon size={36} />}
          <h1 className="text-4xl font-bold">
            {service?.name}
          </h1>
        </div>
        <p className="text-lg">
          {service?.description}
        </p>
        <Link href={`/services`}>
          <button className="flex flex-row items-center justify-between gap-2 text-blue-500 px-4 py-2 rounded-2xl hover:underline transition-all duration-300 cursor-pointer">
            <TbArrowLeft size={16} />
            Back to services
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-4 px-14">
        <div className={`flex flex-col justify-between gap-4 rounded-2xl px-8 py-4 ${HumanPriceStatusColor(service?.priceStatus as "open" | "invite-only" | "by-request")}`}>
          <div className="flex flex-row items-center justify-between gap-2 w-full my-2">
            <h2 className="text-2xl font-semibold text-white">
              {HumanPriceStatus(service?.priceStatus as "open" | "invite-only" | "by-request")}
            </h2>
            {service?.joinLink && (
              <Link href={service.joinLink}>
                <button className="flex flex-row items-center justify-between gap-2 text-white bg-green-600 px-4 py-2 rounded-full hover:underline transition-all duration-300 cursor-pointer">
                  Join!
                </button>
              </Link>
            )}
          </div>
          <p className="text-md text-white mb-3">
            {PriceStatusDesc(service?.priceStatus as "open" | "invite-only" | "by-request", service?.name as string)}
          </p>
        </div>
        <div className={`flex flex-col justify-between gap-4 rounded-2xl px-8 py-4 bg-gray-200`}>
          <div className="flex flex-row items-center gap-2 w-full my-2">
            <h2 className="flex flex-row items-center gap-2 text-2xl font-semibold text-black">
              <TbEye size={32} />
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
                <p className="flex flex-row items-center gap-1 text-md font-semibold text-black">
                  <value.icon size={16} /> {key}
                </p>
                <p className="text-sm text-black">
                  {value.description}
                </p>
              </div>
            ))}
        </div>
        <div className={`flex flex-col gap-4 rounded-2xl px-8 py-4 bg-gray-200`}>
          <div className="flex flex-row items-center gap-2 w-full my-2">
            <h2 className="flex flex-row items-center gap-2 text-2xl font-semibold text-black">
              <TbShieldLock size={32} />
              Our commitment to privacy
            </h2>
          </div>
          <p className="text-md text-black">
            Privacy is a big concern to us, too. That&apos;s why we:
          </p>
          <ul className="list-disc list-inside text-sm text-black">
            <li>Never share your data to third parties.</li>
            <li>Never use your data for advertising.</li>
            <li>Never use your data for any other purpose than to provide you with the service you have requested.</li>
            <li>Always delete data upon request.</li>
            <li>Provide additional options to manage your data.</li>
          </ul>
        </div>
        {service?.quickLinks && (
          <div className="flex flex-col gap-4 rounded-2xl px-8 py-4 bg-gray-200">
            <div className="flex flex-row items-center gap-2 w-full my-2">
              <h2 className="flex flex-row items-center gap-2 text-2xl font-semibold text-black">
                <TbLink size={32} />
                Quick Links
              </h2>
            </div>
            <ul className="list-disc list-inside text-md text-black">
              {service.quickLinks.map((link, index) => (
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