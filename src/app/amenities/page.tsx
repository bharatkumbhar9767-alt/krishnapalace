import { Wifi, Coffee, Tv, Car, Shield, Wind, Utensils, Waves } from "lucide-react";

export const metadata = {
  title: "Amenities | Krishna Palace",
  description: "Discover the premium amenities offered at Krishna Palace.",
};

const amenities = [
  { icon: <Wifi className="w-10 h-10 text-primary" />, title: "Free High-Speed WiFi", desc: "Stay connected throughout the property with our premium wireless internet." },
  { icon: <Coffee className="w-10 h-10 text-primary" />, title: "Complimentary Breakfast", desc: "Start your day right with our extensive buffet breakfast." },
  { icon: <Utensils className="w-10 h-10 text-primary" />, title: "In-House Restaurant", desc: "Enjoy delicious local and multi-cuisine dishes prepared by expert chefs." },
  { icon: <Waves className="w-10 h-10 text-primary" />, title: "Swimming Pool", desc: "Relax and rejuvenate in our temperature-controlled outdoor pool." },
  { icon: <Car className="w-10 h-10 text-primary" />, title: "Valet Parking", desc: "Secure and hassle-free parking for all our guests." },
  { icon: <Shield className="w-10 h-10 text-primary" />, title: "24/7 Security", desc: "Round-the-clock security and surveillance for your peace of mind." },
  { icon: <Wind className="w-10 h-10 text-primary" />, title: "Air Conditioning", desc: "Climate-controlled rooms ensuring maximum comfort." },
  { icon: <Tv className="w-10 h-10 text-primary" />, title: "Smart TV", desc: "Entertainment at your fingertips with pre-loaded streaming apps." },
];

export default function AmenitiesPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container py-12 md:py-24">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Hotel Amenities</h1>
          <p className="text-lg text-gray-600">
            We provide everything you need for a comfortable and memorable stay. 
            Experience premium hospitality with our carefully curated facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {amenities.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="bg-gray-50 p-4 rounded-full mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
