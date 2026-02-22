"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Sermon {
  id: number;
  title: string;
  preacher: string;
  date: string;
  description: string;
  youtubeUrl?: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
}

interface Registration {
  id: number;
  fullName: string;
  contactNumber: string;
  amountPaid: number;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"sermons" | "events" | "registrations">(
    "sermons"
  );
  const [editingStatus, setEditingStatus] = useState<{ [key: number]: string }>({});
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin-check", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          router.push("/admin");
        }
      } catch (err) {
        router.push("/admin");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sermonsRes, eventsRes, registrationsRes] = await Promise.all([
          fetch("/api/sermons"),
          fetch("/api/events"),
          fetch("/api/camp-registrations"),
        ]);

        if (sermonsRes.ok) {
          setSermons(await sermonsRes.json());
        }
        if (eventsRes.ok) {
          setEvents(await eventsRes.json());
        }
        if (registrationsRes.ok) {
          setRegistrations(await registrationsRes.json());
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateStatus = async (registrationId: number, newStatus: string) => {
    setUpdatingId(registrationId);
    try {
      const res = await fetch(`/api/camp-registrations/${registrationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setRegistrations((prev) =>
          prev.map((r) =>
            r.id === registrationId ? { ...r, status: newStatus } : r
          )
        );
        setEditingStatus((prev) => ({ ...prev, [registrationId]: newStatus }));
        setUpdateSuccess(registrationId);
        setTimeout(() => setUpdateSuccess(null), 2000);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteRegistration = async (registrationId: number) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) {
      return;
    }

    try {
      const res = await fetch(`/api/camp-registrations/${registrationId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setRegistrations(registrations.filter((r) => r.id !== registrationId));
      }
    } catch (err) {
      console.error("Failed to delete registration:", err);
    }
  };

  const handleDelete = async (type: string, id: number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      const endpoint =
        type === "sermon" ? `/api/sermons/${id}` : `/api/events/${id}`;
      const res = await fetch(endpoint, {
        method: "DELETE",
      });

      if (res.ok) {
        if (type === "sermon") {
          setSermons(sermons.filter((s) => s.id !== id));
        } else {
          setEvents(events.filter((e) => e.id !== id));
        }
      }
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F3EFEA" }}>
      <style>{`
        @keyframes fadeInSlideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes tabSlideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .tab-content {
          animation: tabSlideIn 0.4s ease-out;
        }
        .tab-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        .tab-button::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 3px;
          background-color: #047857;
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tab-button.active::after {
          transform: scaleX(1);
        }
      `}</style>
      {/* Header */}
      <header className="bg-primary-600 text-white sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-200">Manage your church content</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/settings" className="btn bg-blue-600 hover:bg-blue-700 text-white">
              ⚙️ Settings
            </Link>
            <button
              onClick={async () => {
                await fetch("/api/admin-logout", { method: "POST" });
                router.push("/");
              }}
              className="btn bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          {(
            [
              { id: "sermons", label: "Sermons" },
              { id: "events", label: "Events" },
              { id: "registrations", label: "Registrations" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button px-6 py-3 font-semibold text-gray-600 hover:text-gray-900 ${
                activeTab === tab.id ? "active text-primary-600" : ""
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* Sermons Tab */}
            {activeTab === "sermons" && (
              <div className="tab-content">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="heading-md">Manage Sermons</h2>
                  <Link
                    href="/admin/sermons/new"
                    className="btn btn-primary"
                  >
                    + Add Sermon
                  </Link>
                </div>

                {sermons.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No sermons yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow-md">
                      <thead style={{ backgroundColor: "#E8EDE8" }}>
                        <tr>
                          <th className="px-6 py-3 text-left font-semibold">Title</th>
                          <th className="px-6 py-3 text-left font-semibold">Preacher</th>
                          <th className="px-6 py-3 text-left font-semibold">Date</th>
                          <th className="px-6 py-3 text-left font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sermons.map((sermon) => (
                          <tr key={sermon.id} className="border-t hover:bg-gray-50">
                            <td className="px-6 py-4">{sermon.title}</td>
                            <td className="px-6 py-4">{sermon.preacher}</td>
                            <td className="px-6 py-4">
                              {new Date(sermon.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-3">
                                <Link
                                  href={`/admin/sermons/${sermon.id}`}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                                >
                                  Edit
                                </Link>
                                <button
                                  onClick={() =>
                                    handleDelete("sermon", sermon.id)
                                  }
                                  className="text-red-600 hover:text-red-800 text-sm font-semibold"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Events Tab */}
            {activeTab === "events" && (
              <div className="tab-content">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="heading-md">Manage Events</h2>
                  <Link
                    href="/admin/events/new"
                    className="btn btn-primary"
                  >
                    + Add Event
                  </Link>
                </div>

                {events.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No events yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow-md">
                      <thead style={{ backgroundColor: "#E8EDE8" }}>
                        <tr>
                          <th className="px-6 py-3 text-left font-semibold">Title</th>
                          <th className="px-6 py-3 text-left font-semibold">Location</th>
                          <th className="px-6 py-3 text-left font-semibold">Date</th>
                          <th className="px-6 py-3 text-left font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((event) => (
                          <tr key={event.id} className="border-t hover:bg-gray-50">
                            <td className="px-6 py-4">{event.title}</td>
                            <td className="px-6 py-4">{event.location}</td>
                            <td className="px-6 py-4">
                              {new Date(event.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-3">
                                <Link
                                  href={`/admin/events/${event.id}`}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                                >
                                  Edit
                                </Link>
                                <button
                                  onClick={() =>
                                    handleDelete("event", event.id)
                                  }
                                  className="text-red-600 hover:text-red-800 text-sm font-semibold"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Registrations Tab */}
            {activeTab === "registrations" && (
              <div className="tab-content">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="heading-md">Camp Registrations</h2>
                  <button
                    onClick={() => {
                      window.location.href = "/api/camp-registrations/export";
                    }}
                    className="btn bg-green-600 hover:bg-green-700 text-white"
                  >
                    📥 Export as CSV
                  </button>
                </div>

                {registrations.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No registrations yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {registrations.map((reg) => (
                      <div
                        key={reg.id}
                        className="bg-white rounded-lg p-6 shadow-md border-l-4" style={{ borderColor: "#047857" }}
                      >
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="font-bold text-lg">{reg.fullName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-bold">{reg.contactNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Amount Paid</p>
                            <p className="font-bold">₱{reg.amountPaid.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 items-center mb-4">
                          <div className="flex-1 flex gap-2 items-end">
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Status</p>
                              <select
                                value={editingStatus[reg.id] !== undefined ? editingStatus[reg.id] : reg.status}
                                onChange={(e) =>
                                  setEditingStatus({
                                    ...editingStatus,
                                    [reg.id]: e.target.value,
                                  })
                                }
                                className={`font-bold px-3 py-2 rounded text-sm border cursor-pointer ${
                                  (editingStatus[reg.id] !== undefined ? editingStatus[reg.id] : reg.status) === "Confirmed"
                                    ? "bg-green-100 text-green-700 border-green-300"
                                    : (editingStatus[reg.id] !== undefined ? editingStatus[reg.id] : reg.status) === "Cancelled"
                                    ? "bg-red-100 text-red-700 border-red-300"
                                    : "bg-yellow-100 text-yellow-700 border-yellow-300"
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              href={`/admin/camp-registrations/${reg.id}`}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-sm transition"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteRegistration(reg.id)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded text-sm transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-gray-500">
                          Registered: {new Date(reg.createdAt).toLocaleDateString("en-US", { 
                            year: "numeric", 
                            month: "short", 
                            day: "numeric" 
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
