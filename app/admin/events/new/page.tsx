"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function NewEventPage() {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    posterImageUrl: "",
  });

  const [posterImageFile, setPosterImageFile] = useState<File | null>(null);
  const [posterImagePreview, setPosterImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
    setLoading(true);
    setError(null);

    try {
      // Basic validation
      if (!formData.title || !formData.date || !formData.location || !formData.description) {
        throw new Error("Please fill in all required fields");
      }

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

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          posterImageUrl,
          date: new Date(formData.date).toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create event");
      }

      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F3EFEA" }}>
      <style>{styles}</style>
      <div className="container py-8">
        <Link
          href="/admin/dashboard"
          className="text-primary-600 hover:text-primary-700 mb-6 inline-block"
        >
          ← Back to Dashboard
        </Link>

        <div className="max-w-2xl bg-white rounded-lg p-8 shadow-md">
          <h1 className="heading-lg mb-6">Add New Event</h1>

          <form onSubmit={handleSubmit} className="space-y-6 form-wrapper">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
                {error}
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
                Date *
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
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent resize-none"
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
            </div>

            <div className="flex gap-4 submit-button">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Event"}
              </button>
              <Link href="/admin/dashboard" className="btn btn-outline">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
