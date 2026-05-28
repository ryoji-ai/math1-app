"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppState, isWeak } from "@/lib/progress-store";
import { getGroupsByUnit, units } from "@/data/units";

type Row = {
  key: string;
  label: string;
  href: string;
  attempts: number;
  correct: number;
  weak: boolean;
};

export function ProgressDashboard() {
  const { state, hydrated, resetProgress } = useAppState();
  const [confirmReset, setConfirmReset] = useState(false);

  const { unitSections, totals } = useMemo(() => {
    const unitSections = units.map((u) => {
      const rows: Row[] = getGroupsByUnit(u.id).map((g) => {
        const entry = state.progress[g.id];
        return {
          key: g.id,
          label: g.name,
          href: `/practice/${u.id}?group=${g.id}`,
          attempts: entry?.attempts ?? 0,
          correct: entry?.correct ?? 0,
          weak: isWeak(entry),
        };
      });
      return { unit: u, rows };
    });
    let attempts = 0;
    let correct = 0;
    for (const e of Object.values(state.progress)) {
      attempts += e.attempts;
      correct += e.correct;
    }
    return {
      unitSections,
      totals: { attempts, correct, rate: attempts === 0 ? 0 : correct / attempts },
    };
  }, [state.progress]);

  if (!hydrated) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          進捗を読み込み中…
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="連続学習日数" value={`${state.streakDays} 日`} />
        <Stat label="解いた数" value={`${totals.attempts}`} />
        <Stat
          label="方針 正答率"
          value={totals.attempts === 0 ? "—" : `${Math.round(totals.rate * 100)}%`}
        />
      </div>

      {unitSections.map(({ unit, rows }) => (
        <Card key={unit.id}>
          <CardHeader>
            <CardTitle className="text-base">{unit.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <RowList rows={rows} />
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        {!confirmReset ? (
          <Button variant="outline" size="sm" onClick={() => setConfirmReset(true)}>
            進捗をリセット
          </Button>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <span>本当に消しますか？</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
              }}
            >
              消す
            </Button>
            <Button variant="outline" size="sm" onClick={() => setConfirmReset(false)}>
              やめる
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="py-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 math-display text-3xl">{value}</p>
      </CardContent>
    </Card>
  );
}

function RowList({ rows }: { rows: Row[] }) {
  const hasData = rows.some((r) => r.attempts > 0);
  if (!hasData) {
    return (
      <p className="text-sm text-muted-foreground py-3 text-center">
        まだ取り組んでいません。
      </p>
    );
  }
  return (
    <ul className="divide-y divide-border/60">
      {rows.map((row) => {
        if (row.attempts === 0) return null;
        const rate = (row.correct / row.attempts) * 100;
        return (
          <li key={row.key}>
            <Link
              href={row.href}
              className="block hover:bg-accent/40 -mx-3 px-3 py-2 rounded-md"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base">{row.label}</span>
                {row.weak && (
                  <Badge variant="destructive" className="text-[10px]">
                    苦手
                  </Badge>
                )}
                <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                  {row.correct} / {row.attempts}（{Math.round(rate)}%）
                </span>
              </div>
              <Progress value={rate} className="mt-2 h-1.5" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
