import { prisma } from "@/lib/db";
import type { Expense, Saving as SavingModel, Investment as InvestmentModel, SavingsGoal } from "@prisma/client";
export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { SpendingCharts } from "@/components/charts/SpendingCharts";
import { SavingsCharts } from "@/components/charts/SavingsCharts";
import { RecordIcon } from "@/components/icons";
import { SpendingCategoryPie } from "@/components/charts/SpendingCategoryPie";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import AnimatedAlert from "@/components/AnimatedAlert";
import { CircleDollarSign, PiggyBank, LineChart as LineChartIcon, Target, Info } from "lucide-react";
import { addExpense, deleteExpense, addSaving, deleteSaving, addInvestment, deleteInvestment, addSavingsGoal, incrementSavingsGoal, deleteSavingsGoal } from "./actions";

export default async function Home() {
  const [expenses, savings, investments, goals]: [
    Expense[],
    SavingModel[],
    InvestmentModel[],
    SavingsGoal[]
  ] = await Promise.all([
    prisma.expense.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.saving.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.investment.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.savingsGoal.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  type CategoryAgg = { category: string; amount: number };
  type MonthAgg = { month: string; amount: number };
  type NameAgg = { name: string; amount: number };

  const byCategory: CategoryAgg[] = Object.values(
    expenses.reduce<Record<string, CategoryAgg>>((acc: Record<string, CategoryAgg>, e: Expense) => {
      const key = e.category;
      acc[key] ??= { category: e.category, amount: 0 };
      acc[key].amount += Number(e.amount);
      return acc;
    }, {}) 
  );

  const byMonth: MonthAgg[] = Object.values(
    expenses.reduce<Record<string, MonthAgg>>((acc: Record<string, MonthAgg>, e: Expense) => {
      const d = new Date(e.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      acc[key] ??= { month: key, amount: 0 };
      acc[key].amount += Number(e.amount);
      return acc;
    }, {})
  ).sort((a: MonthAgg, b: MonthAgg) => a.month.localeCompare(b.month));

  const savingsBreakdown = savings.map((s: SavingModel) => ({ label: s.note || "Saving", amount: Number(s.amount) }));
  const investmentsBreakdown = investments.map((i: InvestmentModel) => ({
    label: i.instrument,
    amount: Number(i.amount),
  }));

  const byName: NameAgg[] = Object.values(
    expenses.reduce<Record<string, NameAgg>>((acc: Record<string, NameAgg>, e: Expense) => {
      const key = e.name ?? e.category;
      acc[key] ??= { name: key, amount: 0 };
      acc[key].amount += Number(e.amount);
      return acc;
    }, {})
  );

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalSavings = savings.reduce((sum, s) => sum + Number(s.amount), 0);
  const totalInvestments = investments.reduce((sum, i) => sum + Number(i.amount), 0);

  return (
    <div className="min-h-screen p-6 md:p-10 space-y-10">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Budget Dashboard</h1>
        <Tabs defaultValue="expenses">
          <TabsList className="mb-4">
            <TabsTrigger className="bg-green-700 "  value="expenses">Expenses</TabsTrigger>
            <TabsTrigger className="bg-green-700"  value="savings">Savings</TabsTrigger>
            <TabsTrigger  className="bg-green-700"  value="investments">Investments</TabsTrigger>
            <TabsTrigger className="bg-green-700"  value="goals">Savings Goals</TabsTrigger>
            <TabsTrigger className="bg-green-700"  value="literacy">Financial Literacy</TabsTrigger>
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
                <form action={addExpense} className="grid gap-4 md:grid-cols-5 items-end">
                  <div>
                    <Label className="mb-2" htmlFor="amount">Amount</Label>
                    <Input name="amount" id="amount" type="number" step="0.01" required />
                  </div>
                  <div>
                    <Label className="mb-2" htmlFor="category">Category</Label>
                    <Select name="category" defaultValue="Groceries">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Groceries">Groceries</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Transport">Transport</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Bill">Bill</SelectItem>
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
              {expenses.map((e) => (
                <Card key={e.id}>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <RecordIcon iconKey={e.iconKey} className="size-5" />
                      <span className="text-lg font-semibold">${Number(e.amount).toFixed(2)}</span>
                      <span className="text-muted-foreground text-sm">{e.name || e.category}</span>
                    </CardTitle>
                    <form action={deleteExpense}>
                      <input type="hidden" name="id" value={e.id} />
                      <Button variant="outline" aria-label="Delete">Delete</Button>
                    </form>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{e.description || "—"}</p>
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
                <form action={addSavingsGoal} className="grid gap-4 md:grid-cols-4 items-end">
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
              {goals.map((g) => {
                const progress = Math.min(100, Math.round((Number(g.currentAmount) / Number(g.targetAmount)) * 100));
                return (
                  <Card key={g.id} className="rounded-xl">
                    <CardHeader className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <RecordIcon iconKey={g.iconKey} className="size-5" />
                        <span className="font-semibold">{g.name}</span>
                      </CardTitle>
                      <form action={deleteSavingsGoal}>
                        <input type="hidden" name="id" value={g.id} />
                        <Button variant="outline" aria-label="Delete">Delete</Button>
                      </form>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">${Number(g.currentAmount).toFixed(2)} / ${Number(g.targetAmount).toFixed(2)} ({progress}%)</div>
                      <div className="mt-2 text-sm">Increment: ${Number(g.monthlyIncrement).toFixed(2)}</div>
                      <form action={incrementSavingsGoal} className="mt-4">
                        <input type="hidden" name="id" value={g.id} />
                        <Button type="submit" aria-label="Add increment">+ Add ${Number(g.monthlyIncrement).toFixed(2)}</Button>
                      </form>
                    </CardContent>
                  </Card>
                );
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
                <form action={addSaving} className="grid gap-4 md:grid-cols-3 items-end">
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
              {savings.map((s) => (
                <Card key={s.id}>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <RecordIcon iconKey={s.iconKey} className="size-5" />
                      <span className="text-lg font-semibold">${Number(s.amount).toFixed(2)}</span>
                      <span className="text-muted-foreground text-sm">{s.note || "Saving"}</span>
                    </CardTitle>
                    <form action={deleteSaving}>
                      <input type="hidden" name="id" value={s.id} />
                      <Button variant="outline" aria-label="Delete">Delete</Button>
                    </form>
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
                <form action={addInvestment} className="grid gap-4 md:grid-cols-4 items-end">
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
              {investments.map((i) => (
                <Card key={i.id}>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <RecordIcon iconKey={i.iconKey} className="size-5" />
                      <span className="text-lg font-semibold">${Number(i.amount).toFixed(2)}</span>
                      <span className="text-muted-foreground text-sm">{i.instrument}</span>
                    </CardTitle>
                    <form action={deleteInvestment}>
                      <input type="hidden" name="id" value={i.id} />
                      <Button variant="outline" aria-label="Delete">Delete</Button>
                    </form>
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
              {/* <h2 className="text-xl font-semibold">Financial Literacy</h2> */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="mt-4">
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
                <Card>
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
                <Card>
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
                <Card>
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
                <Card>
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
                <Card>
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
                <Card>
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
                <Card>
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
                      <li>The Bogleheads&#39; Guide to Investing — Larimore, Lindauer & LeBoeuf</li>
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
        <SpendingCharts byCategory={byCategory} byMonth={byMonth} />
        <SpendingCategoryPie byName={byName} />
        <SavingsCharts savingsBreakdown={savingsBreakdown} investmentsBreakdown={investmentsBreakdown} />
      </div>

      <Separator />

      
    </div>
  );
}
