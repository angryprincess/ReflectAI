'use client';

import type { AiInsights } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, MessageSquareText, Repeat, TrendingUp, AlertTriangle } from 'lucide-react';

interface AiInsightsDisplayProps {
  insights: AiInsights | null;
  isLoading: boolean;
  error?: string | null;
}

export default function AiInsightsDisplay({ insights, isLoading, error }: AiInsightsDisplayProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analyzing your entries...</CardTitle>
          <CardDescription>Please wait while we generate your insights.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 animate-pulse text-primary" />
            <span className="text-muted-foreground">Calculating Reflection Score...</span>
          </div>
          <div className="flex items-center space-x-2">
            <Repeat className="h-5 w-5 animate-pulse text-primary" />
            <span className="text-muted-foreground">Identifying Recurring Themes...</span>
          </div>
          <div className="flex items-center space-x-2">
            <MessageSquareText className="h-5 w-5 animate-pulse text-primary" />
            <span className="text-muted-foreground">Performing Sentiment Analysis...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
       <Card className="border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle /> Error Generating Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
          <p className="text-sm text-muted-foreground mt-2">Please try again later or ensure you have enough journal entries.</p>
        </CardContent>
      </Card>
    )
  }

  if (!insights) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Insights Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">AI insights will appear here once generated. You might need more journal entries or click the "Generate Insights" button.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Your AI Insights</CardTitle>
        <CardDescription>Discover patterns and reflections from your journal entries.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            Reflection Score
          </h3>
          <div className="flex items-center gap-4">
            <Progress value={insights.reflectionScore} className="w-full h-3" />
            <span className="font-bold text-primary text-lg">{insights.reflectionScore}%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Based on the depth and introspection of your entries.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Repeat className="h-5 w-5 mr-2 text-primary" />
            Recurring Themes
          </h3>
          {insights.recurringThemes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {insights.recurringThemes.map((theme, index) => (
                <Badge key={index} variant="secondary" className="text-sm px-3 py-1">{theme}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No specific recurring themes identified yet.</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <MessageSquareText className="h-5 w-5 mr-2 text-primary" />
            Sentiment Analysis
          </h3>
          <p className="text-sm bg-muted p-3 rounded-md">{insights.sentimentAnalysis}</p>
        </div>
      </CardContent>
    </Card>
  );
}
