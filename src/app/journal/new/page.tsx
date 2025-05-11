import JournalEntryForm from '@/components/journal/JournalEntryForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'New Journal Entry - ReflectAI',
};

export default function NewJournalEntryPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Journal Entry</CardTitle>
          <CardDescription>Let your thoughts flow. Your AI companion is here to help you reflect.</CardDescription>
        </CardHeader>
        <CardContent>
          <JournalEntryForm />
        </CardContent>
      </Card>
    </div>
  );
}
