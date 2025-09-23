
import { AppLogo } from "@/components/AppLogo";
import { AnimatedDiagram } from "@/components/auth/AnimatedDiagram";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4 bg-gradient-to-tr from-secondary via-background to-secondary/20">
       <div className="absolute inset-0 z-0 h-full w-full bg-background">
          
       </div>

      <div className="relative z-10 grid w-full max-w-5xl grid-cols-1 items-center gap-16 md:grid-cols-2">
        <div className="hidden md:block">
            <AnimatedDiagram />
        </div>
        <div className="w-full">
          {children}
        </div>
      </div>
    </main>
  );
}
