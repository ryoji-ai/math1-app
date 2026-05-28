"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MathText } from "@/components/math-text";
import { useAppState } from "@/lib/progress-store";
import type { Problem } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  problems: Problem[];
  sessionLabel: string;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function StrategyDrill({ problems, sessionLabel }: Props) {
  const { recordResult } = useAppState();
  const ordered = useMemo(() => shuffle(problems), [problems]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  if (ordered.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          この単元にはまだ問題がありません。
        </CardContent>
      </Card>
    );
  }

  const current = ordered[index];
  const total = ordered.length;
  const wasCorrect = submitted && selected === current.strategy.answerIndex;
  const progressValue = ((index + (submitted ? 1 : 0)) / total) * 100;

  function submit() {
    if (selected === null) return;
    const correct = selected === current.strategy.answerIndex;
    setSubmitted(true);
    if (correct) setCorrectCount((c) => c + 1);
    recordResult(current.groupId, correct);
  }

  function next() {
    if (index === total - 1) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setSubmitted(false);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setSubmitted(false);
    setCorrectCount(0);
    setDone(false);
  }

  if (done) {
    const rate = Math.round((correctCount / total) * 100);
    return (
      <Card>
        <CardContent className="py-10 text-center space-y-4">
          <p className="text-sm text-muted-foreground">{sessionLabel} 終了</p>
          <p className="math-display text-4xl">
            {correctCount} / {total}
          </p>
          <p className="text-lg">
            方針の正答率 <span className="font-semibold">{rate}%</span>
          </p>
          <p className="text-sm text-muted-foreground">
            {rate >= 80
              ? "見分け方がしっかり身についてきている。"
              : "間違えた問題の「見分けの極意」をもう一度読んでみよう。"}
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <Button onClick={restart}>もう一度</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Progress value={progressValue} className="flex-1" />
        <span className="text-xs text-muted-foreground tabular-nums">
          {index + 1} / {total}
        </span>
      </div>

      <Card>
        <CardContent className="space-y-5 py-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {current.level}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {current.topic}
            </Badge>
          </div>

          <MathText className="block text-base sm:text-lg leading-relaxed">
            {current.question}
          </MathText>

          {current.figure && (
            <div className="rounded-md border bg-muted/40 px-4 py-3 text-sm">
              <p className="text-xs text-muted-foreground mb-1">図の説明</p>
              <MathText className="block">{current.figure}</MathText>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium">{current.strategy.prompt}</p>
            <div className="grid gap-2">
              {current.strategy.choices.map((choice, i) => {
                const isSelected = selected === i;
                const isAnswer = i === current.strategy.answerIndex;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={submitted}
                    onClick={() => setSelected(i)}
                    className={cn(
                      "w-full rounded-md border px-4 py-3 text-left text-sm sm:text-base transition-colors",
                      !submitted && "hover:bg-accent/60",
                      !submitted && isSelected && "border-primary bg-accent/60",
                      submitted && isAnswer && "border-emerald-500 bg-emerald-500/15",
                      submitted &&
                        isSelected &&
                        !isAnswer &&
                        "border-rose-500 bg-rose-500/15",
                      submitted && !isSelected && !isAnswer && "opacity-60",
                    )}
                  >
                    <span className="text-muted-foreground mr-2 tabular-nums">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {choice}
                  </button>
                );
              })}
            </div>
          </div>

          {!submitted && (
            <div className="flex justify-end">
              <Button onClick={submit} disabled={selected === null}>
                方針を決める
              </Button>
            </div>
          )}

          {submitted && (
            <Feedback problem={current} wasCorrect={wasCorrect} selected={selected} />
          )}

          {submitted && (
            <div className="flex justify-end gap-2">
              <Button onClick={next}>
                {index === total - 1 ? "結果を見る" : "次の問題"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Feedback({
  problem,
  wasCorrect,
  selected,
}: {
  problem: Problem;
  wasCorrect: boolean;
  selected: number | null;
}) {
  return (
    <div className="space-y-4">
      <div
        className={cn(
          "rounded-md border px-4 py-3 text-sm leading-relaxed",
          wasCorrect
            ? "border-emerald-500/50 bg-emerald-500/10"
            : "border-rose-500/50 bg-rose-500/10",
        )}
      >
        <p className="font-semibold mb-1">
          {wasCorrect ? "正解！ 方針が合ってる。" : "おしい！ 方針を見直そう。"}
        </p>
        <p>
          <span className="font-medium">見分けの極意：</span>
          {problem.strategy.why}
        </p>
        {!wasCorrect && problem.strategy.commonMistake && (
          <p className="mt-2 text-muted-foreground">
            <span className="font-medium">よくある勘違い：</span>
            {problem.strategy.commonMistake.whyWrong}
          </p>
        )}
      </div>

      {!wasCorrect && (
        <HintBox problem={problem} selected={selected} />
      )}

      <div className="rounded-md border bg-card px-4 py-3 space-y-2">
        <p className="text-xs text-muted-foreground">答えと解き方</p>
        <MathText display className="block text-base">
          {problem.answer}
        </MathText>
        <ol className="space-y-1 text-sm">
          {problem.solution.map((step, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-muted-foreground tabular-nums">{i + 1}.</span>
              <MathText className="block">{step}</MathText>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function HintBox({
  problem,
  selected,
}: {
  problem: Problem;
  selected: number | null;
}) {
  const [hint, setHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchHint() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: problem.question,
          choices: problem.strategy.choices,
          correctIndex: problem.strategy.answerIndex,
          selectedIndex: selected,
          topic: problem.topic,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "失敗しました");
      setHint(data.hint as string);
    } catch (e) {
      setError(e instanceof Error ? e.message : "失敗しました");
    } finally {
      setLoading(false);
    }
  }

  if (hint) {
    return (
      <div className="rounded-md border border-primary/40 bg-primary/5 px-4 py-3 text-sm leading-relaxed">
        <p className="font-medium mb-1">AIからのヒント</p>
        <p>{hint}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" onClick={fetchHint} disabled={loading}>
        {loading ? "考え中…" : "AIに見分け方のヒントをもらう"}
      </Button>
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </div>
  );
}
