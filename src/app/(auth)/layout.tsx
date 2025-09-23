
import { AppLogo } from "@/components/AppLogo";
import { AnimatedDiagram } from "@/components/auth/AnimatedDiagram";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4 bg-gradient-to-tr from-secondary via-background to-secondary/20">
      {children}
    </main>
  );
}
