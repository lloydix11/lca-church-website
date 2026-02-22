import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 10; // Revalidate every 10 seconds

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
  .sermon-card {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  .sermon-card:nth-child(1) { animation-delay: 0.1s; }
  .sermon-card:nth-child(2) { animation-delay: 0.2s; }
  .sermon-card:nth-child(3) { animation-delay: 0.3s; }
  .sermon-card:nth-child(n+4) { animation-delay: 0.1s; }
`;

export default async function SermonsPage() {
  let sermons: any[] = [];
  try {
    sermons = await prisma.sermon.findMany({
      orderBy: { date: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch sermons:", error);
    sermons = [];
  }

  return (
    <div className="bg-gradient-to-b from-primary-50 to-cream">
      <style>{styles}</style>
      <div className="container py-12">
        <Link href="/" className="text-primary-600 hover:text-primary-700 mb-6 inline-block">
          ← Back to Home
        </Link>

        <h1 className="heading-lg mb-2">Sermons</h1>
        <p className="text-gray-600 mb-12 text-lg">
          Listen to our latest sermons and grow in your faith journey.
        </p>

        {sermons.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.map((sermon) => (
              <Link
                key={sermon.id}
                href={`/sermons/${sermon.id}`}
                className="sermon-card card group h-full flex flex-col"
              >
                {sermon.coverImageUrl && (
                  <div className="mb-4 -m-6 mb-4 h-40 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={sermon.coverImageUrl}
                      alt={sermon.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                )}
                <p className="text-sm text-accent font-semibold">
                  {new Date(sermon.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h3 className="heading-md group-hover:text-accent transition mb-2 flex-1">
                  {sermon.title}
                </h3>
                <p className="text-primary-600 font-semibold mb-2">
                  by {sermon.preacher}
                </p>
                <p className="text-gray-600 line-clamp-3">
                  {sermon.description}
                </p>
                <div className="mt-4 text-accent font-semibold">
                  Read More →
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No sermons available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
