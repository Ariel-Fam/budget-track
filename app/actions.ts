"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

const EXPENSE_ICON_KEYS = [
  "shopping-bag",
  "bolt",
  "bus",
  "clapperboard",
  "home",
  "credit-card",
  "flame",
  "wallet",
];

const SAVING_ICON_KEYS = ["piggy-bank", "wallet", "credit-card", "safe"];
const INVEST_ICON_KEYS = ["line-chart", "chart-line", "banknote", "maple"];
const GOAL_ICON_KEYS = [
  "trophy",
  "target",
  "flag",
  "rocket",
  "gift",
  "piggy-bank",
  "star",
  "gem",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function addExpense(formData: FormData) {
  const amount = Number(formData.get("amount"));
  const category = String(formData.get("category") ?? "Other");
  const name = (formData.get("name") ?? "") as string;
  const description = (formData.get("description") ?? "") as string;

  if (!Number.isFinite(amount) || amount <= 0) return;

  await prisma.expense.create({
    data: {
      amount,
      category,
      name: name || null,
      description: description || null,
      iconKey: pickRandom(EXPENSE_ICON_KEYS),
    },
  });

  revalidatePath("/");
}

export async function deleteExpense(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await prisma.expense.delete({ where: { id } });
  revalidatePath("/");
}

export async function addSaving(formData: FormData) {
  const amount = Number(formData.get("amount"));
  const note = (formData.get("note") ?? "") as string;
  if (!Number.isFinite(amount) || amount <= 0) return;
  await prisma.saving.create({
    data: { amount, note: note || null, iconKey: pickRandom(SAVING_ICON_KEYS) },
  });
  revalidatePath("/");
}

export async function deleteSaving(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await prisma.saving.delete({ where: { id } });
  revalidatePath("/");
}

export async function addInvestment(formData: FormData) {
  const amount = Number(formData.get("amount"));
  const instrument = String(formData.get("instrument") ?? "");
  const note = (formData.get("note") ?? "") as string;
  if (!Number.isFinite(amount) || amount <= 0 || !instrument) return;
  await prisma.investment.create({
    data: {
      amount,
      instrument,
      note: note || null,
      iconKey: pickRandom(INVEST_ICON_KEYS),
    },
  });
  revalidatePath("/");
}

export async function deleteInvestment(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await prisma.investment.delete({ where: { id } });
  revalidatePath("/");
}

export async function addSavingsGoal(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const targetAmount = Number(formData.get("targetAmount"));
  const monthlyIncrement = Number(formData.get("monthlyIncrement"));
  if (!name || !Number.isFinite(targetAmount) || targetAmount <= 0 || !Number.isFinite(monthlyIncrement) || monthlyIncrement <= 0) return;
  await prisma.savingsGoal.create({
    data: {
      name,
      targetAmount,
      currentAmount: 0,
      monthlyIncrement,
      iconKey: pickRandom(GOAL_ICON_KEYS),
    },
  });
  revalidatePath("/");
}

export async function incrementSavingsGoal(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  const goal = await prisma.savingsGoal.findUnique({ where: { id } });
  if (!goal) return;
  const next = Number(goal.currentAmount) + Number(goal.monthlyIncrement);
  await prisma.savingsGoal.update({ where: { id }, data: { currentAmount: next } });
  revalidatePath("/");
}

export async function deleteSavingsGoal(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await prisma.savingsGoal.delete({ where: { id } });
  revalidatePath("/");
}


