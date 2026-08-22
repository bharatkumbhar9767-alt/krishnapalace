
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import GalleryImage from '@/components/GalleryImage';
import GalleryLightbox from '@/components/GalleryLightbox';
import { motion } from 'framer-motion';

const GalleryContent = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState(null);

  const categories = ['All', 'Room', 'Amenity', 'Dehu Attraction', 'Other'];

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await pb.collection('gallery').getFullList({
          sort: '-created',
          $autoCancel: false
        });
        setImages(result);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

  const handleNavigate = (direction) => {
    if (selectedIndex === null) return;
    let newIndex = selectedIndex + direction;
    if (newIndex < 0) newIndex = filteredImages.length - 1;
    if (newIndex >= filteredImages.length) newIndex = 0;
    setSelectedIndex(newIndex);
  };

  return (
    <main className="min-h-screen bg-background py-16 lg:py-24">
      <Helmet>
        <title>Gallery | Hotel Krishna Palace</title>
      </Helmet>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-foreground">Our Gallery</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take a visual tour of our facilities, comfortable rooms, and the beautiful surroundings of Dehu Road.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                filter === cat 
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                  : 'bg-card text-muted-foreground border hover:bg-muted hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <LoadingSpinner size="lg" className="min-h-[40vh]" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gallery-grid">
            {filteredImages.map((img, index) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 12) * 0.05 }}
              >
                <GalleryImage 
                  img={img} 
                  onClick={() => setSelectedIndex(index)} 
                />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredImages.length === 0 && (
          <div className="text-center py-32 text-muted-foreground bg-muted/20 rounded-3xl border border-dashed">
            <p className="text-lg font-medium">No images found for this category.</p>
          </div>
        )}
      </div>

      <GalleryLightbox 
        images={filteredImages}
        currentIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onNavigate={handleNavigate}
      />
    </main>
  );
};

const GalleryPage = () => <ErrorBoundary><GalleryContent /></ErrorBoundary>;
export default GalleryPage;
