import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold tracking-tight text-center mb-8">About Krishna Palace</h1>
        
        <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
            alt="Krishna Palace Exterior"
            fill
            className="object-cover"
          />
        </div>
        
        <div className="space-y-6 text-lg text-muted-foreground">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
          <p>
            Established with a vision to provide exceptional comfort and convenience, Hotel Krishna Palace has grown to become a preferred choice for travelers in Pune and Dehu Road. We understand that whether you are traveling for business, pilgrimage, or leisure, your accommodation plays a crucial role in your overall experience.
          </p>
          <p>
            Our mission is to seamlessly blend modern amenities with authentic Indian hospitality. We recognized the need for flexible accommodations in our bustling city, which is why we pioneered flexible hourly booking options alongside traditional overnight stays, ensuring our guests only pay for the time they truly need.
          </p>
          <p>
            Driven by our core values of integrity, cleanliness, and guest satisfaction, every team member at Krishna Palace is dedicated to creating a welcoming sanctuary. We continually invest in upgrading our facilities and training our staff to exceed your expectations.
          </p>
        </div>
      </div>
    </div>
  );
}
