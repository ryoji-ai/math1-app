import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageShell } from "@/components/page-shell";
import { HomeGreeting } from "@/components/home-greeting";
import { getProblemsByUnit, units } from "@/data/units";

const accents = [
  "from-sky-100 to-sky-50 dark:from-sky-950/40 dark:to-transparent",
  "from-teal-100 to-teal-50 dark:from-teal-950/40 dark:to-transparent",
  "from-cyan-100 to-cyan-50 dark:from-cyan-950/40 dark:to-transparent",
  "from-emerald-100 to-emerald-50 dark:from-emerald-950/40 dark:to-transparent",
];

export default function Home() {
  return (
    <PageShell>
      <div className="space-y-8">
        <HomeGreeting />
        <section>
          <h2 className="mb-3 text-sm font-medium tracking-wider text-muted-foreground">
            単元を選ぶ（数学I 全範囲）
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {units.map((u, i) => (
              <Link key={u.id} href={`/units/${u.id}`} className="group">
                <Card
                  className={`h-full transition-shadow group-hover:shadow-md bg-gradient-to-br ${accents[i % accents.length]}`}
                >
                  <CardHeader>
                    <CardTitle className="text-xl">{u.name}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {u.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 text-xs text-muted-foreground">
                    全 {getProblemsByUnit(u.id).length} 問・開く →
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
        <section>
          <Link
            href="/progress"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            進捗を確認する →
          </Link>
        </section>
      </div>
    </PageShell>
  );
}
