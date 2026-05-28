import { cn } from "@/lib/utils";

// MVP: 数式は Unicode 表記（√19, a²=b²+c²−2bc cosA 等）をきれいに見せるだけ。
// 分数の多いデータ分析を追加する Phase 2 で KaTeX へ差し替える想定。
export function MathText({
  children,
  display,
  className,
}: {
  children: string;
  display?: boolean;
  className?: string;
}) {
  return (
    <span className={cn(display ? "math-display" : "math", className)}>
      {children}
    </span>
  );
}
