import { Nav } from "@/components/core/nav";
import { TbServer } from "react-icons/tb";
import Flag from 'react-world-flags';

export default function Servers() {
  return (
    <main>
      <Nav />
      <div className="flex flex-col items-center justify-between gap-3 my-20">
        <div className="flex flex-row items-center justify-between gap-2">
          <TbServer size={36} />
          <h1 className="text-4xl font-bold">
            servers and infrastructure
          </h1>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between gap-3 my-20">
        <h2 className="text-2xl font-semibold text-center w-full flex flex-wrap items-center justify-center">
          where we host out of
        </h2>
        <div className="grid grid-cols-3 gap-4 my-4">
          <p className="flex flex-row items-center justify-between gap-2 text-lg bg-blue-400 text-white px-4 py-2 rounded-full">
            <Flag code="US" className="w-6 h-6" /> usa
          </p>
          <p className="flex flex-row items-center justify-between gap-2 text-lg bg-red-400 text-white px-4 py-2 rounded-full">
            <Flag code="CA" className="w-6 h-6" /> canada
          </p>
          <p className="flex flex-row items-center justify-between gap-2 text-lg bg-orange-400 text-white px-4 py-2 rounded-full">
            <Flag code="DE" className="mr-4 w-6 h-6" /> germany
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-center w-full flex flex-wrap items-center justify-center">
          hardware
        </h2>
        <div className="grid grid-cols-3 gap-4 my-4 w-5xl">
          <div className="flex flex-col gap-2 text-lg bg-blue-400 text-white px-8 py-8 rounded-4xl">
            <div className="flex flex-row items-center justify-between gap-2">
              <TbServer size={36} />
              <span className="text-2xl font-bold">
                NY-1
              </span>
            </div>
            <p className="flex flex-col text-sm my-2 gap-4">
              <span><span className="font-bold">CPU:</span> 2x Intel Xeon E5-2699 v4 @ 3.60 GHz</span>
              <span><span className="font-bold">RAM:</span> 256GB (8x Samsung 32GB DDR4)</span>
              <span><span className="font-bold">Boot Drive:</span> Samsung Evo 850 250GB</span>
              <span><span className="font-bold">Storage:</span> HP FX900 Pro 4TB NVMe</span>
              <span><span className="font-bold">Bandwidth:</span> 40TB</span>
              <span><span className="font-bold">Location:</span> Buffalo, New York, USA</span>
              <span><span className="font-bold">Provider:</span> ColoCrossing</span>
            </p>
          </div>
          <div className="flex flex-col gap-2 text-lg bg-red-400 text-white px-8 py-8 rounded-4xl">
            <div className="flex flex-row items-center justify-between gap-2">
              <TbServer size={36} />
              <span className="text-2xl font-bold">
                CA-1
              </span>
            </div>
            <p className="flex flex-col text-sm my-2 gap-4">
              <span><span className="font-bold">CPU:</span> 2 cores shared</span>
              <span><span className="font-bold">RAM:</span> 2GB</span>
              <span><span className="font-bold">Disk:</span> 3.5TB Raidz2</span>
              <span><span className="font-bold">Storage:</span> HP FX900 Pro 4TB NVMe</span>
              <span><span className="font-bold">Bandwidth:</span> Unlimited @ 250Mbps</span>
              <span><span className="font-bold">Location:</span> Montreal, Canada</span>
              <span><span className="font-bold">Provider:</span> Serverica</span>
            </p>
          </div>
          <div className="flex flex-col gap-2 text-lg bg-orange-400 text-white px-8 py-8 rounded-4xl">
            <div className="flex flex-row items-center justify-between gap-2">
              <TbServer size={36} />
              <span className="text-2xl font-bold">
                DE-1
              </span>
            </div>
            <p className="flex flex-col text-sm my-2 gap-4">
              <span><span className="font-bold">CPU:</span> 1vCPU AMD EPYC</span>
              <span><span className="font-bold">RAM:</span> 1GB</span>
              <span><span className="font-bold">Storage:</span> 153GB</span>
              <span><span className="font-bold">Location:</span> Frankfurt, Germany</span>
              <span><span className="font-bold">Bandwidth:</span> Unlimited</span>
              <span><span className="font-bold">Provider:</span> Oracle Cloud</span>
            </p>
          </div>
          <div className="flex flex-col gap-2 text-lg bg-orange-400 text-white px-8 py-8 rounded-4xl">
            <div className="flex flex-row items-center justify-between gap-2">
              <TbServer size={36} />
              <span className="text-2xl font-bold">
                DE-2
              </span>
            </div>
            <p className="flex flex-col text-sm my-2 gap-4">
              <span><span className="font-bold">CPU:</span> 1vCPU AMD EPYC</span>
              <span><span className="font-bold">RAM:</span> 1GB</span>
              <span><span className="font-bold">Storage:</span> 47GB</span>
              <span><span className="font-bold">Location:</span> Frankfurt, Germany</span>
              <span><span className="font-bold">Bandwidth:</span> Unlimited</span>
              <span><span className="font-bold">Provider:</span> Oracle Cloud</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 my-20">
          <h2 className="text-2xl font-semibold text-center w-full flex flex-wrap items-center justify-center">
            our ip addresses
          </h2>
          <p className="text-center text-md my-2">
            if you own a mail server/service, please consider whitelisting our ip addresses.
          </p>
          <div className="grid grid-cols-3 gap-4 my-4">
            <p className="flex flex-row items-center gap-2 text-lg bg-blue-400 text-white px-4 py-2 rounded-full">
              <Flag code="US" className="w-6 h-6" /> <span className="font-bold">NY1:</span> 192.3.178.206
            </p>
            <p className="flex flex-row items-center gap-2 text-lg bg-red-400 text-white px-4 py-2 rounded-full">
              <Flag code="CA" className="w-6 h-6" /> <span className="font-bold">CA1:</span> 209.209.9.109
            </p>
            <p className="flex flex-row items-center gap-2 text-lg bg-orange-400 text-white px-4 py-2 rounded-full">
              <Flag code="DE" className="w-6 h-6" /> <span className="font-bold">DE1:</span> 138.2.154.209
            </p>
            <p className="flex flex-row items-center gap-2 text-lg bg-orange-400 text-white px-4 py-2 rounded-full">
              <Flag code="DE" className="w-6 h-6" /> <span className="font-bold">DE2:</span> 158.180.60.92
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}