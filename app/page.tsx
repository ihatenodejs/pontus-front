import Link from "next/link";
import { SiForgejo, SiJellyfin, SiOllama } from "react-icons/si";
import { TbMail, TbKey, TbServer, TbArrowRight } from "react-icons/tb";
import { Nav } from "@/components/core/nav";

export default function Home() {
  return (
    <main>
      <Nav />
      <div className="flex flex-col items-center justify-between gap-3 my-20">
        <h1 className="text-4xl font-bold">
          p0ntus
        </h1>
        <h3 className="text-2xl">
          open source at your fingertips
        </h3>
      </div>
      <hr className="border-black mt-24 mb-24" />
      <div className="max-w-6xl mx-auto w-full px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-38 gap-y-16">
          <div className="flex flex-col items-center justify-start gap-6 h-full">
            <h2 className="text-3xl font-bold text-center w-full whitespace-nowrap">Services</h2>
            <h3 className="text-xl italic text-center w-full">what can we offer you?</h3>
            <div className="grid grid-cols-3 gap-10 my-8">
              <div className="flex flex-col items-center justify-center gap-3">
                <Link href="/services/git" className="flex flex-col items-center gap-2">
                  <SiForgejo size={50} />
                  <h3 className="text-lg font-bold">git</h3>
                </Link>
              </div>
              <div className="flex flex-col items-center justify-center gap-3">
                <Link href="/services/mail" className="flex flex-col items-center gap-2">
                  <TbMail size={50} />
                  <h3 className="text-lg font-bold">mail</h3>
                </Link>
              </div>
              <div className="flex flex-col items-center justify-center gap-3">
                <Link href="/services/ai" className="flex flex-col items-center gap-2">
                  <SiOllama size={50} />
                  <h3 className="text-lg font-bold">ai</h3>
                </Link>
              </div>
              <div className="flex flex-col items-center justify-center gap-3">
                <Link href="/services/tv" className="flex flex-col items-center gap-2">
                  <SiJellyfin size={50} />
                  <h3 className="text-lg font-bold">tv</h3>
                </Link>
              </div>
              <div className="flex flex-col items-center justify-center gap-3">
                <Link href="/services/keybox" className="flex flex-col items-center gap-2">
                  <TbKey size={50} />
                  <h3 className="text-lg font-bold">keybox</h3>
                </Link>
              </div>
              <div className="flex flex-col items-center justify-center gap-3">
                <Link href="/services/keybox" className="flex flex-col items-center gap-2">
                  <TbServer size={50} />
                  <h3 className="text-lg font-bold">hosting</h3>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-start gap-6 h-full">
            <h2 className="text-3xl font-bold text-center w-full whitespace-nowrap">Where we are</h2>
            <h3 className="text-xl italic text-center w-full">how can you find us?</h3>
            <div className="flex flex-col items-center gap-6 mt-6">
              <p className="text-lg text-center">
                p0ntus is fully on the public internet! our servers are mainly located in the united states.
              </p>
              <p className="text-lg text-center">
                we also operate servers in the united states, canada and germany.
              </p>
              <Link href="/servers" className="flex flex-row items-center gap-2 text-lg text-center text-blue-500 hover:underline">
                our servers <TbArrowRight size={20} />
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-center justify-start gap-6 h-full">
            <h2 className="text-3xl font-bold text-center w-full whitespace-nowrap">Why is p0ntus free?</h2>
            <h3 className="text-xl italic text-center w-full">what&apos;s the point?</h3>
            <div className="flex flex-col items-center gap-6 mt-6">
              <p className="text-lg text-center">
                everything today includes microtransactions, and we were fed up with it.
              </p>
              <p className="text-lg text-center">
                p0ntus exists to show that it is possible to have a free and open set of services that people have fun using.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
