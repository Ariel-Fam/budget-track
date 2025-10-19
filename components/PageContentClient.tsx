'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { SpendingCharts } from '@/components/charts/SpendingCharts'
import { SavingsCharts } from '@/components/charts/SavingsCharts'
import { RecordIcon } from '@/components/icons'
import { SpendingCategoryPie } from '@/components/charts/SpendingCategoryPie'
import AnimatedAlert from '@/components/AnimatedAlert'
import { CircleDollarSign, PiggyBank, LineChart as LineChartIcon, Target, Info } from 'lucide-react'

const EXPENSE_ICON_KEYS = [
  'shopping-bag',
  'bolt',
  'bus',
  'clapperboard',
  'home',
  'credit-card',
  'flame',
  'wallet',
]

const SAVING_ICON_KEYS = ['piggy-bank', 'wallet', 'credit-card', 'safe']
const INVEST_ICON_KEYS = ['line-chart', 'chart-line', 'banknote', 'maple']
const GOAL_ICON_KEYS = ['trophy', 'target', 'flag', 'rocket', 'gift', 'piggy-bank', 'star', 'gem']

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function PageContentClient() {
  const expenses = useQuery(api.records.listExpenses, {})
  const savings = useQuery(api.records.listSavings, {})
  const investments = useQuery(api.records.listInvestments, {})
  const goals = useQuery(api.records.listGoals, {})

  const addExpense = useMutation(api.records.addExpense)
  const deleteExpense = useMutation(api.records.deleteExpense)
  const addSaving = useMutation(api.records.addSaving)
  const deleteSaving = useMutation(api.records.deleteSaving)
  const addInvestment = useMutation(api.records.addInvestment)
  const deleteInvestment = useMutation(api.records.deleteInvestment)
  const addGoal = useMutation(api.records.addGoal)
  const deleteGoal = useMutation(api.records.deleteGoal)
  const incrementGoal = useMutation(api.records.incrementGoal)

  const [selectedCategory, setSelectedCategory] = useState<string>('Groceries')

  const handleAddExpense = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const amount = Number(fd.get('amount'))
    const category = selectedCategory
    const name = (fd.get('name') ?? '') as string
    const description = (fd.get('description') ?? '') as string
    if (!Number.isFinite(amount) || amount <= 0) return
    await addExpense({ amount, category, name: name || undefined, description: description || undefined, iconKey: pickRandom(EXPENSE_ICON_KEYS) })
    form.reset()
  }, [addExpense, selectedCategory])

  const handleDeleteExpense = useCallback(async (id: Id<'expenses'>) => {
    await deleteExpense({ id })
  }, [deleteExpense])

  const handleAddSaving = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const amount = Number(fd.get('amount'))
    const note = (fd.get('note') ?? '') as string
    if (!Number.isFinite(amount) || amount <= 0) return
    await addSaving({ amount, note: note || undefined, iconKey: pickRandom(SAVING_ICON_KEYS) })
    form.reset()
  }, [addSaving])

  const handleDeleteSaving = useCallback(async (id: Id<'savings'>) => {
    await deleteSaving({ id })
  }, [deleteSaving])

  const handleAddInvestment = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const amount = Number(fd.get('amount'))
    const instrument = String(fd.get('instrument') ?? '')
    const note = (fd.get('note') ?? '') as string
    if (!Number.isFinite(amount) || amount <= 0 || !instrument) return
    await addInvestment({ amount, instrument, note: note || undefined, iconKey: pickRandom(INVEST_ICON_KEYS) })
    form.reset()
  }, [addInvestment])

  const handleDeleteInvestment = useCallback(async (id: Id<'investments'>) => {
    await deleteInvestment({ id })
  }, [deleteInvestment])

  const handleAddGoal = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const name = String(fd.get('name') ?? '').trim()
    const targetAmount = Number(fd.get('targetAmount'))
    const monthlyIncrement = Number(fd.get('monthlyIncrement'))
    if (!name || !Number.isFinite(targetAmount) || targetAmount <= 0 || !Number.isFinite(monthlyIncrement) || monthlyIncrement <= 0) return
    await addGoal({ name, targetAmount, monthlyIncrement, iconKey: pickRandom(GOAL_ICON_KEYS) })
    form.reset()
  }, [addGoal])

  const handleDeleteGoal = useCallback(async (id: Id<'savingsGoals'>) => {
    await deleteGoal({ id })
  }, [deleteGoal])

  const handleIncrementGoal = useCallback(async (id: Id<'savingsGoals'>) => {
    await incrementGoal({ id })
  }, [incrementGoal])

  const byCategory = useMemo(() => {
    if (!expenses) return []
    return Object.values(
      expenses.reduce<Record<string, { category: string; amount: number }>>((acc, e) => {
        const key = e.category
        acc[key] ??= { category: e.category, amount: 0 }
        acc[key].amount += Number(e.amount)
        return acc
      }, {})
    )
  }, [expenses])

  const byMonth = useMemo(() => {
    if (!expenses) return []
    return Object.values(
      expenses.reduce<Record<string, { month: string; amount: number }>>((acc, e) => {
        const d = new Date(e.createdAt)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        acc[key] ??= { month: key, amount: 0 }
        acc[key].amount += Number(e.amount)
        return acc
      }, {})
    ).sort((a, b) => a.month.localeCompare(b.month))
  }, [expenses])

  const byMonthFiltered = useMemo(() => {
    if (!expenses) return []
    const filtered = expenses.filter((e) => e.category === selectedCategory)
    return Object.values(
      filtered.reduce<Record<string, { month: string; amount: number }>>((acc, e) => {
        const d = new Date(e.createdAt)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        acc[key] ??= { month: key, amount: 0 }
        acc[key].amount += Number(e.amount)
        return acc
      }, {})
    ).sort((a, b) => a.month.localeCompare(b.month))
  }, [expenses, selectedCategory])

  const savingsBreakdown = useMemo(() => (savings ? savings.map((s) => ({ label: s.note || 'Saving', amount: Number(s.amount) })) : []), [savings])
  const investmentsBreakdown = useMemo(() => (investments ? investments.map((i) => ({ label: i.instrument, amount: Number(i.amount) })) : []), [investments])

  const byName = useMemo(() => {
    if (!expenses) return []
    return Object.values(
      expenses.reduce<Record<string, { name: string; amount: number }>>((acc, e) => {
        const key = e.name ?? e.category
        acc[key] ??= { name: key, amount: 0 }
        acc[key].amount += Number(e.amount)
        return acc
      }, {})
    )
  }, [expenses])

  const totalExpenses = useMemo(() => (expenses ? expenses.reduce((sum: number, e) => sum + Number(e.amount), 0) : 0), [expenses])
  const totalSavings = useMemo(() => (savings ? savings.reduce((sum: number, s) => sum + Number(s.amount), 0) : 0), [savings])
  const totalInvestments = useMemo(() => (investments ? investments.reduce((sum: number, i) => sum + Number(i.amount), 0) : 0), [investments])

  return (
    <div className="min-h-screen p-6 md:p-10 space-y-10">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Budget Dashboard</h1>
        <Tabs defaultValue="expenses">
          <TabsList className="mb-4">
            <TabsTrigger className="bg-green-700 " value="expenses">Expenses</TabsTrigger>
            <TabsTrigger className="bg-green-700" value="savings">Savings</TabsTrigger>
            <TabsTrigger className="bg-green-700" value="investments">Investments</TabsTrigger>
            <TabsTrigger className="bg-green-700" value="goals">Savings Goals</TabsTrigger>
            <TabsTrigger className="bg-green-700" value="literacy">Financial Literacy</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="space-y-6">
            <AnimatedAlert
              icon={<CircleDollarSign className="size-4" />}
              title="Track your monthly expenses"
              description={
                <>Add each expense you make. Your dashboard below visualizes spending by category and month.</>
              }
            />
            <Card>
              <CardHeader>
                <CardTitle>Add Expense</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddExpense} className="grid gap-4 md:grid-cols-5 items-end relative bg-gray-500 border-2 border-white rounded-md p-4">
                  <div>
                    <Label className="mb-2" htmlFor="amount">Amount</Label>
                    <Input name="amount" id="amount" type="number" step="0.01" required />
                  </div>
                  <div>
                    <Label className="mb-2" htmlFor="category">Category</Label>
                    <Select name="category" value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Groceries">Groceries</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Transport">Transport</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Bill">Bill</SelectItem>
                        <SelectItem value="Savings">Savings</SelectItem>
                        <SelectItem value="Misc">Misc</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2" htmlFor="name">Name</Label>
                    <Input name="name" id="name" placeholder="e.g., Coffee at Starbucks" />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="mb-2" htmlFor="description">Description</Label>
                    <Textarea name="description" id="description" placeholder="Optional" />
                  </div>
                  <Button type="submit">Add</Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(expenses || []).map((e) => (
                <Card key={e._id}>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <RecordIcon iconKey={e.iconKey} className="size-5" />
                      <span className="text-lg font-semibold">${Number(e.amount).toFixed(2)}</span>
                      <span className="text-muted-foreground text-sm">{e.name || e.category}</span>
                      <Badge variant="secondary">{e.category}</Badge>
                    </CardTitle>
                    <Button variant="outline" aria-label="Delete" onClick={() => handleDeleteExpense(e._id)}>Delete</Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{e.description || '—'}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center">
              <Card className="mt-4 w-full max-w-sm ">
                <CardHeader>
                  <CardTitle className="text-center">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">${totalExpenses.toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <AnimatedAlert
              icon={<Target className="size-4" />}
              title="Set and grow savings goals"
              description={
                <>Create goals with a target and monthly amount. Use “+ Add” to increment progress over time.</>
              }
            />
            <Card>
              <CardHeader>
                <CardTitle>Add Savings Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddGoal} className="grid gap-4 md:grid-cols-4 items-end relative bg-gray-500 border-2 border-white rounded-md p-4">
                  <div>
                    <Label htmlFor="g-name">Name</Label>
                    <Input name="name" id="g-name" placeholder="e.g., New Laptop" required />
                  </div>
                  <div>
                    <Label htmlFor="g-target">Target Amount</Label>
                    <Input name="targetAmount" id="g-target" type="number" step="0.01" required />
                  </div>
                  <div>
                    <Label htmlFor="g-inc">Monthly Savings Amount</Label>
                    <Input name="monthlyIncrement" id="g-inc" type="number" step="0.01" required />
                  </div>
                  <Button type="submit">Add Goal</Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(goals || []).map((g) => {
                const progress = Math.min(100, Math.round((Number(g.currentAmount) / Number(g.targetAmount)) * 100))
                return (
                  <Card key={g._id} className="rounded-xl">
                    <CardHeader className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <RecordIcon iconKey={g.iconKey} className="size-5" />
                        <span className="font-semibold">{g.name}</span>
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" aria-label="Delete" onClick={() => handleDeleteGoal(g._id)}>Delete</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">${Number(g.currentAmount).toFixed(2)} / ${Number(g.targetAmount).toFixed(2)} ({progress}%)</div>
                      <div className="mt-2 text-sm">Increment: ${Number(g.monthlyIncrement).toFixed(2)}</div>
                      <div className="mt-4">
                        <Button onClick={() => handleIncrementGoal(g._id)} aria-label="Add increment">+ Add ${Number(g.monthlyIncrement).toFixed(2)}</Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="savings" className="space-y-6">
            <AnimatedAlert
              icon={<PiggyBank className="size-4" />}
              title="Build your savings"
              description={
                <>Log deposits and notes to track your savings history. The dashboard shows your total saved.</>
              }
            />
            <Card>
              <CardHeader>
                <CardTitle>Add Saving</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddSaving} className="grid gap-4 md:grid-cols-3 items-end relative bg-gray-500 border-2 border-white rounded-md p-4">
                  <div>
                    <Label htmlFor="s-amount">Amount</Label>
                    <Input name="amount" id="s-amount" type="number" step="0.01" required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="s-note">Note</Label>
                    <Input name="note" id="s-note" placeholder="Optional" />
                  </div>
                  <Button type="submit">Add</Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(savings || []).map((s) => (
                <Card key={s._id}>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <RecordIcon iconKey={s.iconKey} className="size-5" />
                      <span className="text-lg font-semibold">${Number(s.amount).toFixed(2)}</span>
                      <span className="text-muted-foreground text-sm">{s.note || 'Saving'}</span>
                    </CardTitle>
                    <Button variant="outline" aria-label="Delete" onClick={() => handleDeleteSaving(s._id)}>Delete</Button>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <div className="flex justify-center">
              <Card className="mt-4 w-full max-w-sm">
                <CardHeader>
                  <CardTitle className="text-center">Total Savings</CardTitle>
                </CardHeader>
                <CardContent className="ml-20">
                  <div className="text-2xl font-semibold ">${totalSavings.toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="investments" className="space-y-6">
            <AnimatedAlert
              icon={<LineChartIcon className="size-4" />}
              title="Track your investments"
              description={
                <>Record amounts and instruments you invest in. See totals and breakdowns on the dashboard.</>
              }
            />
            <Card>
              <CardHeader>
                <CardTitle>Add Investment</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddInvestment} className="grid gap-4 md:grid-cols-4 items-end relative bg-gray-500 border-2 border-white rounded-md p-4">
                  <div>
                    <Label htmlFor="i-amount">Amount</Label>
                    <Input name="amount" id="i-amount" type="number" step="0.01" required />
                  </div>
                  <div>
                    <Label htmlFor="i-instrument">Instrument</Label>
                    <Input name="instrument" id="i-instrument" placeholder="e.g., ETF - VOO" required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="i-note">Note</Label>
                    <Input name="note" id="i-note" placeholder="Optional" />
                  </div>
                  <Button type="submit">Add</Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(investments || []).map((i) => (
                <Card key={i._id}>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <RecordIcon iconKey={i.iconKey} className="size-5" />
                      <span className="text-lg font-semibold">${Number(i.amount).toFixed(2)}</span>
                      <span className="text-muted-foreground text-sm">{i.instrument}</span>
                    </CardTitle>
                    <Button variant="outline" aria-label="Delete" onClick={() => handleDeleteInvestment(i._id)}>Delete</Button>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <div className="flex justify-center">
              <Card className="mt-4 w-full max-w-sm">
                <CardHeader>
                  <CardTitle>Total Investments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">${totalInvestments.toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="literacy" className="space-y-6">
            <AnimatedAlert
              icon={<Info className="size-4" />}
              title="Financial literacy hub"
              description={
                <>Explore curated tips and checklists on saving, investing, budgeting, taxes, and more.</>
              }
            />

            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="mt-4 text-black dark:text-black">
                  <CardHeader>
                    <CardTitle>Saving Strategies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      <li>Automate transfers to your savings account.</li>
                      <li>Use the 50/30/20 budgeting rule.</li>
                      <li>Build a 3–6 month emergency fund.</li>
                      <li>Set specific, time-bound savings goals.</li>
                      <li>Pay yourself first on payday.</li>
                      <li>Round-up transactions to save spare change.</li>
                      <li>Funnel windfalls to savings (tax refunds, bonuses).</li>
                      <li>Separate short-term vs long-term savings buckets.</li>
                      <li>Use sinking funds for predictable expenses.</li>
                      <li>Review subscriptions and cancel unused.</li>
                      <li>Negotiate rent or consider housemate.</li>
                      <li>Automate savings increases annually.</li>
                      <li>Track savings rate and aim to improve quarterly.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="text-black dark:text-black">
                  <CardHeader>
                    <CardTitle>Wealth-Building Methods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      <li>Invest consistently with dollar-cost averaging.</li>
                      <li>Diversify across asset classes.</li>
                      <li>Increase income via upskilling or side hustles.</li>
                      <li>Max employer match in retirement accounts.</li>
                      <li>Increase contributions with each raise.</li>
                      <li>Rebalance portfolio annually.</li>
                      <li>Minimize fees with low-cost index funds.</li>
                      <li>Avoid lifestyle inflation.</li>
                      <li>Build multiple income streams.</li>
                      <li>Keep an emergency fund to avoid forced selling.</li>
                      <li>Focus on tax-advantaged accounts first.</li>
                      <li>Invest through downturns with DCA.</li>
                      <li>Write and follow an investment policy.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="text-black dark:text-black">
                  <CardHeader>
                    <CardTitle>Tax Reduction in Canada</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      <li>Maximize TFSA and RRSP contributions.</li>
                      <li>Claim deductions and credits you&apos;re eligible for.</li>
                      <li>Consider income splitting and spousal RRSPs.</li>
                      <li>Use spousal RRSPs to split retirement income.</li>
                      <li>Claim childcare and tuition credits.</li>
                      <li>Keep receipts for medical and moving expenses.</li>
                      <li>Leverage FHSA and first-time home programs.</li>
                      <li>Optimize capital gains vs dividends vs interest.</li>
                      <li>Harvest tax losses to offset gains.</li>
                      <li>Track home-office and vehicle expenses accurately.</li>
                      <li>Contribute to RESP for CESG grants.</li>
                      <li>Hold high-growth assets in TFSA.</li>
                      <li>Review CRA updates annually before filing.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="text-black dark:text-black">
                  <CardHeader>
                    <CardTitle>Budgeting Basics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      <li>Track every expense weekly to spot trends.</li>
                      <li>Use separate accounts for bills and spending.</li>
                      <li>Review and adjust your budget monthly.</li>
                      <li>Choose a method: zero-based, envelope, or 50/30/20.</li>
                      <li>Set category caps and alerts.</li>
                      <li>Budget for annual/irregular expenses.</li>
                      <li>Sync budgets with your partner regularly.</li>
                      <li>Use categories that reflect your life.</li>
                      <li>Review last month to plan next month.</li>
                      <li>Keep a small “fun money” line to reduce burnout.</li>
                      <li>Budget net income, not gross.</li>
                      <li>Separate wants vs needs clearly.</li>
                      <li>Use a dedicated budgeting app or spreadsheet.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="text-black dark:text-black">
                  <CardHeader>
                    <CardTitle>Debt Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      <li>Prioritize high-interest debt first (avalanche method).</li>
                      <li>Consider the snowball method for motivation.</li>
                      <li>Negotiate lower interest rates with lenders.</li>
                      <li>List debts with balances, APRs, and minimums.</li>
                      <li>Consolidate high-interest debt when prudent.</li>
                      <li>Avoid adding new debt during payoff.</li>
                      <li>Make biweekly payments to reduce interest.</li>
                      <li>Refinance mortgages when break-even makes sense.</li>
                      <li>Freeze cards if overspending is habitual.</li>
                      <li>Celebrate milestones to maintain motivation.</li>
                      <li>Seek non-profit credit counseling if needed.</li>
                      <li>Build a starter emergency fund first.</li>
                      <li>Track payoff progress visually.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="text-black dark:text-black">
                  <CardHeader>
                    <CardTitle>Credit Score Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      <li>Keep utilization below 30% on each card.</li>
                      <li>Always pay on time—set reminders or auto-pay.</li>
                      <li>Maintain older accounts to lengthen history.</li>
                      <li>Pay statement balance in full monthly.</li>
                      <li>Set utilization alerts per card.</li>
                      <li>Request credit limit increases strategically.</li>
                      <li>Plan hard inquiries; keep them minimal.</li>
                      <li>Dispute inaccuracies on your report.</li>
                      <li>Mix of credit types helps over time.</li>
                      <li>Avoid closing your oldest accounts.</li>
                      <li>Autopay at least the minimum to avoid lates.</li>
                      <li>Keep utilization low before statement date.</li>
                      <li>Check reports annually (Equifax/TransUnion).</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="text-black dark:text-black">
                  <CardHeader>
                    <CardTitle>Emergency Fund</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      <li>Target 3–6 months of essential expenses.</li>
                      <li>Keep it liquid in HISA or money market.</li>
                      <li>Replenish after any withdrawal.</li>
                      <li>Start with a $1,000 starter fund first.</li>
                      <li>Store in a separate high-yield account.</li>
                      <li>Name the account to reinforce purpose.</li>
                      <li>Automate small weekly transfers.</li>
                      <li>Re-evaluate target after life changes.</li>
                      <li>Do not invest EF in volatile assets.</li>
                      <li>Use only for true emergencies.</li>
                      <li>Refill immediately after use.</li>
                      <li>Combine with adequate insurance coverage.</li>
                      <li>Consider multi-bank access for redundancy.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="text-black dark:text-black">
                  <CardHeader>
                    <CardTitle>Insurance Essentials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      <li>Ensure adequate life and disability coverage.</li>
                      <li>Bundle policies and shop annually for rates.</li>
                      <li>Use deductibles to balance cost vs. risk.</li>
                      <li>Review beneficiaries annually.</li>
                      <li>Term life over whole life for most situations.</li>
                      <li>Disability insurance protects your income.</li>
                      <li>Consider an umbrella policy for liability.</li>
                      <li>Compare quotes from multiple carriers.</li>
                      <li>Review deductibles vs premiums yearly.</li>
                      <li>Understand exclusions and waiting periods.</li>
                      <li>Maintain adequate renters/home coverage.</li>
                      <li>Consider travel/device insurance when needed.</li>
                      <li>Keep policy documents organized and accessible.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Smart Spending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      <li>Use a 24-hour rule for non-essentials.</li>
                      <li>Negotiate bills: internet, phone, insurance.</li>
                      <li>Meal plan and buy staples in bulk.</li>
                      <li>Use cashback/points strategically (pay in full).</li>
                      <li>Buy quality for frequently-used items.</li>
                      <li>Time purchases with seasonal sales.</li>
                      <li>Use price tracking and coupons.</li>
                      <li>Try periodic no-spend challenges.</li>
                      <li>Batch errands to save time and fuel.</li>
                      <li>Cancel free trials before billing.</li>
                      <li>Share memberships with family plans.</li>
                      <li>Sleep on large purchases.</li>
                      <li>Track cost-per-use for big items.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Security & Scams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      <li>Enable MFA on banking and email accounts.</li>
                      <li>Never share one-time codes or passwords.</li>
                      <li>Monitor statements; set up transaction alerts.</li>
                      <li>Use unique passwords with a password manager.</li>
                      <li>Keep software and devices updated.</li>
                      <li>Verify senders; beware urgent requests.</li>
                      <li>Never click unknown links or attachments.</li>
                      <li>Validate investment opportunities; avoid FOMO traps.</li>
                      <li>Freeze credit if identity theft risk.</li>
                      <li>Use virtual cards for online purchases.</li>
                      <li>Monitor credit and bank alerts.</li>
                      <li>Shred sensitive documents.</li>
                      <li>Educate family on common scams.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Books for Wealth Building</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      <li>The Simple Path to Wealth — JL Collins</li>
                      <li>The Little Book of Common Sense Investing — John C. Bogle</li>
                      <li>The Psychology of Money — Morgan Housel</li>
                      <li>Your Money or Your Life — Vicki Robin & Joe Dominguez</li>
                      <li>I Will Teach You to Be Rich — Ramit Sethi</li>
                      <li>A Random Walk Down Wall Street — Burton G. Malkiel</li>
                      <li>The Millionaire Next Door — Thomas J. Stanley & William D. Danko</li>
                      <li>The Bogleheads&apos; Guide to Investing — Larimore, Lindauer & LeBoeuf</li>
                      <li>Quit Like a Millionaire — Kristy Shen & Bryce Leung</li>
                      <li>The Intelligent Investor — Benjamin Graham</li>
                      <li>Die With Zero — Bill Perkins</li>
                      <li>Rich Dad Poor Dad — Robert T. Kiyosaki</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Separator />

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <SpendingCharts byCategory={byCategory} byMonth={byMonth} activeCategory={selectedCategory} />
        <SpendingCategoryPie byName={byName} />
        <SavingsCharts savingsBreakdown={savingsBreakdown} investmentsBreakdown={investmentsBreakdown} />
      </div>

      <Separator />
    </div>
  )
}


