import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  expenses: defineTable({
    userId: v.string(),
    amount: v.number(),
    category: v.string(),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    iconKey: v.string(),
    createdAt: v.number(), // ms since epoch
  }).index('by_user_createdAt', ['userId', 'createdAt']),

  savings: defineTable({
    userId: v.string(),
    amount: v.number(),
    note: v.optional(v.string()),
    iconKey: v.string(),
    createdAt: v.number(),
  }).index('by_user_createdAt', ['userId', 'createdAt']),

  investments: defineTable({
    userId: v.string(),
    amount: v.number(),
    instrument: v.string(),
    note: v.optional(v.string()),
    iconKey: v.string(),
    createdAt: v.number(),
  }).index('by_user_createdAt', ['userId', 'createdAt']),

  savingsGoals: defineTable({
    userId: v.string(),
    name: v.string(),
    targetAmount: v.number(),
    currentAmount: v.number(),
    monthlyIncrement: v.number(),
    iconKey: v.string(),
    createdAt: v.number(),
  }).index('by_user_createdAt', ['userId', 'createdAt']),
})
