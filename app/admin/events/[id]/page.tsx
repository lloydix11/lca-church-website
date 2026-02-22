"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EventSchema } from "@/lib/validators";
import { z } from "zod";

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

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = parseInt(params.id as string);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    posterImageUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [posterImageFile, setPosterImageFile] = useState<File | null>(null);
  const [posterImagePreview, setPosterImagePreview] = useState<string>("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (!res.ok) throw new Error("Failed to load event");

        const data = await res.json();
        setFormData({
          title: data.title,
          date: new Date(data.date).toISOString().slice(0, 16),
          location: data.location,
          description: data.description,
          posterImageUrl: data.posterImageUrl || "",
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load event");
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPosterImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      let posterImageUrl = formData.posterImageUrl;

      // Upload poster image if selected
      if (posterImageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", posterImageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload poster image");
        }

        const uploadData = await uploadRes.json();
        posterImageUrl = uploadData.url;
      }

      const validated = EventSchema.parse({
        ...formData,
        posterImageUrl,
      });

      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update event");
      }

      setSuccess(true);
      setTimeout(() => router.push("/admin/dashboard"), 2000);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#F3EFEA" }} className="min-h-screen py-12">
      <style>{styles}</style>
      <div className="container max-w-2xl">
        <Link href="/admin/dashboard" className="text-primary-600 hover:text-primary-700 mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg p-8 shadow-md">
          <h1 className="text-3xl font-bold mb-8" style={{ color: "#047857" }}>
            Edit Event
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6 form-wrapper">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded text-green-700">
                ✅ Event updated successfully! Redirecting...
              </div>
            )}

            <div className="form-field">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                required
              />
            </div>

            <div className="form-field">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                required
              />
            </div>

            <div className="form-field">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                required
              />
            </div>

            <div className="form-field">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                required
              />
            </div>

            <div className="form-field">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Poster Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent cursor-pointer"
              />
              {posterImagePreview && (
                <img src={posterImagePreview} alt="Preview" className="mt-4 max-w-xs rounded-lg" />
              )}
              {formData.posterImageUrl && !posterImagePreview && (
                <img src={formData.posterImageUrl} alt="Current Image" className="mt-4 max-w-xs rounded-lg" />
              )}
            </div>

            <div className="flex gap-4 submit-button">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 font-bold rounded-lg transition" style={{ backgroundColor: "#047857", color: "white" }}
              >
                {submitting ? "Updating..." : "Update Event"}
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
