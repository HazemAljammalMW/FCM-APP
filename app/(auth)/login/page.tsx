import Image from "next/image"
import LoginFrom from "@/components/loginForm";

export default function Page() {
    return (
        <>
            {/* Mobile View */}
            <div className="md:hidden">
                <Image
                    src="/examples/authentication-light.png"
                    width={1280}
                    height={843}
                    alt="Authentication"
                    className="block dark:hidden"
                />
                <Image
                    src="/examples/authentication-dark.png"
                    width={1280}
                    height={843}
                    alt="Authentication"
                    className="hidden dark:block"
                />
            </div>

            {/* Desktop View */}
            <div className="container relative h-screen flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                {/* Left Side (Image or Branding) */}
                <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                    <div className="absolute inset-0 bg-slate-200" />
                    <div className="relative z-20 flex items-center text-lg font-medium">
                        <Image
                            src="/logo.png"
                            width={208}
                            height={40}
                            alt="Logo"
                            className="mr-2"
                        />
                    </div>
                </div>

                {/* Right Side (Login Form) */}
                <div className="lg:p-8 p-4 w-full max-w-md mx-auto">
                    <LoginFrom />
                </div>
            </div>
        </>
    );
}
