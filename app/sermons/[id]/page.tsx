import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 10; // Revalidate every 10 seconds

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const sermon = await prisma.sermon.findUnique({
    where: { id: parseInt(id) },
  });

  return {
    title: sermon?.title || "Sermon",
    description: sermon?.description || "Listen to this sermon from Lighthouse Christian Assembly",
  };
}

export default async function SermonPage({ params }: Props) {
  const { id } = await params;

  const sermon = await prisma.sermon.findUnique({
    where: { id: parseInt(id) },
  });

  if (!sermon) {
    return (
      <div className="container py-12 text-center">
        <h1 className="heading-lg mb-4">Sermon Not Found</h1>
        <p className="text-gray-600 mb-6">The sermon you're looking for doesn't exist.</p>
        <Link href="/sermons" className="btn btn-primary">
          Back to Sermons
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-primary-50 to-cream">
      <div className="container py-12">
        <Link href="/sermons" className="text-primary-600 hover:text-primary-700 mb-6 inline-block">
          ← Back to Sermons
        </Link>

        <article className="max-w-4xl">
          {sermon.coverImageUrl && (
            <div className="mb-8 rounded-lg overflow-hidden h-96 bg-gray-200">
              <img
                src={sermon.coverImageUrl}
                alt={sermon.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="bg-white rounded-lg p-8 shadow-md">
            <p className="text-accent font-semibold text-sm mb-2">
              {new Date(sermon.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <h1 className="heading-lg mb-2">{sermon.title}</h1>

            <p className="text-xl text-primary-600 font-semibold mb-8">
              Preached by {sermon.preacher}
            </p>

            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                {sermon.description}
              </p>
            </div>

            {sermon.youtubeUrl && (
              <div className="mb-8">
                <h2 className="heading-md mb-4">Watch Sermon</h2>
                <div className="relative w-full bg-black rounded-lg overflow-hidden pt-[56.25%]">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={sermon.youtubeUrl.replace("youtube.com/watch?v=", "youtube.com/embed/").replace("youtu.be/", "youtube.com/embed/")}
                    title={sermon.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            <div className="pt-6 border-t">
              <Link href="/sermons" className="btn btn-primary">
                Back to All Sermons
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
