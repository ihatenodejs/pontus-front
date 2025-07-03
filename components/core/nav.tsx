import Link from "next/link";

export function Nav() {
  return (
    <div className="flex flex-row items-center justify-between px-5 py-3">
      <Link href="/">
        <h1 className="text-3xl font-bold font-mono">
          p0ntus
        </h1>
      </Link>
      <div className="flex flex-row gap-4">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/servers">Servers</Link>
        <Link href="/services">Services</Link>
      </div>
    </div>
  );
}