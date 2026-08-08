"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "./actions";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    
    const result = await registerUser(formData);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Auto-login after successful registration
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    const signInResult = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (signInResult?.error) {
      setError("Registration successful, but auto-login failed. Please log in manually.");
      setLoading(false);
      router.push("/login");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-gray-900">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link href="/login" className="font-medium text-primary hover:text-primary/80">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" action={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-1 block w-full"
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full font-bold"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
