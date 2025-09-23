
import { AppLogo } from "@/components/AppLogo";
import { AnimatedDiagram } from "@/components/auth/AnimatedDiagram";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-tr from-secondary via-background to-secondary/20" />
      <div className="absolute inset-0 bg-[url(/grid.svg)] bg-repeat [mask-image:radial-gradient(ellipse_at_center,transparent_1%,black)]" />
      <div className="relative z-10 grid min-h-screen w-full grid-cols-1 items-center justify-center lg:grid-cols-2">
        <div className="hidden lg:flex items-center justify-center">
          <AnimatedDiagram />
        </div>
        <div className="flex items-center justify-center p-4">
            {children}
        </div>
      </div>
    </main>
  );
}
