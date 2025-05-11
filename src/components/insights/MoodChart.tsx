'use client';

import type { MoodTrendPoint } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AlertTriangle, TrendingDown, TrendingUp, MinusCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface MoodChartProps {
  moodTrends: MoodTrendPoint[];
  overallSentiment?: string;
  moodTrendSummary?: string;
  isLoading: boolean;
  error?: string | null;
}

const chartConfig = {
  score: {
    label: 'Mood Score',
  },
  positive: {
    label: 'Positive',
    color: 'hsl(var(--chart-1))', 
    icon: TrendingUp,
  },
  neutral: {
    label: 'Neutral',
    color: 'hsl(var(--chart-4))', 
    icon: MinusCircle,
  },
  negative: {
    label: 'Negative',
    color: 'hsl(var(--chart-5))', 
    icon: TrendingDown,
  },
} satisfies ChartConfig;


export default function MoodChart({ moodTrends, overallSentiment, moodTrendSummary, isLoading, error }: MoodChartProps) {
  if (isLoading) {
     return (
      <Card>
        <CardHeader>
          <CardTitle>Analyzing Mood Trends...</CardTitle>
          <CardDescription>Visualizing your emotional journey.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
            <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 animate-bounce text-primary" />
                <span className="text-muted-foreground">Loading mood data...</span>
            </div>
        </CardContent>
      </Card>
     )
  }
  
  if (error) {
    return (
       <Card className="border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle /> Error Loading Mood Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
          <p className="text-sm text-muted-foreground mt-2">Please try again later or ensure you have enough journal entries.</p>
        </CardContent>
      </Card>
    )
  }


  if (!moodTrends || moodTrends.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mood Trends</CardTitle>
          <CardDescription>Your mood variations over time will be shown here.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Not enough data to display mood trends yet. Keep journaling!</p>
        </CardContent>
      </Card>
    );
  }
  
  const formattedData = moodTrends.map(trend => ({
    date: format(parseISO(trend.date), 'MMM d'),
    score: trend.score,
    mood: trend.mood,
  }));


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Mood Trends Over Time</CardTitle>
        {overallSentiment && (
            <CardDescription>
                Overall Sentiment: <span className="font-semibold">{overallSentiment}</span>
            </CardDescription>
        )}
        {moodTrendSummary && (
            <p className="text-sm text-muted-foreground pt-1">{moodTrendSummary}</p>
        )}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8}
              />
              <YAxis 
                domain={[-1, 1]} 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8}
                tickFormatter={(value) => value.toFixed(1)}
              />
              <RechartsTooltip 
                cursor={{ fill: 'hsl(var(--muted))', radius: 4 }}
                content={<ChartTooltipContent 
                            indicator="dot" 
                            formatter={(value, name, props) => {
                                const mood = props.payload.mood;
                                const Icon = mood && chartConfig[mood as keyof typeof chartConfig]?.icon;
                                return (
                                <div className="flex flex-col">
                                    <span className="font-medium">{props.payload.date}</span>
                                    <span className="flex items-center">
                                    {Icon && <Icon className="w-4 h-4 mr-1" style={{color: chartConfig[mood as keyof typeof chartConfig]?.color}}/>}
                                    Mood: {mood} ({Number(value).toFixed(2)})
                                    </span>
                                </div>
                                )
                            }}
                         />} 
              />
              <Bar dataKey="score" radius={4}>
                {formattedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartConfig[entry.mood as keyof typeof chartConfig]?.color || chartConfig.neutral.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

