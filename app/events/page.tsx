import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .event-card {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  .event-card:nth-child(1) { animation-delay: 0.1s; }
  .event-card:nth-child(2) { animation-delay: 0.2s; }
  .event-card:nth-child(3) { animation-delay: 0.3s; }
  .event-card:nth-child(n+4) { animation-delay: 0.1s; }
`;

export default async function EventsPage() {
  let events: any[] = [];
  try {
    events = await prisma.event.findMany({
      orderBy: { date: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch events:", error);
    // Return empty array if database is unavailable
    events = [];
  }

  return (
    <div className="bg-gradient-to-b from-primary-50 to-cream">
      <style>{styles}</style>
      <div className="container py-12">
        <Link href="/" className="text-primary-600 hover:text-primary-700 mb-6 inline-block">
          ← Back to Home
        </Link>

        <h1 className="heading-lg mb-2">Events</h1>
        <p className="text-gray-600 mb-12 text-lg">
          Join us for worship, fellowship, and community events.
        </p>

        {events.length > 0 ? (
          <div className="space-y-6">
            {events.map((event) => {
              const isYouthCamp = event.title.toLowerCase().includes("youth") && event.title.toLowerCase().includes("camp");
              return (
              <div key={event.id} className="event-card">
                <Link
                  href={`/events/${event.id}`}
                  className="card group flex flex-col md:flex-row gap-6 hover:shadow-lg"
                >
                  {event.posterImageUrl && (
                    <div className="md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                      <img
                        src={event.posterImageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-accent font-semibold mb-1">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <h3 className="heading-md group-hover:text-accent transition mb-2">
                      {event.title}
                    </h3>
                    <p className="text-primary-600 font-semibold mb-2">
                      📍 {event.location}
                    </p>
                    <p className="text-gray-600 line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                  <div className="md:text-right text-accent font-semibold">
                    View Details →
                  </div>
                </Link>
                {isYouthCamp && (
                  <Link
                    href="/camp"
                    className="mt-3 p-4 rounded block hover:opacity-90 transition font-semibold" 
                    style={{ backgroundColor: "#A9C3A3", color: "#2F4F2F" }}
                  >
                    🎉 Youth Camp is coming soon! Click here to register now →
                  </Link>
                )}
              </div>
            );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events scheduled yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
