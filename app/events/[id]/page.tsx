import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const styles = `
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
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
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  .event-hero {
    animation: fadeInDown 0.8s ease-out;
  }
  .info-card {
    animation: scaleIn 0.6s ease-out forwards;
  }
  .info-card:nth-child(1) { animation-delay: 0.1s; }
  .info-card:nth-child(2) { animation-delay: 0.2s; }
  .detail-section {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  .detail-section:nth-child(1) { animation-delay: 0.2s; }
  .detail-section:nth-child(2) { animation-delay: 0.3s; }
  .detail-section:nth-child(3) { animation-delay: 0.4s; }
`;

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
  
  // Fix timezone issue - use the date as-is without timezone conversion
  const getDateParts = (dateInput: any) => {
    const date = new Date(dateInput);
    // Add timezone offset to get the intended date
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return {
      dateString: utcDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      dateShort: utcDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      fullYear: utcDate.getFullYear(),
      timeString: utcDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };
  
  const dateParts = getDateParts(event.date);
  const isPast = new Date(event.date) < new Date();

  // Function to convert URLs in text to clickable links
  const renderDescriptionWithLinks = (text: string) => {
    // Handle newlines and text together
    const urlRegex = /(https?:\/\/[^\s\n]+)/g;
    let lastIndex = 0;
    const elements: any[] = [];
    let match;

    while ((match = urlRegex.exec(text)) !== null) {
      // Add text before the URL
      if (match.index > lastIndex) {
        elements.push(
          <span key={`text-${lastIndex}`}>
            {text.substring(lastIndex, match.index)}
          </span>
        );
      }

      // Add the URL as a link
      const url = match[0];
      elements.push(
        <a
          key={`link-${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-accent hover:underline font-semibold inline-block break-all"
        >
          {url}
        </a>
      );

      lastIndex = urlRegex.lastIndex;
    }

    // Add remaining text after last URL
    if (lastIndex < text.length) {
      elements.push(
        <span key={`text-${lastIndex}`}>
          {text.substring(lastIndex)}
        </span>
      );
    }

    // If no URLs found, return the text as is
    return elements.length === 0 ? text : elements;
  };

  // Parse description into structured items
  const parseDescriptionItems = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const items: any[] = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      // Check if this is a key detail (contains colon)
      if (trimmed.includes(':')) {
        const [label, ...rest] = trimmed.split(':');
        items.push({
          type: 'detail',
          label: label.trim(),
          value: rest.join(':').trim()
        });
      } else if (trimmed.match(/^\d+\s*Days?|^\d+\s*Nights?/)) {
        items.push({
          type: 'highlight',
          value: trimmed
        });
      } else {
        items.push({
          type: 'text',
          value: trimmed
        });
      }
    });
    
    return items;
  };

  const descriptionItems = parseDescriptionItems(event.description);

  return (
    <div>
      <style>{styles}</style>
      {/* Hero Section */}
      <section style={{ backgroundImage: "linear-gradient(135deg, #047857 0%, #6CBFDB 100%)" }} className="text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
            <circle cx="200" cy="100" r="300" fill="currentColor" />
            <circle cx="1000" cy="300" r="250" fill="currentColor" />
          </svg>
        </div>

        <div className="container relative z-10">
          <Link href="/events" className="text-white hover:opacity-80 mb-6 inline-flex items-center gap-2 transition">
            ← Back to Events
          </Link>

          <div className="event-hero max-w-4xl">
            {isPast && (
              <div className="inline-block mb-4 px-4 py-2 rounded-full font-semibold" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                ✓ Event Completed
              </div>
            )}
            {!isPast && (
              <div className="inline-block mb-4 px-4 py-2 rounded-full font-semibold" style={{ backgroundColor: "#C5E0B8", color: "#047857" }}>
                📅 Upcoming Event
              </div>
            )}

            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              {event.title}
            </h1>
            <p className="text-xl opacity-90 max-w-2xl">
              Join us for an unforgettable experience of faith, community, and spiritual growth
            </p>
          </div>
        </div>
      </section>

      {/* Poster Image */}
      {event.posterImageUrl && (
        <section className="container py-8">
          <div className="rounded-xl overflow-hidden shadow-2xl h-80 md:h-96 bg-gray-200">
            <img
              src={event.posterImageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      )}

      {/* Key Info Cards */}
      <section className="container py-12">
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
          {/* Date Card */}
          <div className="info-card bg-white rounded-xl p-8 shadow-lg border-l-4" style={{ borderLeftColor: "#6CBFDB" }}>
            <div className="flex items-start gap-4">
              <div className="text-4xl">📅</div>
              <div className="flex-1">
                <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "#047857" }}>Date & Time</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {dateParts.dateShort}
                </p>
                <p className="text-gray-600 mt-1">
                  {dateParts.dateString}
                </p>
                <p className="text-accent font-semibold mt-2">
                  {dateParts.timeString}
                </p>
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="info-card bg-white rounded-xl p-8 shadow-lg border-l-4" style={{ borderLeftColor: "#C5E0B8" }}>
            <div className="flex items-start gap-4">
              <div className="text-4xl">📍</div>
              <div className="flex-1">
                <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "#047857" }}>Location</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {event.location}
                </p>
                <p className="text-gray-600 mt-2">
                  Find us on the map
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section style={{ backgroundColor: "#FFF8F0" }} className="py-16">
        <div className="container max-w-4xl">
          <div className="detail-section bg-white rounded-xl p-8 md:p-12 shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: "#047857" }}>
              About this Event
            </h2>
            <div className="space-y-6">
              {descriptionItems.map((item, index) => {
                if (item.type === 'detail') {
                  return (
                    <div key={index} className="flex gap-4 pb-4 border-b">
                      <div className="font-bold text-lg min-w-fit" style={{ color: "#047857" }}>
                        {item.label}:
                      </div>
                      <div className="text-gray-700 text-lg flex-1">
                        {renderDescriptionWithLinks(item.value)}
                      </div>
                    </div>
                  );
                } else if (item.type === 'highlight') {
                  return (
                    <div key={index} className="px-4 py-3 rounded-lg text-lg font-semibold" style={{ backgroundColor: "#C5E0B8", color: "#047857" }}>
                      ✨ {item.value}
                    </div>
                  );
                } else {
                  return (
                    <p key={index} className="text-gray-700 text-lg leading-relaxed">
                      {renderDescriptionWithLinks(item.value)}
                    </p>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16">
        <div className="max-w-4xl flex flex-col sm:flex-row gap-4">
          {event.title.toLowerCase().includes("youth") && event.title.toLowerCase().includes("camp") && (
            <Link
              href="/camp"
              className="flex-1 px-8 py-4 font-bold rounded-lg transition duration-300 text-center hover:shadow-lg hover:scale-105"
              style={{ backgroundColor: "#6CBFDB", color: "white" }}
            >
              📝 Register Now
            </Link>
          )}
          <Link
            href="/events"
            className="flex-1 px-8 py-4 font-bold rounded-lg border-2 transition duration-300 text-center hover:shadow-lg hover:scale-105"
            style={{ borderColor: "#047857", color: "#047857", backgroundColor: "transparent" }}
          >
            Back to All Events
          </Link>
        </div>
      </section>
    </div>
  );
}

