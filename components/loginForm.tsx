'use client'
import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { redirect, useRouter } from 'next/navigation';

export default function LoginFrom() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Redirect or show success message
            console.log("User logged in successfully!");
            router.push("/marketing"); // Correct way to navigate
        } catch (error) {
            setError((error as Error).message);
            console.error("Error logging in:", (error as Error).message);
        }
    };
    return (
        <div className="lg:p-8 p-4">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Login to your account
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email and password to login
                    </p>
                </div>
                <div className="flex flex-col space-y-4">
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full"
                    />
                    <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full"
                    />
                    <Button className="w-full" onClick={handleLogin}>
                        Login with Email
                    </Button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
            </div>
        </div>
    );
}
