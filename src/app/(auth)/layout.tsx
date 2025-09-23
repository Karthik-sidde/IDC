
import { AppLogo } from "@/components/AppLogo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4 flex-col bg-gradient-to-tr from-secondary via-background to-secondary/20">
      <div className="absolute top-4 left-4 z-10">
          <AppLogo />
      </div>
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </main>
  );
}
