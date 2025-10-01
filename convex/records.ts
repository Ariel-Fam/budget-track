import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

function requireUserId(identity: any): string {
  if (!identity?.subject) throw new Error('Not authenticated')
  return identity.subject
}

export const listExpenses = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = requireUserId(identity)
    return await ctx.db
      .query('expenses')
      .withIndex('by_user_createdAt', (q) => q.eq('userId', userId))
      .order('desc')
      .collect()
  },
})

export const addExpense = mutation({
  args: {
    amount: v.number(),
    category: v.string(),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    iconKey: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = requireUserId(identity)
    await ctx.db.insert('expenses', {
      userId,
      amount: args.amount,
      category: args.category,
      name: args.name,
      description: args.description,
      iconKey: args.iconKey,
      createdAt: Date.now(),
    })
  },
})

export const deleteExpense = mutation({
  args: { id: v.id('expenses') },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = requireUserId(identity)
    const doc = await ctx.db.get(id)
    if (!doc || doc.userId !== userId) return
    await ctx.db.delete(id)
  },
})

export const listSavings = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = requireUserId(identity)
    return await ctx.db
      .query('savings')
      .withIndex('by_user_createdAt', (q) => q.eq('userId', userId))
      .order('desc')
      .collect()
  },
})

export const addSaving = mutation({
  args: { amount: v.number(), note: v.optional(v.string()), iconKey: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = requireUserId(identity)
    await ctx.db.insert('savings', {
      userId,
      amount: args.amount,
      note: args.note,
      iconKey: args.iconKey,
      createdAt: Date.now(),
    })
  },
})

export const deleteSaving = mutation({
  args: { id: v.id('savings') },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = requireUserId(identity)
    const doc = await ctx.db.get(id)
    if (!doc || doc.userId !== userId) return
    await ctx.db.delete(id)
  },
})

export const listInvestments = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = requireUserId(identity)
    return await ctx.db
      .query('investments')
      .withIndex('by_user_createdAt', (q) => q.eq('userId', userId))
      .order('desc')
      .collect()
  },
})

export const addInvestment = mutation({
  args: { amount: v.number(), instrument: v.string(), note: v.optional(v.string()), iconKey: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = requireUserId(identity)
    await ctx.db.insert('investments', {
      userId,
      amount: args.amount,
      instrument: args.instrument,
      note: args.note,
      iconKey: args.iconKey,
      createdAt: Date.now(),
    })
  },
})

export const deleteInvestment = mutation({
  args: { id: v.id('investments') },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = requireUserId(identity)
    const doc = await ctx.db.get(id)
    if (!doc || doc.userId !== userId) return
    await ctx.db.delete(id)
  },
})

export const listGoals = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = requireUserId(identity)
    return await ctx.db
      .query('savingsGoals')
      .withIndex('by_user_createdAt', (q) => q.eq('userId', userId))
      .order('desc')
      .collect()
  },
})

export const addGoal = mutation({
  args: { name: v.string(), targetAmount: v.number(), monthlyIncrement: v.number(), iconKey: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = requireUserId(identity)
    await ctx.db.insert('savingsGoals', {
      userId,
      name: args.name,
      targetAmount: args.targetAmount,
      currentAmount: 0,
      monthlyIncrement: args.monthlyIncrement,
      iconKey: args.iconKey,
      createdAt: Date.now(),
    })
  },
})

export const deleteGoal = mutation({
  args: { id: v.id('savingsGoals') },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = requireUserId(identity)
    const doc = await ctx.db.get(id)
    if (!doc || doc.userId !== userId) return
    await ctx.db.delete(id)
  },
})

export const incrementGoal = mutation({
  args: { id: v.id('savingsGoals') },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = requireUserId(identity)
    const doc = await ctx.db.get(id)
    if (!doc || doc.userId !== userId) return
    await ctx.db.patch(id, { currentAmount: doc.currentAmount + doc.monthlyIncrement })
  },
})
