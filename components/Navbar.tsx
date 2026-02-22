import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="bg-primary-600 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-80 transition">
          <Image 
            src="/LCA Logo - no bg.png" 
            alt="LCA Logo" 
            width={40} 
            height={40}
            className="w-10 h-10"
          />
          <span className="ml-2 font-bold text-xl">LCA</span>
        </Link>
        <div className="flex gap-6 text-sm">
          <Link href="/about" className="hover:text-accent transition">
            About
          </Link>
          <Link href="/sermons" className="hover:text-accent transition">
            Sermons
          </Link>
          <Link href="/events" className="hover:text-accent transition">
            Events
          </Link>
          <Link href="/camp" className="hover:text-accent transition font-bold" style={{ color: "#6CBFDB" }}>
            Youth Camp
          </Link>
          <Link href="/contact" className="hover:text-accent transition">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
