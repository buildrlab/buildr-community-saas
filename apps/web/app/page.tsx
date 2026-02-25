import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const highlights = [
  {
    title: 'Community-first architecture',
    body: 'Modular layers with clear boundaries so contributors can ship quickly.',
  },
  {
    title: 'AWS-native backend',
    body: 'Lambda + API Gateway + DynamoDB with production-ready defaults.',
  },
  {
    title: 'Opinionated DX',
    body: 'TypeScript strict, shadcn UI, Tailwind v4, and first-class testing.',
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
            BuildrLab Community SaaS
          </p>
          <h1 className="text-4xl font-semibold text-brand-900 md:text-5xl">
            A production-ready SaaS starter kit, built in public by the community.
          </h1>
          <p className="text-lg text-slate-700">
            Launch faster with a modular monorepo that ships with auth, infra, CI, and a fully
            working CRUD example. Contribute what you learn, fork what you need.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/docs">Read the docs</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/app">Open dashboard</Link>
            </Button>
          </div>
        </div>
        <Card className="bg-brand-900 text-brand-100">
          <CardHeader>
            <CardTitle className="text-2xl text-brand-100">What ships out of the box</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-brand-100/80">
            <ul className="space-y-3">
              <li>• Landing + docs UI, plus gated dashboard shell.</li>
              <li>• Cognito JWT auth with test-mode bypass header.</li>
              <li>• DynamoDB single-table CRUD example (Projects).</li>
              <li>• Terraform modules for dev/prod environments.</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>{item.body}</CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
