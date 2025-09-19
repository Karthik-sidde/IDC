import { PartyPopper } from "lucide-react";

export function AppLogo() {
  return (
    <div className="flex items-center justify-center gap-2" data-sidebar="logo">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <PartyPopper className="size-5" />
      </div>
      <span className="text-lg font-bold font-headline tracking-tighter text-primary group-data-[collapsible=icon]:hidden">
        Eventide
      </span>
    </div>
  );
}
