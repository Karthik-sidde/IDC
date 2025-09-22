import Image from "next/image";
import { AppLogo } from "@/components/AppLogo";
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center p-4 flex-col">
      <Image
        src="https://picsum.photos/seed/loginbg/1920/1080"
        alt="Abstract futuristic background"
        fill
        className="object-cover"
        data-ai-hint="abstract futuristic"
      />
      <div className="absolute inset-0 bg-background/50 dark:bg-background/80" />
      <div className="absolute top-4 left-4 z-10">
          <AppLogo />
      </div>
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </main>
  );
}
