import { Nav } from "@/components/core/nav";
import { GiStoneWheel } from "react-icons/gi";
import { TbUserSquareRounded } from "react-icons/tb";
import { RiTelegram2Line } from "react-icons/ri";
import Link from "next/link";

export default function About() {
  return (
    <main>
      <Nav />
      <div className="flex flex-col items-center justify-between gap-3 my-12 sm:my-20 px-4">
        <div className="flex flex-row items-center justify-between gap-2">
          <TbUserSquareRounded size={32} className="sm:w-9 sm:h-9" />
          <h1 className="text-3xl sm:text-4xl font-bold">
            About
          </h1>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between gap-3 px-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-center w-full flex flex-wrap items-center justify-center">
          p0ntus is a small team of developers working towards
          <span className="bg-red-400 text-white rounded-full italic ml-2 px-3 pr-4 py-1">one goal</span>
        </h2>
        <h2 className="text-lg sm:text-xl text-center w-full flex flex-wrap items-center justify-center">
          we want to make the cloud accessible to <span className="ml-1 italic">everyone</span>
        </h2>
        <h2 className="text-base sm:text-lg text-center w-full flex flex-wrap items-center justify-center">
          no corporate sponsors, no closed source, no microtransactions.
        </h2>
      </div>
      <div className="flex flex-col items-center justify-between gap-3 my-12 sm:my-20 px-4">
        <div className="flex flex-col items-center justify-between gap-3">
          <GiStoneWheel size={50} className="sm:w-15 sm:h-15" />
          <h2 className="text-2xl sm:text-3xl font-semibold text-center w-full flex flex-wrap items-center justify-center">
            we don&apos;t reinvent the wheel,
          </h2>
          <h2 className="text-xl sm:text-2xl text-center w-full flex flex-wrap items-center justify-center">
            but we get the job done.
          </h2>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 my-2 max-w-3xl">
          <p className="text-sm sm:text-base text-center w-full flex flex-wrap items-center justify-center">
            we put effort into finding, creating, and building on the best tools avaliable to bring the magic of the cloud to you.
          </p>
          <p className="text-sm sm:text-base text-center w-full flex flex-wrap items-center justify-center">
            we believe using cloud services is <span className="ml-1 italic">more than just a way to store your data.</span>
            <span className="font-bold">your experience should be valued.</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between gap-3 my-12 sm:my-20 px-4">
        <div className="flex flex-col items-center justify-between gap-3">
          <RiTelegram2Line size={50} className="sm:w-15 sm:h-15" />
          <h2 className="text-2xl sm:text-3xl font-semibold text-center w-full flex flex-wrap items-center justify-center">
            let&apos;s talk.
          </h2>
          <div className="flex flex-col items-center justify-between gap-2">
            <p className="text-sm sm:text-base text-center w-full flex flex-wrap items-center justify-center">
              we&apos;re always looking for new people to help out.
            </p>
            <p className="text-sm sm:text-base text-center w-full flex flex-wrap items-center justify-center">
              we&apos;re here for everything else, too! account support, deployment, service, and more.
            </p>
            <p className="text-sm sm:text-base text-center w-full flex flex-wrap items-center justify-center">
              join us on telegram for support, questions, chatting, and more.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 my-3">
            <Link href="https://t.me/p0ntu5">
              <button className="flex flex-row items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md w-full sm:w-auto">
                <RiTelegram2Line size={24} />
                <span className="text-sm sm:text-base">
                  contact
                </span>
              </button>
            </Link>
            <Link href="https://t.me/pontushub">
              <button className="flex flex-row items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md w-full sm:w-auto">
                <RiTelegram2Line size={24} />
                <span className="text-sm sm:text-base">
                  join channel
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}