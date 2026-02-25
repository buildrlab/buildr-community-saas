import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const steps = [
  {
    title: 'Run locally',
    body: 'Copy the env templates, start the API dev server, then run the Next.js app.',
  },
  {
    title: 'Configure Cognito',
    body: 'Create a user pool + hosted UI, then wire the issuer + JWKS into the API env.',
  },
  {
    title: 'Deploy with Terraform',
    body: 'Use infra/envs/dev or infra/envs/prod to provision AWS resources.',
  },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Docs</p>
        <h1 className="text-4xl font-semibold text-brand-900">Getting started</h1>
        <p className="text-lg text-slate-700">
          Everything you need to run BuildrLab SaaS locally and deploy to AWS.
        </p>
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <Card key={step.title}>
            <CardHeader>
              <CardTitle>{step.title}</CardTitle>
            </CardHeader>
            <CardContent>{step.body}</CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-2xl font-semibold text-brand-900">Test mode</h2>
        <p className="text-slate-700">
          Enable the test-mode bypass in local/dev by setting{' '}
          <code className="rounded bg-brand-100 px-2 py-1 text-sm">ALLOW_TEST_MODE=true</code> in
          the API env and{' '}
          <code className="rounded bg-brand-100 px-2 py-1 text-sm">NEXT_PUBLIC_TEST_MODE=true</code>{' '}
          in the web env. The dashboard will send the{' '}
          <code className="rounded bg-brand-100 px-2 py-1 text-sm">X-Test-User</code> header on API
          calls.
        </p>
        <p className="text-slate-700">
          For production, leave test-mode disabled and use Cognito JWTs via the hosted UI.
        </p>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-2xl font-semibold text-brand-900">Next steps</h2>
        <p className="text-slate-700">
          Review the architectural decision records and start iterating on modules that match your
          product roadmap.
        </p>
        <Link href="/app" className="text-brand-700 underline underline-offset-4">
          Visit the dashboard
        </Link>
      </section>
    </div>
  );
}
