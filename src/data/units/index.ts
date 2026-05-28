import type { Group, Problem, Unit } from "@/lib/types";
import * as num from "./numbers-expressions";
import * as quad from "./quadratic";
import * as trig from "./trigonometry";
import * as data from "./data-analysis";

// 数学I のカリキュラム順
export const units: Unit[] = [num.unit, quad.unit, trig.unit, data.unit];

export const allGroups: Group[] = [
  ...num.groups,
  ...quad.groups,
  ...trig.groups,
  ...data.groups,
];

export const allProblems: Problem[] = [
  ...num.problems,
  ...quad.problems,
  ...trig.problems,
  ...data.problems,
];

export function getUnit(id: string): Unit | undefined {
  return units.find((u) => u.id === id);
}

export function getGroupsByUnit(unitId: string): Group[] {
  return allGroups.filter((g) => g.unitId === unitId);
}

export function getGroup(id: string): Group | undefined {
  return allGroups.find((g) => g.id === id);
}

export function getProblemsByUnit(unitId: string): Problem[] {
  return allProblems.filter((p) => p.unitId === unitId);
}

export function getProblemsByGroup(groupId: string): Problem[] {
  return allProblems.filter((p) => p.groupId === groupId);
}
