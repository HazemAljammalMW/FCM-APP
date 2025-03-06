'use client'
import { Button } from './ui/button'
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import { login } from '@/lib';
import { useActionState } from 'react';


export  function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)



  //   event.preventDefault();
  //   setLoading(true);
  //   setError("");

  //   try {
  //     await signInWithEmailAndPassword(auth, email, password);
  //     console.log("User logged in successfully!");
  //     router.push("/dashboard"); // Redirect after login
  //   } catch (error) {
  //     setError("Invalid email or password. Please try again.");
  //     console.error("Login error:", (error as Error).message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  return (
    <form action={action}
      className={cn("flex flex-col gap-6")} >
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
            name="email" // Add this
            placeholder="name@example.com"
            required
          />
        </div>
        {state?.errors?.email && <p>{state.errors.email}</p>}

        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <input
            id="password"
            type="password"
            name='password' // Add this
            placeholder="********"
            required
          />
        </div>
        {state?.errors?.password && (
          <div>
            <p>Password must:</p>
            <ul>
              {state.errors.password.map((error) => (
                <li key={error}>- {error}</li>
              ))}
            </ul>
          </div>
        )}

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
