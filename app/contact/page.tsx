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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [settings, setSettings] = useState<Settings>({
    churchName: "Lighthouse Christian Assembly",
    address: "Psalm Base Talisay",
    phone: "(YOUR PHONE NUMBER)",
    email: "info@lca.church",
    sundayService: "9:30 AM",
    wednesdayService: "5:00 PM",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch settings on mount
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // For now, just show success message
      // In production, you'd send this to an email service
      console.log("Contact form submitted:", formData);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-primary-50 to-cream">
      <div className="container py-12">
        <Link href="/" className="text-primary-600 hover:text-primary-700 mb-6 inline-block">
          ← Back to Home
        </Link>

        <h1 className="heading-lg mb-2">Contact Us</h1>
        <p className="text-gray-600 mb-12 text-lg">
          We'd love to hear from you. Get in touch with us today.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: "📍",
              title: "Location",
              content: settings.address,
            },
            {
              icon: "📞",
              title: "Phone",
              content: settings.phone,
            },
            {
              icon: "✉️",
              title: "Email",
              content: settings.email,
            },
          ].map((item) => (
            <div key={item.title} className="card text-center">
              <p className="text-4xl mb-3">{item.icon}</p>
              <h3 className="font-bold text-primary-700 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {item.content}
              </p>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-lg p-8 shadow-md">
          <h2 className="heading-md mb-6">Send us a Message</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded text-green-700">
                ✅ Message sent! We'll get back to you soon.
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        <div className="mt-12 bg-primary-50 rounded-lg p-8 text-center">
          <h3 className="heading-md mb-2">Service Times</h3>
          <p className="text-gray-600 mb-4">
            We'd love to see you at our next service!
          </p>
          <div className="grid md:grid-cols-2 gap-4 max-w-xs mx-auto">
            {[
              { day: "Sunday", time: "9:30 AM" },
              { day: "Wednesday", time: "5:00 PM" },
            ].map((service) => (
              <div key={service.day} className="bg-white p-3 rounded">
                <p className="font-bold text-primary-700">{service.day}</p>
                <p className="text-gray-600">{service.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
