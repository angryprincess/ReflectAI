import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Privacy Policy - ReflectAI',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="outline" asChild>
        <Link href="/settings">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Settings
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Privacy Policy for ReflectAI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 prose prose-sm dark:prose-invert max-w-none">
          <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

          <p>Welcome to ReflectAI! Your privacy is critically important to us.</p>

          <h2>1. Information We Collect</h2>
          <p>
            ReflectAI is designed to be a private space for your thoughts.
            Currently, all journal data you create (including entries, tags, categories) is stored locally in your web browser's storage (e.g., localStorage or IndexedDB).
            This means your data does not leave your device unless you explicitly choose to use a future cloud backup feature.
          </p>
          <p>
            If and when cloud backup features are implemented, we will use client-side encryption before any data is sent to our servers. This means we will not have access to your unencrypted journal content.
          </p>
          <p>
            We may collect anonymized usage data to help improve the application, such as feature usage frequency or performance metrics. This data will not include your personal journal content.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            Your journal data is used solely to provide the ReflectAI service to you. This includes:
          </p>
          <ul>
            <li>Storing and displaying your journal entries.</li>
            <li>Allowing you to categorize and tag entries.</li>
            <li>Powering AI features (like insights, mood analysis, and personalized prompts). When AI features are used, relevant data is processed to generate these features, but the raw content remains governed by our privacy principles. For AI processing that involves third-party models, we will ensure data is handled according to strict privacy standards.</li>
          </ul>
          <p>
            Anonymized usage data may be used for:
          </p>
          <ul>
            <li>Improving app functionality and user experience.</li>
            <li>Understanding feature popularity.</li>
            <li>Debugging and performance monitoring.</li>
          </ul>

          <h2>3. Data Storage and Security</h2>
          <p>
            <strong>Local Storage:</strong> Your journal entries are stored on your device. You are responsible for the security of the device itself.
          </p>
          <p>
            <strong>Cloud Backup (Future Feature):</strong> If you opt-in to cloud backup, your data will be encrypted on your device before being transmitted and stored on our secure servers. Only you will hold the key to decrypt your data.
          </p>

          <h2>4. Data Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personally identifiable information or journal content to outside parties.
            Anonymized, aggregated data may be shared for research or statistical purposes, but this will never include information that could identify you or your specific journal entries.
          </p>

          <h2>5. Your Choices</h2>
          <p>
            You can choose not to use AI features if you prefer.
            You can delete your journal entries at any time from your local storage.
            When cloud backup is available, you will have control over enabling or disabling it and managing your backed-up data.
          </p>
          
          <h2>6. Changes to This Privacy Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at [Placeholder Email: privacy@reflectai.example.com].
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
