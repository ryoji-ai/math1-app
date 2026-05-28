import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { MathText } from "@/components/math-text";
import { cn } from "@/lib/utils";
import { getGroupsByUnit, getProblemsByGroup, getUnit, units } from "@/data/units";

export function generateStaticParams() {
  return units.map((u) => ({ unitId: u.id }));
}

export default async function UnitHubPage({
  params,
}: {
  params: Promise<{ unitId: string }>;
}) {
  const { unitId } = await params;
  const unit = getUnit(unitId);
  if (!unit) notFound();
  const groups = getGroupsByUnit(unit.id);

  return (
    <PageShell>
      <div className="space-y-8">
        <header className="space-y-1">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
            ← 単元一覧へ
          </Link>
          <h1 className="text-2xl sm:text-3xl">{unit.name}</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {unit.description}
          </p>
        </header>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{unit.guide.title}</CardTitle>
            <CardDescription className="leading-relaxed">
              {unit.guide.intro}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {unit.guide.rules.map((rule, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-md border bg-muted/30 px-4 py-3"
                >
                  <span className="math-display text-primary">{i + 1}</span>
                  <MathText className="block text-sm leading-relaxed">{rule}</MathText>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <section>
          <h2 className="mb-3 text-sm font-medium tracking-wider text-muted-foreground">
            グループを選んで練習
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {groups.map((g) => (
              <Link
                key={g.id}
                href={`/practice/${unit.id}?group=${g.id}`}
                className="group"
              >
                <Card className="h-full transition-shadow group-hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">{g.name}</CardTitle>
                    <CardDescription className="leading-relaxed">
                      {g.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 text-xs text-muted-foreground">
                    {getProblemsByGroup(g.id).length} 問
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="flex justify-center">
          <Link
            href={`/practice/${unit.id}`}
            className={cn(buttonVariants(), "px-4")}
          >
            この単元を全部ドリルする →
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
