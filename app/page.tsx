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
  .hero-title {
    animation: fadeInDown 0.8s ease-out;
  }
  .hero-subtitle {
    animation: fadeInUp 0.8s ease-out 0.2s both;
  }
  .hero-description {
    animation: fadeInUp 0.8s ease-out 0.3s both;
  }
  .hero-buttons {
    animation: fadeInUp 0.8s ease-out 0.4s both;
  }
  .service-card {
    animation: scaleIn 0.6s ease-out;
  }
  .service-card:nth-child(1) { animation-delay: 0.5s; }
  .service-card:nth-child(2) { animation-delay: 0.6s; }
  .feature-card {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  .feature-card:nth-child(1) { animation-delay: 0.2s; }
  .feature-card:nth-child(2) { animation-delay: 0.3s; }
  .feature-card:nth-child(3) { animation-delay: 0.4s; }
  .sermon-card-home {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  .sermon-card-home:nth-child(1) { animation-delay: 0.1s; }
  .sermon-card-home:nth-child(2) { animation-delay: 0.2s; }
  .sermon-card-home:nth-child(3) { animation-delay: 0.3s; }
`;

export default async function Home() {
  let latestSermons: any[] = [];
  let upcomingEvents: any[] = [];
  
  try {
    latestSermons = await prisma.sermon.findMany({
      orderBy: { date: "desc" },
      take: 3,
    });

    upcomingEvents = await prisma.event.findMany({
      orderBy: { date: "asc" },
      take: 3,
    });
  } catch (error) {
    console.error("Failed to fetch home page data:", error);
    // Continue with empty arrays if database is unavailable
  }

  return (
    <div>
      <style>{styles}</style>
      {/* Hero Section */}
      <section style={{ backgroundImage: "linear-gradient(135deg, #047857 0%, #4a9d63 100%)" }} className="text-white pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
            <path d="M0,300 Q300,200 600,300 T1200,300 L1200,600 L0,600 Z" fill="currentColor" />
          </svg>
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="hero-title text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to Lighthouse Christian Assembly
            </h1>
            <p className="hero-subtitle text-xl md:text-2xl mb-4" style={{ color: "#C5E0B8" }}>
              Shining God's Light in Our Community
            </p>
            <p className="hero-description text-lg mb-12 text-gray-200 max-w-2xl mx-auto leading-relaxed">
              A place where faith comes alive, community grows, and lives are transformed through the power of Jesus Christ.
            </p>
            
            <div className="hero-buttons flex gap-4 justify-center flex-wrap mb-8">
              <Link href="/about" className="px-8 py-3 font-bold rounded-lg hover:opacity-90 transition" style={{ backgroundColor: "#6CBFDB", color: "white" }}>
                Join Us This Sunday
              </Link>
              <Link href="/events" className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-primary-700 transition">
                Explore Events
              </Link>
            </div>

            {/* Service Times Quick View */}
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="service-card bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
                <p className="font-bold text-lg mb-2" style={{ color: "#C5E0B8" }}>SUNDAY SERVICE</p>
                <p className="text-2xl font-bold">9:30 AM</p>
                <p className="text-sm text-gray-300">Psalm Base Talisay</p>
              </div>
              <div className="service-card bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
                <p className="font-bold text-lg mb-2" style={{ color: "#C5E0B8" }}>WEDNESDAY PRAYER</p>
                <p className="text-2xl font-bold">5:00 PM</p>
                <p className="text-sm text-gray-300">Psalm Base Talisay</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why LCA Section */}
      <section style={{ backgroundColor: "#FFF8F0" }} className="py-16">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: "#047857" }}>
            Come with us!
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card text-center">
              <div className="text-5xl mb-4">🙏</div>
              <h3 className="text-xl font-bold mb-3" style={{ color: "#047857" }}>
                Authentic Worship
              </h3>
              <p className="text-gray-700">
                Experience meaningful worship that connects you to God and your community.
              </p>
            </div>
            <div className="feature-card text-center">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-3" style={{ color: "#047857" }}>
                Strong Community
              </h3>
              <p className="text-gray-700">
                Join a loving family that supports, encourages, and grows together.
              </p>
            </div>
            <div className="feature-card text-center">
              <div className="text-5xl mb-4">📖</div>
              <h3 className="text-xl font-bold mb-3" style={{ color: "#047857" }}>
                Bible-Centered Teaching
              </h3>
              <p className="text-gray-700">
                Learn from God's Word with practical messages for everyday life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Sermons */}
      <section className="container py-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center" style={{ color: "#047857" }}>
          Latest Sermons
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Listen to recent messages from our pastoral team
        </p>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {latestSermons.length > 0 ? (
            latestSermons.map((sermon) => (
              <Link
                key={sermon.id}
                href={`/sermons/${sermon.id}`}
                className="sermon-card-home bg-white rounded-lg overflow-hidden hover:shadow-xl transition group border-2" style={{ borderColor: "#E8EDE8" }}
              >
                <div className="p-6">
                  <p className="text-sm font-bold mb-2" style={{ color: "#7A9FA3" }}>
                    {new Date(sermon.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition" style={{ color: "#047857" }}>
                    {sermon.title}
                  </h3>
                  <p className="font-semibold mb-3" style={{ color: "#6CBFDB" }}>
                    {sermon.preacher}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {sermon.description}
                  </p>
                  <p className="text-accent font-bold">Listen Now →</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-3">
              No sermons available yet.
            </p>
          )}
        </div>
        <div className="text-center">
          <Link href="/sermons" className="px-8 py-3 border-2 font-bold rounded-lg transition" style={{ borderColor: "#047857", color: "#047857" }}>
            View All Sermons
          </Link>
        </div>
      </section>

      {/* Upcoming Events */}
      <section style={{ backgroundColor: "#FFF8F0" }} className="py-20">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center" style={{ color: "#047857" }}>
            Upcoming Events
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Be part of our community activities and spiritual growth opportunities
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition group border-2" style={{ borderColor: "#E8EDE8" }}
                  >
                    <div className="p-6">
                      <p className="text-sm font-bold mb-2" style={{ color: "#6CBFDB" }}>
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition" style={{ color: "#047857" }}>
                        {event.title}
                      </h3>
                      <p className="mb-3 font-semibold" style={{ color: "#6CBFDB" }}>
                        📍 {event.location}
                      </p>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                  </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-3">
                No events scheduled yet.
              </p>
            )}
          </div>
          <div className="text-center">
            <Link href="/events" className="px-8 py-3 font-bold rounded-lg transition" style={{ backgroundColor: "#047857", color: "white" }}>
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "#047857" }}>
              About Lighthouse Christian Assembly
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed text-lg">
              Lighthouse Christian Assembly is a vibrant, welcoming church community dedicated to 
              spreading the Gospel of Jesus Christ and making a positive impact in our neighborhood.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed text-lg">
              We believe in the transformative power of faith, the importance of genuine community, 
              and the life-changing message of Jesus Christ. Whether you're exploring faith for the 
              first time or deepening your relationship with God, there's a place for you here.
            </p>
            <Link href="/about" className="px-8 py-3 font-bold rounded-lg transition" style={{ backgroundColor: "#047857", color: "white" }}>
              Learn More About Us
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg p-8" style={{ backgroundColor: "#C5E0B8" }}>
              <p className="text-4xl font-bold text-white mb-2">500+</p>
              <p className="text-white font-semibold">Active Members</p>
            </div>
            <div className="rounded-lg p-8" style={{ backgroundColor: "#6CBFDB" }}>
              <p className="text-4xl font-bold text-white mb-2">2</p>
              <p className="text-white font-semibold">Weekly Services</p>
            </div>
            <div className="rounded-lg p-8" style={{ backgroundColor: "#047857" }}>
              <p className="text-4xl font-bold text-white mb-2">20+</p>
              <p className="text-white font-semibold">Annual Events</p>
            </div>
            <div className="rounded-lg p-8" style={{ backgroundColor: "#6CBFDB" }}>
              <p className="text-4xl font-bold text-white mb-2">✨</p>
              <p className="text-white font-semibold">God's Love</p>
            </div>
          </div>
        </div>
      </section>

      {/* Youth Camp CTA - Enhanced */}
      <section style={{ backgroundImage: "linear-gradient(135deg, #047857 0%, #6CBFDB 100%)" }} className="text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
            <circle cx="200" cy="200" r="300" fill="currentColor" />
            <circle cx="1000" cy="100" r="250" fill="currentColor" />
          </svg>
        </div>
        
        <div className="container relative z-10 text-center">
          <p className="font-bold mb-2 text-lg" style={{ color: "#C5E0B8" }}>COMING SOON</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Youth Summer Camp
          </h2>
          <p className="text-lg mb-8 text-gray-200 max-w-2xl mx-auto">
            An unforgettable spiritual experience for young people featuring worship, fellowship, games, and deep spiritual growth. Don't miss this incredible opportunity!
          </p>
          <Link
            href="/events"
            className="px-8 py-4 font-bold rounded-lg transition inline-block" style={{ backgroundColor: "#C5E0B8", color: "#047857" }}
          >
            Learn More & Register →
          </Link>
        </div>
      </section>

      {/* Connect Section */}
      <section style={{ backgroundColor: "#FFF8F0" }} className="py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-8" style={{ color: "#047857" }}>
            Ready to Connect?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Join us this Sunday or reach out with any questions. We'd love to welcome you to our church family.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact" className="px-8 py-3 font-bold rounded-lg transition" style={{ backgroundColor: "#047857", color: "white" }}>
              Contact Us
            </Link>
            <Link href="/about" className="px-8 py-3 font-bold rounded-lg transition border-2" style={{ borderColor: "#047857", color: "#047857" }}>
              Get to Know Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
