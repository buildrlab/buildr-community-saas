import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Crown, Eye, Globe, MapPin, Shield, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMember } from '@/lib/api';
import { getServerAuthHeaders, hasAuth } from '@/lib/auth';

const roleIcon = (role: string) => {
  switch (role) {
    case 'owner':
      return <Crown className="h-4 w-4" />;
    case 'admin':
      return <Shield className="h-4 w-4" />;
    case 'viewer':
      return <Eye className="h-4 w-4" />;
    default:
      return <Users className="h-4 w-4" />;
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

const MOCK_ACTIVITY = [
  { id: '1', action: 'Joined the workspace', time: '2 weeks ago' },
  { id: '2', action: 'Updated their profile', time: '1 week ago' },
  { id: '3', action: 'Commented on a project', time: '3 days ago' },
  { id: '4', action: 'Created a new project', time: '1 day ago' },
];

export default async function MemberProfilePage(props: {
  params: Promise<{ userId: string }>;
}) {
  const authHeaders = await getServerAuthHeaders();

  if (!hasAuth(authHeaders)) {
    redirect('/login');
  }

  const { userId } = await props.params;
  const member = await getMember(authHeaders, 'default', userId);

  const initials = getInitials(member.displayName || member.email);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Back link */}
      <Link
        href="/app/members"
        className="inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:text-brand-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Members
      </Link>

      {/* Profile header */}
      <Card className="mt-6">
        <CardContent>
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            {/* Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand-100 text-2xl font-semibold text-brand-900">
              {initials}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-semibold text-brand-900">
                {member.displayName || member.email}
              </h1>
              <p className="mt-1 text-sm text-slate-500">{member.email}</p>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                {/* Role badge */}
                <span className="inline-flex items-center gap-1 rounded-full border border-brand-700/20 bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-900">
                  {roleIcon(member.role)}
                  {member.role}
                </span>

                {/* Status */}
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      member.status === 'active' ? 'bg-green-500' : 'bg-slate-400'
                    }`}
                  />
                  {member.status}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 md:justify-start">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Joined {new Date(member.joinedAt).toLocaleDateString()}
                </span>
                {member.lastActiveAt ? (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last active {new Date(member.lastActiveAt).toLocaleDateString()}
                  </span>
                ) : null}
              </div>
            </div>

            {/* Edit button */}
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Bio & details */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            {member.bio ? (
              <p className="text-sm text-slate-600">{member.bio}</p>
            ) : (
              <p className="text-sm italic text-slate-400">No bio provided.</p>
            )}

            <div className="mt-4 space-y-2">
              {member.location ? (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 text-brand-700" />
                  {member.location}
                </div>
              ) : null}
              {member.website ? (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Globe className="h-4 w-4 text-brand-700" />
                  <a
                    href={member.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-700 underline hover:text-brand-900"
                  >
                    {member.website}
                  </a>
                </div>
              ) : null}
            </div>

            {/* Skills */}
            {member.skills && member.skills.length > 0 ? (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                  Skills
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-900"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_ACTIVITY.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                  <div>
                    <p className="text-sm text-brand-900">{item.action}</p>
                    <p className="text-xs text-slate-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
