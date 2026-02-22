import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
    });
    return {
      title: event?.title || "Event",
      description: event?.description || "Event at Lighthouse Christian Assembly",
    };
  } catch (error) {
    console.error("Failed to fetch event metadata:", error);
    return {
      title: "Event",
      description: "Event at Lighthouse Christian Assembly",
    };
  }
}

export default async function EventPage({ params }: Props) {
  const { id } = await params;
  let event: any = null;

  try {
    event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
    });
  } catch (error) {
    console.error("Failed to fetch event:", error);
  }

  if (!event) {
    return (
      <div className="container py-12 text-center">
        <h1 className="heading-lg mb-4">Event Not Found</h1>
        <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
        <Link href="/events" className="btn btn-primary">
          Back to Events
        </Link>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();

  return (
    <div className="bg-gradient-to-b from-primary-50 to-cream">
      <div className="container py-12">
        <Link href="/events" className="text-primary-600 hover:text-primary-700 mb-6 inline-block">
          ← Back to Events
        </Link>

        <article className="max-w-4xl">
          {event.posterImageUrl && (
            <div className="mb-8 rounded-lg overflow-hidden h-96 bg-gray-200">
              <img
                src={event.posterImageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="bg-white rounded-lg p-8 shadow-md">
            {isPast && (
              <div className="rounded p-3 mb-6" style={{ backgroundColor: "#E8EDE8", borderColor: "#A9C3A3", borderWidth: "1px" }}>
                <p className="font-semibold" style={{ color: "#2F4F2F" }}>📌 This event has passed.</p>
              </div>
            )}

            <h1 className="heading-lg mb-6">{event.title}</h1>

            <div className="grid md:grid-cols-2 gap-6 mb-8 pb-8 border-b">
              <div>
                <h3 className="text-sm font-semibold text-primary-600 mb-1">DATE</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {eventDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-gray-600">
                  {eventDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-primary-600 mb-1">LOCATION</h3>
                <p className="text-lg font-semibold text-gray-900">
                  📍 {event.location}
                </p>
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              <h2 className="heading-md">About this Event</h2>
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            <div className="pt-6 border-t flex gap-4">
              {event.title.toLowerCase().includes("youth") && event.title.toLowerCase().includes("camp") && (
                <Link href="/camp" className="btn btn-secondary">
                  📝 Register Now
                </Link>
              )}
              <Link href="/events" className="btn btn-primary">
                Back to All Events
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
