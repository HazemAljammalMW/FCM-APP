'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast'; // For better error feedback
import { login } from '@/app/api/auth/login';

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // Loading state for better UX

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await login(formData);

      if (response?.ok) {
        router.push('/marketing'); // Redirect on success
        toast.success('Login successful!');
      } else {
        // Handle errors with user-friendly feedback
        const errorMessage = response?.error || 'Login failed. Please try again.';
        toast.error(errorMessage);

        if (response?.errors) {
          console.error('Validation errors:', response.errors);
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex flex-col gap-6')}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm">Enter your email below to login.</p>
      </div>

      <div className="grid gap-6">
        {/* Email Input */}
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="name@example.com"
            required
            disabled={isLoading}
            className="p-2 border rounded"
          />
        </div>

        {/* Password Input */}
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="********"
            required
            disabled={isLoading}
            className="p-2 border rounded"
          />
        </div>

        {/* Login Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>

        {/* Separator */}
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>

        {/* Microsoft Login Button */}
        <Button variant="outline" className="w-full" disabled={isLoading}>
          <svg width="150" height="150" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="5" width="40" height="40" fill="#F25022" />
            <rect x="50" y="5" width="40" height="40" fill="#7FBA00" />
            <rect x="5" y="50" width="40" height="40" fill="#00A4EF" />
            <rect x="50" y="50" width="40" height="40" fill="#FFB900" />
          </svg>
          Continue with Microsoft
        </Button>
      </div>
    </form>
  );
}