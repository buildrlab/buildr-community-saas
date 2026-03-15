'use client';

import * as React from 'react';
import { UserPlus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { inviteMemberAction } from '@/app/app/members/actions';

export function InviteButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <UserPlus className="h-4 w-4" />
        Invite Member
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Invite Member</CardTitle>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-1 text-brand-900 hover:bg-brand-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form
                action={async (formData: FormData) => {
                  await inviteMemberAction('default', formData);
                  setOpen(false);
                }}
                className="flex flex-col gap-4"
              >
                <Input name="email" type="email" placeholder="Email address" required />
                <select
                  name="role"
                  className="flex h-11 w-full rounded-2xl border border-brand-700/20 bg-white/80 px-4 text-sm text-brand-900 shadow-sm outline-none transition focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/30"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
                <Button type="submit">
                  <UserPlus className="h-4 w-4" />
                  Send Invite
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}
