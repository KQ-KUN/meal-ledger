import { isExpense, sortExpenses, type Expense } from "./domain.ts";

const STORAGE_KEY = "meal-ledger:expenses:v1";

export function loadExpenses(): Expense[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  const value: unknown = JSON.parse(raw);
  if (!Array.isArray(value) || !value.every(isExpense)) {
    throw new Error("本地数据格式无效，请先导出浏览器站点数据再排查。 ");
  }

  return sortExpenses(value);
}

export function saveExpenses(expenses: Expense[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sortExpenses(expenses)));
}

export function clearExpenses(): void {
  localStorage.removeItem(STORAGE_KEY);
}
