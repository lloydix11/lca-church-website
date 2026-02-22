"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    churchName: "Lighthouse Christian Assembly",
    address: "Psalm Base Talisay",
    phone: "(YOUR PHONE NUMBER)",
    email: "info@lca.church",
    sundayService: "9:30 AM",
    wednesdayService: "5:00 PM",
  });

  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save settings");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <p className="text-gray-600">Loading settings...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#F3EFEA" }} className="min-h-screen py-12">
      <div className="container max-w-2xl">
        <Link href="/admin/dashboard" className="text-primary-600 hover:text-primary-700 mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg p-8 shadow-md">
          <h1 className="text-3xl font-bold mb-8" style={{ color: "#047857" }}>
            Church Settings
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {saved && (
              <div className="p-4 bg-green-50 border border-green-200 rounded text-green-700">
                ✅ Settings saved successfully!
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
                ❌ {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Church Name
              </label>
              <input
                type="text"
                name="churchName"
                value={settings.churchName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Church Address
              </label>
              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              />
            </div>

            <hr className="my-8" />

            <h2 className="text-xl font-bold" style={{ color: "#047857" }}>
              Service Times
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sunday Service Time
              </label>
              <input
                type="text"
                name="sundayService"
                value={settings.sundayService}
                onChange={handleChange}
                placeholder="9:30 AM"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Wednesday Service Time
              </label>
              <input
                type="text"
                name="wednesdayService"
                value={settings.wednesdayService}
                onChange={handleChange}
                placeholder="5:00 PM"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 font-bold rounded-lg transition disabled:opacity-50" style={{ backgroundColor: "#047857", color: "white" }}
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
              <Link
                href="/admin/dashboard"
                className="px-8 py-3 border-2 font-bold rounded-lg transition" style={{ borderColor: "#047857", color: "#047857" }}
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
