import { redirect } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProfile } from '@/lib/api';
import { getServerAuthHeaders, hasAuth } from '@/lib/auth';

import { UpdateProfileForm } from './update-profile-form';

export default async function ProfilePage() {
  const authHeaders = await getServerAuthHeaders();

  if (!hasAuth(authHeaders)) {
    redirect('/login');
  }

  const profile = await getProfile(authHeaders);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
          Account
        </p>
        <h1 className="text-4xl font-semibold text-brand-900">Your Profile</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-200 text-lg font-bold text-brand-800">
              {profile.displayName.charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="font-semibold text-brand-900">{profile.displayName}</p>
              <p className="text-sm text-brand-600 capitalize">{profile.role}</p>
            </div>
          </div>

          <UpdateProfileForm
            initialDisplayName={profile.displayName}
            initialBio={profile.bio ?? ''}
          />
        </CardContent>
      </Card>
    </div>
  );
}
