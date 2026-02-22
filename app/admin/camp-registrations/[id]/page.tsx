"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const styles = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .form-wrapper {
    animation: slideInRight 0.5s ease-out;
  }
  .form-field {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  .form-field:nth-child(1) { animation-delay: 0.1s; }
  .form-field:nth-child(2) { animation-delay: 0.15s; }
  .form-field:nth-child(3) { animation-delay: 0.2s; }
  .form-field:nth-child(4) { animation-delay: 0.25s; }
  .form-field:nth-child(5) { animation-delay: 0.3s; }
  .form-field:nth-child(6) { animation-delay: 0.35s; }
  .form-field:nth-child(7) { animation-delay: 0.4s; }
  .form-field:nth-child(8) { animation-delay: 0.45s; }
  .form-field:nth-child(9) { animation-delay: 0.5s; }
  .form-field:nth-child(10) { animation-delay: 0.55s; }
  .submit-button {
    animation: fadeInUp 0.6s ease-out 0.4s both;
  }
`;

interface Registration {
  id: number;
  fullName: string;
  facebookUrl: string;
  contactNumber: string;
  emergencyContactNumber: string;
  invitedBy?: string;
  amountPaid: number;
  screenshotSentEmail: boolean;
  status: string;
  createdAt: string;
}

export default function EditRegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const registrationId = parseInt(params.id as string);

  const [registration, setRegistration] = useState<Registration | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    facebookUrl: "",
    contactNumber: "",
    emergencyContactNumber: "",
    invitedBy: "",
    amountPaid: 0,
    screenshotSentEmail: false,
    status: "Pending",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        const res = await fetch(`/api/camp-registrations/${registrationId}`);
        if (!res.ok) throw new Error("Failed to load registration");

        const data = await res.json();
        setRegistration(data);
        setFormData({
          fullName: data.fullName,
          facebookUrl: data.facebookUrl,
          contactNumber: data.contactNumber,
          emergencyContactNumber: data.emergencyContactNumber,
          invitedBy: data.invitedBy || "",
          amountPaid: data.amountPaid,
          screenshotSentEmail: data.screenshotSentEmail,
          status: data.status,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load registration");
        setLoading(false);
      }
    };

    fetchRegistration();
  }, [registrationId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/camp-registrations/${registrationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update registration");
      }

      setSuccess(true);
      setTimeout(() => router.push("/admin/dashboard"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <p className="text-gray-600">Loading registration...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#F3EFEA" }} className="min-h-screen py-12">
      <style>{styles}</style>
      <div className="container max-w-2xl">
        <Link
          href="/admin/dashboard"
          className="text-primary-600 hover:text-primary-700 mb-6 inline-block"
        >
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg p-8 shadow-md">
          <h1 className="text-3xl font-bold mb-8" style={{ color: "#047857" }}>
            Edit Registration
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6 form-wrapper">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded text-green-700">
                ✅ Registration updated successfully! Redirecting...
              </div>
            )}

            <div className="form-field">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                required
              />
            </div>

            <div className="form-field">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                name="facebookUrl"
                value={formData.facebookUrl}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              />
            </div>

            <div className="form-field">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                required
              />
            </div>

            <div className="form-field">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Emergency Contact Number *
              </label>
              <input
                type="tel"
                name="emergencyContactNumber"
                value={formData.emergencyContactNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                required
              />
            </div>

            <div className="form-field">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Invited By
              </label>
              <input
                type="text"
                name="invitedBy"
                value={formData.invitedBy}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              />
            </div>

            <div className="form-field">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount Paid (₱) *
              </label>
              <input
                type="number"
                name="amountPaid"
                value={formData.amountPaid}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                required
              />
            </div>

            <div className="form-field">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="screenshotSentEmail"
                  checked={formData.screenshotSentEmail}
                  onChange={handleChange}
                  className="w-5 h-5 cursor-pointer"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Screenshot Sent via Email
                </span>
              </label>
            </div>

            <div className="form-field">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4 submit-button">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 font-bold rounded-lg transition disabled:opacity-50"
                style={{ backgroundColor: "#047857", color: "white" }}
              >
                {saving ? "Updating..." : "Update Registration"}
              </button>
              <Link
                href="/admin/dashboard"
                className="px-8 py-3 border-2 font-bold rounded-lg transition"
                style={{ borderColor: "#047857", color: "#047857" }}
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
