
import React from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import RoomsPage from './pages/RoomsPage.jsx';
import RoomDetailsPage from './pages/RoomDetailsPage.jsx';
import GalleryPage from './pages/GalleryPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import BookingConfirmationPage from './pages/BookingConfirmationPage.jsx';
import LoginSignupPage from './pages/LoginSignupPage.jsx';
import CustomerProfilePage from './pages/CustomerProfilePage.jsx';
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
// Offers section merged into HomePage

const PublicLayout = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <AnimatePresence mode="popLayout">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex-grow flex flex-col"
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Toaster position="top-center" richColors />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/rooms" element={<PublicLayout><RoomsPage /></PublicLayout>} />
          <Route path="/room/:roomId" element={<PublicLayout><RoomDetailsPage /></PublicLayout>} />
          <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
          <Route path="/offers" element={<Navigate to="/#offers" replace />} />
          
          <Route path="/login" element={<PublicLayout><LoginSignupPage /></PublicLayout>} />
          <Route path="/signup" element={<PublicLayout><LoginSignupPage /></PublicLayout>} />
          
          {/* Protected Customer Routes */}
          <Route path="/checkout/:roomId/:hours" element={<ProtectedRoute><PublicLayout><CheckoutPage /></PublicLayout></ProtectedRoute>} />
          <Route path="/booking-confirmation/:bookingId" element={<ProtectedRoute><PublicLayout><BookingConfirmationPage /></PublicLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><PublicLayout><CustomerProfilePage /></PublicLayout></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
          
          {/* Catch all */}
          <Route path="*" element={<PublicLayout><div className="py-32 text-center text-2xl font-bold">404 - Page Not Found</div></PublicLayout>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
