import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const hostedUiUrl = process.env.NEXT_PUBLIC_COGNITO_HOSTED_UI_URL;

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <Card>
        <CardHeader>
          <CardTitle>Sign in to BuildrLab</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700">
            Use the Cognito hosted UI to sign in. Once authenticated, your JWT will be stored in a
            secure cookie and the dashboard will unlock.
          </p>
          {hostedUiUrl ? (
            <Button asChild>
              <a href={hostedUiUrl}>Continue with Cognito</a>
            </Button>
          ) : (
            <div className="rounded-2xl border border-brand-700/20 bg-brand-100/60 p-4 text-sm text-brand-900">
              Configure <code>NEXT_PUBLIC_COGNITO_HOSTED_UI_URL</code> in your web env to enable the
              hosted UI button.
            </div>
          )}
          <Link href="/docs" className="text-sm text-brand-700 underline underline-offset-4">
            Read the auth setup guide
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
