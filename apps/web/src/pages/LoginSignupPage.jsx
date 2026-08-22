
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Phone, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginSignupPage = () => {
  const [step, setStep] = useState(1); // 1 = Phone input, 2 = Name input (Signup)
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginWithPhone, signupWithPhone } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/profile';

  const formatPhone = (val) => {
    return val.replace(/\D/g, '').slice(0, 10);
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    
    setLoading(true);
    try {
      // Attempt login
      await loginWithPhone(phone);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      // User not found, proceed to signup step
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    setLoading(true);
    try {
      await signupWithPhone(phone, name);
      toast.success('Account created successfully!');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Signup error detail:', err);
      const isForbidden = err?.status === 403 || err?.response?.status === 403;
      const isConflict = err?.status === 400 || err?.response?.status === 400;
      const errMsg = err?.response?.data?.message || err?.data?.message || err?.message || 'Unknown error';
      
      if (isForbidden) {
        toast.error('Signup failed (403): PocketBase permissions are restricted. Please ensure the "users" collection allows "Create" for public.');
      } else if (isConflict) {
        toast.error('Account already exists with this phone number. Please try logging in instead.');
        setStep(1); // Reset to phone input so they can retry login
      } else {
        const fieldErrors = err?.response?.data?.data ? Object.entries(err.response.data.data).map(([k, v]) => `${k}: ${v.message}`).join(', ') : '';
        toast.error(`Signup failed: ${errMsg}${fieldErrors ? ` (${fieldErrors})` : ''}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted/30 flex items-center justify-center py-12 px-4">
      <Helmet><title>Login / Sign Up | Hotel Krishna Palace</title></Helmet>
      
      <div className="max-w-md w-full bg-card rounded-3xl border shadow-xl p-8 overflow-hidden">
        <div className="text-center mb-8">
          <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="font-extrabold text-primary-foreground text-2xl">KP</span>
          </div>
          <h1 className="text-2xl font-bold">Welcome</h1>
          <p className="text-muted-foreground text-sm mt-2">
            {step === 1 ? 'Enter your mobile number to continue' : 'Just one more step to set up your account'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handlePhoneSubmit} 
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-medium">Mobile Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    type="tel" 
                    required 
                    value={phone} 
                    onChange={(e) => setPhone(formatPhone(e.target.value))} 
                    placeholder="10-digit number" 
                    className="pl-11 h-14 text-lg bg-background font-medium tracking-wide"
                    autoFocus
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-14 text-lg rounded-xl mt-6 font-bold shadow-md" disabled={loading || phone.length < 10}>
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Continue'}
              </Button>
            </motion.form>
          ) : (
            <motion.form 
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSignupSubmit} 
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="phone-readonly" className="text-foreground font-medium">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    id="phone-readonly" 
                    value={phone} 
                    disabled 
                    className="pl-11 h-14 text-lg bg-muted text-muted-foreground font-medium tracking-wide opacity-70"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    id="name" 
                    type="text" 
                    required 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Maya Chen" 
                    className="pl-11 h-14 text-lg bg-background font-medium"
                    autoFocus
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <Button type="button" variant="outline" className="h-14 w-1/3 rounded-xl font-bold" onClick={() => setStep(1)} disabled={loading}>
                  Back
                </Button>
                <Button type="submit" className="h-14 w-2/3 rounded-xl font-bold shadow-md" disabled={loading || !name.trim()}>
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Sign Up'}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default LoginSignupPage;
