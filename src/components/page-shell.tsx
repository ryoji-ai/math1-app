import { SiteHeader } from "@/components/site-header";
import type { ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-10">
        {children}
      </main>
      <footer className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        数学I 練習帳 — for daughter
      </footer>
    </>
  );
}
