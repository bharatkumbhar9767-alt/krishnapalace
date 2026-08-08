import Image from "next/image";

export const metadata = {
  title: "Gallery | Krishna Palace",
  description: "Explore the luxurious rooms and amenities at Krishna Palace.",
};

const images = [
  { src: "https://images.unsplash.com/photo-1542314831-c53cd4b85d0b?q=80&w=2070", alt: "Hotel Exterior" },
  { src: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070", alt: "Premium Suite" },
  { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070", alt: "Deluxe Room" },
  { src: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2070", alt: "Swimming Pool" },
  { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070", alt: "Restaurant" },
  { src: "https://images.unsplash.com/photo-1560662105-57f8ad6fa5f1?q=80&w=2070", alt: "Lounge Area" },
];

export default function GalleryPage() {
  return (
    <div className="container py-12 md:py-24">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Our Gallery</h1>
        <p className="text-lg text-gray-600">Take a visual tour of Krishna Palace and discover our premium amenities.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((img, i) => (
          <div key={i} className="group relative h-64 md:h-80 overflow-hidden rounded-xl shadow-md">
            <Image 
              src={img.src} 
              alt={img.alt} 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <span className="text-white font-bold p-4 text-lg">{img.alt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
