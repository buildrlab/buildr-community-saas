'use client';

import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { updateProfileAction } from './actions';

interface UpdateProfileFormProps {
  initialDisplayName: string;
  initialBio: string;
}

export function UpdateProfileForm({ initialDisplayName, initialBio }: UpdateProfileFormProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => updateProfileAction(formData));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="displayName" className="mb-1 block text-sm font-medium text-brand-700">
          Display Name
        </label>
        <Input
          id="displayName"
          name="displayName"
          defaultValue={initialDisplayName}
          placeholder="Your display name"
          required
          minLength={1}
          maxLength={64}
        />
      </div>

      <div>
        <label htmlFor="bio" className="mb-1 block text-sm font-medium text-brand-700">
          Bio
        </label>
        <Input
          id="bio"
          name="bio"
          defaultValue={initialBio}
          placeholder="A short bio (optional)"
          maxLength={240}
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Saving…' : 'Save Changes'}
      </Button>
    </form>
  );
}
