import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Crown, Eye, Search, Shield, UserPlus, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InviteButton } from '@/components/members/invite-modal';
import { listMembers } from '@/lib/api';
import { getServerAuthHeaders, hasAuth } from '@/lib/auth';

const roleIcon = (role: string) => {
  switch (role) {
    case 'owner':
      return <Crown className="h-3 w-3" />;
    case 'admin':
      return <Shield className="h-3 w-3" />;
    case 'viewer':
      return <Eye className="h-3 w-3" />;
    default:
      return <Users className="h-3 w-3" />;
  }
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

const ROLES = ['all', 'owner', 'admin', 'member', 'viewer'] as const;

export default async function MembersPage(props: {
  searchParams: Promise<{ search?: string; role?: string }>;
}) {
  const authHeaders = await getServerAuthHeaders();

  if (!hasAuth(authHeaders)) {
    redirect('/login');
  }

  const searchParams = await props.searchParams;
  const search = searchParams.search ?? '';
  const currentRole = searchParams.role ?? 'all';

  const members = await listMembers(authHeaders, 'default', {
    search: search || undefined,
    role: currentRole === 'all' ? undefined : currentRole,
  });

  const total = members.length;
  const active = members.filter((m) => m.status === 'active').length;
  const invited = members.filter((m) => m.status === 'invited').length;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
            Workspace
          </p>
          <h1 className="text-4xl font-semibold text-brand-900">Members</h1>
        </div>
        <InviteButton />
      </div>

      {/* Stats bar */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-2">
            <Users className="h-4 w-4 text-brand-700" />
            <span className="font-semibold text-brand-900">{total}</span> Total
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="font-semibold text-brand-900">{active}</span> Active
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-brand-700" />
            <span className="font-semibold text-brand-900">{invited}</span> Pending
          </CardContent>
        </Card>
      </div>

      {/* Search bar */}
      <Card className="mt-6">
        <CardContent>
          <form className="flex gap-3" action="/app/members" method="GET">
            {currentRole !== 'all' ? (
              <input type="hidden" name="role" value={currentRole} />
            ) : null}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                name="search"
                placeholder="Search by name or email..."
                defaultValue={search}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      {/* Role filter tabs */}
      <div className="mt-6 flex gap-2">
        {ROLES.map((r) => (
          <Link key={r} href={`/app/members${r === 'all' ? '' : `?role=${r}`}`}>
            <Button variant={currentRole === r ? 'default' : 'outline'} size="sm">
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </Button>
          </Link>
        ))}
      </div>

      {/* Member grid */}
      {members.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Users className="h-10 w-10 text-brand-700/40" />
            <p className="text-lg font-semibold text-brand-900">No members found</p>
            <p className="text-sm text-slate-500">
              {search
                ? 'Try adjusting your search or filters.'
                : 'Invite your first member to get started.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Card key={member.userId}>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-900">
                    {getInitials(member.displayName || member.email)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-brand-900">
                      {member.displayName || member.email}
                    </p>
                    <p className="truncate text-xs text-slate-500">{member.email}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full border border-brand-700/20 bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-900">
                    {roleIcon(member.role)}
                    {member.role}
                  </span>
                  <p className="text-xs text-slate-500">
                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-3">
                  <Link href={`/app/members/${member.userId}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
