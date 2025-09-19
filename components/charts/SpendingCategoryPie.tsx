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

type SpendingCategoryPieProps = {
  byName: Array<{ name: string; amount: number }>;
};

export function SpendingCategoryPie({ byName }: SpendingCategoryPieProps) {
  const data = byName.map((d) => ({ name: d.name, value: d.amount }));
  const keys = byName.map((d) => d.name);
  const colors = colorsForKeys(keys);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Name</CardTitle>
        <CardDescription>Distribution across individual expense names</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer>
            <PieChart>
              <ReTooltip formatter={(v: number) => `$${(v as number).toFixed(2)}`} />
              <Pie data={data} dataKey="value" nameKey="name" outerRadius={110}>
                {data.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={colors[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}


