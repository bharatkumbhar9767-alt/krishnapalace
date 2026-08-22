
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, ShieldAlert, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Must target 'admin_users' collection per database schema
      await pb.collection('admin_users').authWithPassword(email, password, { $autoCancel: false });
      toast.success('Admin login successful');
      window.location.href = '/admin'; // Hard reload to populate context properly
    } catch (err) {
      console.error(err);
      toast.error('Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--admin-bg))] flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in relative">
      <Button 
        variant="ghost" 
        className="absolute top-6 left-6 text-muted-foreground hover:text-foreground"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Website
      </Button>

      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-slide-up">
        <div className="flex justify-center mb-8">
          <div className="bg-primary w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
            <ShieldAlert className="w-10 h-10 text-primary-foreground" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-foreground tracking-tight">
          Admin Secure Portal
        </h2>
        <p className="mt-3 text-center text-sm text-muted-foreground font-medium">
          Hotel Krishna Palace Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-[hsl(var(--admin-card))] py-10 px-6 shadow-2xl border shadow-black/5 sm:rounded-3xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Administrator Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hotelkrishnapalace.com"
                className="bg-[hsl(var(--admin-input))] h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-[hsl(var(--admin-input))] h-12"
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base transition-all active:scale-[0.98]" size="lg" disabled={loading}>
              {loading ? 'Authenticating...' : <><Lock className="w-5 h-5 mr-2" /> Sign in securely</>}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
