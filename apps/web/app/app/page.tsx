import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { listProjects } from '@/lib/api';
import { getServerAuthHeaders, hasAuth, isTestModeEnabled } from '@/lib/auth';

import { createProjectAction, deleteProjectAction } from './actions';

export default async function DashboardPage() {
  const authHeaders = await getServerAuthHeaders();

  if (!hasAuth(authHeaders)) {
    redirect('/login');
  }

  const projects = await listProjects(authHeaders);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
            Dashboard
          </p>
          <h1 className="text-4xl font-semibold text-brand-900">Projects</h1>
        </div>
        {isTestModeEnabled() ? (
          <span className="rounded-full border border-brand-700/30 bg-brand-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-900">
            Test mode enabled
          </span>
        ) : null}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Create a project</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createProjectAction} className="flex flex-col gap-3 md:flex-row">
            <Input name="name" placeholder="e.g. BuildrLab Community" />
            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>

      <section className="mt-8 space-y-4">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="text-slate-600">
              No projects yet. Create your first one to validate the stack.
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.projectId}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-slate-600">
                  Created {new Date(project.createdAt).toLocaleString()}
                </div>
                <form action={async () => deleteProjectAction(project.projectId)}>
                  <Button type="submit" variant="outline" size="sm">
                    Delete
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))
        )}
      </section>
    </div>
  );
}
