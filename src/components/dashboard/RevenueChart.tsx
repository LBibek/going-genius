'use client';

import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Transaction {
  id: string;
  amount: number;
  createdAt: Date;
  status: string;
}

interface RevenueChartProps {
  transactions: Transaction[];
}

export function RevenueChart({ transactions }: RevenueChartProps) {
  // Process raw transaction data into daily revenue
  const data = useMemo(() => {
    const dailyMap = new Map<string, number>();
    
    // Initialize last 30 days with 0
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyMap.set(dateStr, 0);
    }

    // Add completed transactions
    transactions.forEach(t => {
      if (t.status === 'completed') {
        const dateStr = new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (dailyMap.has(dateStr)) {
          dailyMap.set(dateStr, dailyMap.get(dateStr)! + t.amount);
        }
      }
    });

    return Array.from(dailyMap.entries()).map(([date, revenue]) => ({
      date,
      revenue
    }));
  }, [transactions]);

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground">Monthly Recurring Revenue (30 Days)</h3>
        <p className="text-3xl font-extrabold text-primary mt-2">
          NPR {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.4)" 
              fontSize={12} 
              tickMargin={10} 
            />
            <YAxis 
              stroke="rgba(255,255,255,0.4)" 
              fontSize={12} 
              tickFormatter={(value) => `₨${value}`} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--primary)' }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="var(--primary)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
