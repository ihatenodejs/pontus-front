import { Nav } from "@/components/core/nav"
import { SiForgejo, SiJellyfin, SiOllama } from "react-icons/si"
import { TbKey, TbMail, TbServer, TbTool } from "react-icons/tb"
import Link from "next/link"

export default function Services() {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-4 w-full max-w-6xl mx-auto px-4">
        <Link href="/services/git">
          <div className="flex flex-col gap-2 text-base sm:text-lg bg-blue-400 text-white px-6 sm:px-8 py-6 sm:py-8 rounded-2xl sm:rounded-4xl hover:bg-blue-500 transition-colors">
            <div className="flex flex-row items-center justify-between gap-2">
              <SiForgejo size={28} className="sm:w-9 sm:h-9" />
              <span className="text-xl sm:text-2xl font-bold">
                git
              </span>
            </div>
          </div>
        </Link>
        <Link href="/services/mail">
          <div className="flex flex-col gap-2 text-base sm:text-lg bg-blue-400 text-white px-6 sm:px-8 py-6 sm:py-8 rounded-2xl sm:rounded-4xl hover:bg-blue-500 transition-colors">
            <div className="flex flex-row items-center justify-between gap-2">
              <TbMail size={28} className="sm:w-9 sm:h-9" />
              <span className="text-xl sm:text-2xl font-bold">
                email
              </span>
            </div>
          </div>
        </Link>
        <Link href="/services/ai">
          <div className="flex flex-col gap-2 text-base sm:text-lg bg-blue-400 text-white px-6 sm:px-8 py-6 sm:py-8 rounded-2xl sm:rounded-4xl hover:bg-blue-500 transition-colors">
            <div className="flex flex-row items-center justify-between gap-2">
              <SiOllama size={28} className="sm:w-9 sm:h-9" />
              <span className="text-xl sm:text-2xl font-bold">
                ai
              </span>
            </div>
          </div>
        </Link>
        <Link href="/services/tv">
          <div className="flex flex-col gap-2 text-base sm:text-lg bg-blue-400 text-white px-6 sm:px-8 py-6 sm:py-8 rounded-2xl sm:rounded-4xl hover:bg-blue-500 transition-colors">
            <div className="flex flex-row items-center justify-between gap-2">
              <SiJellyfin size={28} className="sm:w-9 sm:h-9" />
              <span className="text-xl sm:text-2xl font-bold">
                tv
              </span>
            </div>
          </div>
        </Link>
        <Link href="/services/keybox">
          <div className="flex flex-col gap-2 text-base sm:text-lg bg-blue-400 text-white px-6 sm:px-8 py-6 sm:py-8 rounded-2xl sm:rounded-4xl hover:bg-blue-500 transition-colors">
            <div className="flex flex-row items-center justify-between gap-2">
              <TbKey size={28} className="sm:w-9 sm:h-9" />
              <span className="text-xl sm:text-2xl font-bold">
                keybox
              </span>
            </div>
          </div>
        </Link>
        <Link href="/services/hosting">
          <div className="flex flex-col gap-2 text-base sm:text-lg bg-blue-400 text-white px-6 sm:px-8 py-6 sm:py-8 rounded-2xl sm:rounded-4xl hover:bg-blue-500 transition-colors">
            <div className="flex flex-row items-center justify-between gap-2">
              <TbServer size={28} className="sm:w-9 sm:h-9" />
              <span className="text-xl sm:text-2xl font-bold">
                hosting
              </span>
            </div>
          </div>
        </Link>
      </div>
    </main>
  )
}
