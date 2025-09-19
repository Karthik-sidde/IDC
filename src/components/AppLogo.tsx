import { AreaChart } from "lucide-react";
import Link from "next/link";

export function AppLogo() {
  return (
    <Link
      href="/"
      className="flex items-center justify-center gap-2"
      data-sidebar="logo"
    >
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <AreaChart className="size-5" />
      </div>
      <span className="text-lg font-bold font-headline tracking-tighter text-primary group-data-[collapsible=icon]:hidden">
        IDC
      </span>
    </Link>
  );
}
