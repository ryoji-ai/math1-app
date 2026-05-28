import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 group">
          <span
            aria-hidden
            className="math-display flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground text-lg shadow-sm"
          >
            sin
          </span>
          <span className="font-semibold tracking-wide">数学I 練習帳</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm">
          <Link
            href="/"
            className="rounded-md px-3 py-1.5 hover:bg-accent hover:text-accent-foreground"
          >
            単元
          </Link>
          <Link
            href="/progress"
            className="rounded-md px-3 py-1.5 hover:bg-accent hover:text-accent-foreground"
          >
            進捗
          </Link>
        </nav>
      </div>
    </header>
  );
}
