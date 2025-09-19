"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { colorsForKeys, colorForKey } from "@/lib/colors";

type SpendingChartsProps = {
  byCategory: Array<{ category: string; amount: number }>;
  byMonth: Array<{ month: string; amount: number }>;
};

export function SpendingCharts({ byCategory, byMonth }: SpendingChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>Distribution of expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <ReTooltip formatter={(v: number) => `$${(v as number).toFixed(2)}`} />
                <Pie
                  data={byCategory.map((d) => ({ name: d.category, value: d.amount }))}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  innerRadius={50}
                >
                  {byCategory.map((d, i) => (
                    <Cell key={d.category} fill={colorsForKeys(byCategory.map((x) => x.category))[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Expense Trend</CardTitle>
          <CardDescription>Monthly expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer>
              <ReBarChart data={byMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ReTooltip formatter={(v: number) => `$${(v as number).toFixed(2)}`} />
                <Bar dataKey="amount" fill={colorForKey("amount")}> 
                  {byMonth.map((d) => (
                    <Cell key={d.month} fill={colorForKey(d.month)} />
                  ))}
                </Bar>
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


