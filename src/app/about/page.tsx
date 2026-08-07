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
          <p>
            Welcome to Krishna Palace, a sanctuary of elegance and comfort situated in the vibrant heart of the city. Since our inception, we have been dedicated to providing our guests with an unforgettable experience that blends traditional hospitality with modern luxury.
          </p>
          <p>
            Our commitment to excellence is reflected in every detail of our hotel, from the meticulously designed rooms and suites to our world-class dining and wellness facilities. Whether you are traveling for business or leisure, Krishna Palace offers the perfect environment to relax, rejuvenate, and create lasting memories.
          </p>
          <p>
            We take pride in our dedicated staff, who are available around the clock to ensure your stay is flawless. At Krishna Palace, you are not just a guest; you are a valued member of our extended family.
          </p>
        </div>
      </div>
    </div>
  );
}
