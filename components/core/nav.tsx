import Link from "next/link";

export function Nav() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-5 py-3 gap-3 sm:gap-0">
      <Link href="/">
        <h1 className="text-2xl sm:text-3xl font-bold font-mono">
          p0ntus
        </h1>
      </Link>
      <div className="flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 text-sm sm:text-base">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/about" className="hover:underline">About</Link>
        <Link href="/servers" className="hover:underline">Servers</Link>
        <Link href="/services" className="hover:underline">Services</Link>
      </div>
    </div>
  );
}