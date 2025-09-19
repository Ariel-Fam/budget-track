"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
} from "recharts";
import { colorsForKeys } from "@/lib/colors";

type SavingsChartsProps = {
  savingsBreakdown: Array<{ label: string; amount: number }>;
  investmentsBreakdown: Array<{ label: string; amount: number }>;
};

export function SavingsCharts({ savingsBreakdown, investmentsBreakdown }: SavingsChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Savings Breakdown</CardTitle>
          <CardDescription>Allocation of savings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <ReTooltip formatter={(v: number) => `$${(v as number).toFixed(2)}`} />
                <Pie
                  data={savingsBreakdown.map((d) => ({ name: d.label, value: d.amount }))}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  innerRadius={50}
                >
                  {savingsBreakdown.map((d, i) => (
                    <Cell key={`${d.label}-${i}`} fill={colorsForKeys(savingsBreakdown.map((x) => x.label))[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Investments Breakdown</CardTitle>
          <CardDescription>Allocation of investments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <ReTooltip formatter={(v: number) => `$${(v as number).toFixed(2)}`} />
                <Pie
                  data={investmentsBreakdown.map((d) => ({ name: d.label, value: d.amount }))}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  innerRadius={50}
                >
                  {investmentsBreakdown.map((d, i) => (
                    <Cell key={`${d.label}-${i}`} fill={colorsForKeys(investmentsBreakdown.map((x) => x.label))[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


