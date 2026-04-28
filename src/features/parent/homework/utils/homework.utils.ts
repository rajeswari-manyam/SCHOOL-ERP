import type { Homework } from "../types/homework.types";

export function filterHomeworkByDay(data: Homework[], day: number | null) {
    if (!day) return data;
    return data.filter((h) => h.day >= day);  // ← changed === to >=
}

export function groupBySubject(data: Homework[]): Record<string, Homework[]> {
    return data.reduce<Record<string, Homework[]>>((acc, item) => {
        if (!acc[item.subject]) acc[item.subject] = [];
        acc[item.subject].push(item);
        return acc;
    }, {});
}

export function sortByDueDate(data: Homework[]) {
    return [...data].sort((a, b) => a.day - b.day);
}