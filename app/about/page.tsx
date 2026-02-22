import Link from "next/link";
import Image from "next/image";

export default function About() {
  return (
    <div className="bg-gradient-to-b from-primary-50 to-cream">
      <div className="container py-12">
        <Link href="/" className="text-primary-600 hover:text-primary-700 mb-6 inline-block">
          ← Back to Home
        </Link>

        <h1 className="heading-lg mb-8">About Us</h1>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="heading-md mb-4 text-primary-600">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Lighthouse Christian Assembly was founded on the belief that every person
              deserves to experience the transformative power of God's love. For years, we've
              been a steadfast beacon of faith in our community.
            </p>
            <p className="text-gray-600 mb-4">
              Our church is built on core values of faith, hope, charity, and unity. We
              welcome all people, regardless of background, to join us in worship and fellowship.
            </p>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-bold text-primary-700 mb-2">📖 Our Mission</h3>
              <p className="text-gray-600">
                To spread the Gospel of Jesus Christ and serve our community with love
                and compassion.
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-bold text-primary-700 mb-2">✨ Our Vision</h3>
              <p className="text-gray-600">
                To be a beacon of hope, guiding people toward spiritual growth and
                meaningful connection with God and each other.
              </p>
            </div>
          </div>
        </div>

        <section className="bg-white rounded-lg p-8 mb-12">
          <h2 className="heading-md mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: "⛪", title: "Faith", desc: "Trust in God's plan" },
              { icon: "❤️", title: "Love", desc: "Care for one another" },
              { icon: "🤝", title: "Community", desc: "Unity in Christ" },
              { icon: "🌟", title: "Growth", desc: "Spiritual development" },
            ].map((value) => (
              <div key={value.title} className="text-center">
                <p className="text-4xl mb-2">{value.icon}</p>
                <h3 className="font-bold text-primary-700 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="heading-md mb-6">Church Leadership</h2>
          <p className="text-gray-600 mb-6">
            Our church is led by a dedicated team of pastors and volunteers committed to
            serving our congregation and community.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "Ptr. Edwin Gumadan", role: "Senior Pastor", image: "/pas.edwin.jpg" },
              { name: "Ptr. Andrew Jehiel Gumadan", role: "Associate Pastor", image: "/ps.andrew.jpg" },
            ].map((leader) => (
              <div key={leader.name} className="card">
                {leader.image ? (
                  <div className="w-24 h-24 rounded-full bg-primary-200 mb-4 overflow-hidden">
                    <Image 
                      src={leader.image} 
                      alt={leader.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary-200 mb-4"></div>
                )}
                <h3 className="font-bold text-lg text-primary-700">{leader.name}</h3>
                <p className="text-sm text-gray-600">{leader.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
