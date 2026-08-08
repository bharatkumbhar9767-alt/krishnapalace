export const metadata = {
  title: "Nearby Attractions | Krishna Palace",
  description: "Explore places to visit near Krishna Palace.",
};

const attractions = [
  { name: "Shri Sant Tukaram Maharaj Gatha Mandir", distance: "2.1 km", desc: "A magnificent temple dedicated to the great saint Tukaram Maharaj." },
  { name: "MCA International Stadium", distance: "4.5 km", desc: "Famous cricket stadium located in Gahunje, near Dehu Road." },
  { name: "Appu Ghar (Nigdi)", distance: "8.2 km", desc: "A popular amusement park for families and kids." },
  { name: "Bhakti Shakti Circle", distance: "7.0 km", desc: "An iconic monument depicting Chhatrapati Shivaji Maharaj and Sant Tukaram." },
];

export default function AttractionsPage() {
  return (
    <div className="container py-12 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Nearby Attractions</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Krishna Palace is centrally located, offering easy access to the city's most famous landmarks and business districts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-4">Top Places to Visit</h2>
          <div className="space-y-6">
            {attractions.map((item, i) => (
              <div key={i} className="flex gap-4 p-4 border rounded-lg bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded flex items-center justify-center font-bold shrink-0 text-center text-sm px-2">
                  {item.distance}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-200">
          <div className="aspect-square md:aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121013.91850125791!2d73.68417578330138!3d18.729115197825384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b6f4e64811ed%3A0xcb17afcf63897d2e!2sDehu%20Road%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1715421598218!5m2!1sen!2sin" 
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
