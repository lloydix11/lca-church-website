import { redirect } from "next/navigation";

export default function CampPage() {
  redirect("/events");
  const [formData, setFormData] = useState({
    fullName: "",
    facebookUrl: "",
    contactNumber: "",
    emergencyContactNumber: "",
    invitedBy: "",
    amountPaid: "",
    screenshotSentEmail: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const validated = CampRegistrationSchema.parse(formData);

      const res = await fetch("/api/camp-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validated,
          amountPaid: parseFloat(validated.amountPaid.toString()),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to register");
      }

      setSuccess(true);
      setFormData({
        fullName: "",
        facebookUrl: "",
        contactNumber: "",
        emergencyContactNumber: "",
        invitedBy: "",
        amountPaid: "",
        screenshotSentEmail: false,
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-primary-50 to-cream">
      <style>{styles}</style>
      <div className="container py-12">
        <Link href="/" className="text-primary-600 hover:text-primary-700 mb-6 inline-block">
          ← Back to Home
        </Link>

        <div className="max-w-2xl mx-auto">
          <h1 className="heading-lg mb-2">Youth Summer Camp</h1>
          <p className="text-gray-600 mb-12 text-lg">
            Join us for an unforgettable spiritual experience!
          </p>

          <div className="bg-white rounded-lg p-8 shadow-md form-container">
            <div className="mb-8 p-4 bg-primary-50 rounded-lg">
              <h2 className="font-bold text-primary-700 mb-2">Camp Details</h2>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>📅 Coming Soon</li>
                <li>📍 Location TBA</li>
                <li>⏱️ Multiple days of worship, games, and fellowship</li>
                <li>💰 Registration fee: ₱1,000</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="error-message p-4 bg-red-50 border border-red-200 rounded text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="success-message p-4 bg-green-50 border border-green-200 rounded text-green-700">
                  ✅ Registration successful! We'll contact you soon.
                </div>
              )}

              <div className="form-group">
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

              <div className="form-group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Facebook URL *
                </label>
                <input
                  type="url"
                  name="facebookUrl"
                  value={formData.facebookUrl}
                  onChange={handleChange}
                  placeholder="https://facebook.com/your-profile"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  required
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="+63 9XX XXX XXXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  required
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Emergency Contact Number *
                </label>
                <input
                  type="tel"
                  name="emergencyContactNumber"
                  value={formData.emergencyContactNumber}
                  onChange={handleChange}
                  placeholder="+63 9XX XXX XXXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  required
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Invited By (Optional)
                </label>
                <input
                  type="text"
                  name="invitedBy"
                  value={formData.invitedBy}
                  onChange={handleChange}
                  placeholder="Friend's name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount Paid (₱) *
                </label>
                <input
                  type="number"
                  name="amountPaid"
                  value={formData.amountPaid}
                  onChange={handleChange}
                  placeholder="1000"
                  min="1000"
                  step="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  required
                />
              </div>

              <div className="form-group flex items-center gap-3">
                <input
                  type="checkbox"
                  id="screenshot"
                  name="screenshotSentEmail"
                  checked={formData.screenshotSentEmail}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <label htmlFor="screenshot" className="text-sm text-gray-700">
                  I have sent the payment screenshot via email
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="submit-button w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Registering..." : "Register for Camp"}
              </button>
            </form>

            <p className="text-sm text-gray-500 text-center mt-6">
              Questions? Contact us at camp@lca.church
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
