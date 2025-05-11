import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Download, Target, Info } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Settings - ReflectAI',
};

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldCheck className="text-primary"/> Data Privacy</CardTitle>
          <CardDescription>Manage your data and privacy settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            ReflectAI is designed with your privacy in mind. Your journal entries are personal and sensitive.
            Currently, data is stored locally in your browser. For future cloud backup options, client-side encryption will be employed.
          </p>
          <div className="flex items-center justify-between p-3 bg-accent/20 border border-accent/50 rounded-md">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              <p className="text-sm text-accent-foreground">Offline journaling is active. Data is stored in your browser.</p>
            </div>
          </div>
          <Button variant="outline" disabled>Manage Cloud Backup (Coming Soon)</Button>
          <div>
            <Link href="/privacy-policy" className="text-sm text-primary hover:underline">
              Read our Privacy Policy
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Download className="text-primary"/> Export Options</CardTitle>
          <CardDescription>Export your journal entries.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            You will be able to export your journal as PDF or CSV for offline backup or personal reflection.
          </p>
          <Button variant="outline" disabled>Export as PDF (Coming Soon)</Button>
          <Button variant="outline" className="ml-2" disabled>Export as CSV (Coming Soon)</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target className="text-primary"/> Goal Tracking</CardTitle>
          <CardDescription>Set and track your journaling goals.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Feature to set goals (e.g., daily entries, mood improvement) and track progress is under development.
          </p>
          <Button variant="outline" disabled>Set Journaling Goals (Coming Soon)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
