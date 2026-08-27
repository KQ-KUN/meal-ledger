import assert from "node:assert/strict";
import test from "node:test";

import {
  createBackup,
  mergeExpenses,
  parseAmountToCents,
  parseBackup,
  sumExpenses,
  type Expense,
} from "../src/domain.ts";

const baseExpense: Expense = {
  id: "expense-1",
  amountInCents: 1250,
  date: "2026-08-27",
  mealType: "lunch",
  note: "Noodles",
  createdAt: "2026-08-27T04:00:00.000Z",
  updatedAt: "2026-08-27T04:00:00.000Z",
};

test("parses valid decimal amounts into exact cents", () => {
  assert.equal(parseAmountToCents("12"), 1200);
  assert.equal(parseAmountToCents("12.3"), 1230);
  assert.equal(parseAmountToCents("12,34"), 1234);
});

test("rejects unsafe amount input", () => {
  for (const value of ["", "0", "-1", "1.234", "1000000", "abc"]) {
    assert.equal(parseAmountToCents(value), null);
  }
});

test("rejects malformed backups without changing the caller's data", () => {
  assert.throws(() => parseBackup("not-json"), /JSON/);
  assert.throws(
    () => parseBackup(JSON.stringify({ version: 1, exportedAt: "bad", expenses: [] })),
    /无效记录/,
  );
});

test("merges a newer imported record and preserves exact totals", () => {
  const updated = {
    ...baseExpense,
    amountInCents: 1380,
    updatedAt: "2026-08-27T05:00:00.000Z",
  };
  const second = {
    ...baseExpense,
    id: "expense-2",
    amountInCents: 2000,
    createdAt: "2026-08-27T06:00:00.000Z",
    updatedAt: "2026-08-27T06:00:00.000Z",
  };

  const backup = parseBackup(JSON.stringify(createBackup([updated, second])));
  const merged = mergeExpenses([baseExpense], backup.expenses);

  assert.equal(merged.length, 2);
  assert.equal(sumExpenses(merged), 3380);
  assert.equal(merged.find((expense) => expense.id === baseExpense.id)?.amountInCents, 1380);
});
