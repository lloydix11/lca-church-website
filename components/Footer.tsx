"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Settings {
  churchName: string;
  address: string;
  phone: string;
  email: string;
  sundayService: string;
  wednesdayService: string;
}

export function Footer() {
  const [settings, setSettings] = useState<Settings>({
    churchName: "Lighthouse Christian Assembly",
    address: "Psalm Base Talisay",
    phone: "(YOUR PHONE NUMBER)",
    email: "info@lca.church",
    sundayService: "9:30 AM",
    wednesdayService: "5:00 PM",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      }
    };

    fetchSettings();
  }, []);

  return (
    <footer className="bg-primary-600 text-white py-12">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{settings.churchName}</h3>
            <p className="text-gray-100 text-sm">
              Shining God's light in our community through worship, service, and fellowship.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sermons" className="hover:text-accent transition">
                  Sermons
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-accent transition">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact Info</h4>
            <p className="text-sm text-gray-100 mb-2">📍 {settings.address}</p>
            <p className="text-sm text-gray-100 mb-2">📞 {settings.phone}</p>
            <p className="text-sm text-gray-100">✉️ {settings.email}</p>
          </div>
        </div>

        <div className="border-t border-primary-500 pt-8 text-center text-sm text-gray-100">
          <p>© 2026 {settings.churchName}. All rights reserved.</p>
          <p className="text-accent mt-2">Shining God's light in our community</p>
        </div>
      </div>
    </footer>
  );
}
