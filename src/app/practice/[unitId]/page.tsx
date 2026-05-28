import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { StrategyDrill } from "@/components/strategy-drill";
import { cn } from "@/lib/utils";
import {
  getGroup,
  getGroupsByUnit,
  getProblemsByGroup,
  getProblemsByUnit,
  getUnit,
  units,
} from "@/data/units";

export function generateStaticParams() {
  return units.map((u) => ({ unitId: u.id }));
}

export default async function PracticePage({
  params,
  searchParams,
}: {
  params: Promise<{ unitId: string }>;
  searchParams: Promise<{ group?: string }>;
}) {
  const { unitId } = await params;
  const { group } = await searchParams;
  const unit = getUnit(unitId);
  if (!unit) notFound();

  const groups = getGroupsByUnit(unit.id);
  const activeGroup =
    group && getGroup(group)?.unitId === unit.id ? getGroup(group) : undefined;
  const problems = activeGroup
    ? getProblemsByGroup(activeGroup.id)
    : getProblemsByUnit(unit.id);
  const label = activeGroup ? activeGroup.name : `${unit.name} 全部`;

  return (
    <PageShell>
      <div className="space-y-6">
        <header className="space-y-1">
          <Link
            href={`/units/${unit.id}`}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ← {unit.name} の見分け方へ
          </Link>
          <h1 className="text-2xl sm:text-3xl">方針選択ドリル</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            まず「どの公式・手法で解くか」を選ぶ。間違えたら見分け方のヒントが出る。
          </p>
        </header>

        <nav className="flex flex-wrap gap-2">
          <FilterChip href={`/practice/${unit.id}`} active={!activeGroup}>
            全部
          </FilterChip>
          {groups.map((g) => (
            <FilterChip
              key={g.id}
              href={`/practice/${unit.id}?group=${g.id}`}
              active={activeGroup?.id === g.id}
            >
              {g.name}
            </FilterChip>
          ))}
        </nav>

        <StrategyDrill
          key={activeGroup?.id ?? "all"}
          problems={problems}
          sessionLabel={label}
        />
      </div>
    </PageShell>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {children}
    </Link>
  );
}
