'use client';

import { login } from '@/app/api/auth/login';
import { cn } from '@/lib/utils';
import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from './ui/label';
import { Button } from './ui/button';

export function LoginForm() {
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    try {
      const response = await login(formData);

      if (response?.ok) {
        router.push('/marketing');
      } else {
        // Handle errors
        console.error(response?.error || 'Login failed');
        if (response?.errors) {
          console.error("Validation errors:", response.errors);
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex flex-col gap-6')}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm">Enter your email below to login.</p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="name@example.com"
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="********"
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Login
        </Button>

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>

        <Button variant="outline" className="w-full">
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