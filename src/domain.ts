export const MAX_AMOUNT_IN_CENTS = 99_999_999;

export const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;

export type MealType = (typeof MEAL_TYPES)[number];

export type Expense = {
  id: string;
  amountInCents: number;
  date: string;
  mealType?: MealType;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type Backup = {
  version: 1;
  exportedAt: string;
  expenses: Expense[];
};

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const AMOUNT_PATTERN = /^\d{1,6}(?:[.,]\d{1,2})?$/;

export function parseAmountToCents(value: string): number | null {
  const normalized = value.trim().replace(",", ".");

  if (!AMOUNT_PATTERN.test(normalized)) {
    return null;
  }

  const [whole, fraction = ""] = normalized.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return cents > 0 && cents <= MAX_AMOUNT_IN_CENTS ? cents : null;
}

export function formatCurrency(amountInCents: number): string {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(amountInCents / 100);
}

export function isValidLocalDate(value: string): boolean {
  const match = DATE_PATTERN.exec(value);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function isExpense(value: unknown): value is Expense {
  if (!isRecord(value)) {
    return false;
  }

  const mealType = value.mealType;
  const note = value.note;

  return (
    typeof value.id === "string" &&
    value.id.length > 0 &&
    value.id.length <= 100 &&
    Number.isInteger(value.amountInCents) &&
    Number(value.amountInCents) > 0 &&
    Number(value.amountInCents) <= MAX_AMOUNT_IN_CENTS &&
    typeof value.date === "string" &&
    isValidLocalDate(value.date) &&
    (mealType === undefined || MEAL_TYPES.includes(mealType as MealType)) &&
    (note === undefined || (typeof note === "string" && note.length <= 120)) &&
    isValidTimestamp(value.createdAt) &&
    isValidTimestamp(value.updatedAt)
  );
}

export function createBackup(expenses: Expense[], exportedAt = new Date().toISOString()): Backup {
  return {
    version: 1,
    exportedAt,
    expenses: sortExpenses(expenses),
  };
}

export function parseBackup(raw: string): Backup {
  let value: unknown;

  try {
    value = JSON.parse(raw);
  } catch {
    throw new Error("备份文件不是有效的 JSON。 ");
  }

  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.expenses)) {
    throw new Error("备份格式或版本不受支持。 ");
  }

  if (!isValidTimestamp(value.exportedAt) || !value.expenses.every(isExpense)) {
    throw new Error("备份中包含无效记录。 ");
  }

  const ids = new Set(value.expenses.map((expense) => expense.id));
  if (ids.size !== value.expenses.length) {
    throw new Error("备份中包含重复记录。 ");
  }

  return {
    version: 1,
    exportedAt: value.exportedAt,
    expenses: sortExpenses(value.expenses),
  };
}

export function mergeExpenses(current: Expense[], incoming: Expense[]): Expense[] {
  const byId = new Map(current.map((expense) => [expense.id, expense]));

  for (const expense of incoming) {
    const existing = byId.get(expense.id);
    if (!existing || expense.updatedAt > existing.updatedAt) {
      byId.set(expense.id, expense);
    }
  }

  return sortExpenses([...byId.values()]);
}

export function sumExpenses(expenses: Expense[]): number {
  return expenses.reduce((total, expense) => total + expense.amountInCents, 0);
}

export function sortExpenses(expenses: Expense[]): Expense[] {
  return [...expenses].sort(
    (left, right) => right.date.localeCompare(left.date) || right.createdAt.localeCompare(left.createdAt),
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidTimestamp(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}
