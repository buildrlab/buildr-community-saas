import { DeleteCommand, GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

import {
  createMemberId,
  type MemberInviteInput,
  type MemberProfile,
  type MemberProfileUpdateInput,
  type MemberRole,
  type MemberRoleUpdateInput,
} from '@buildrlab/shared';

import { config } from './config';
import { docClient } from './db';
import { memberSk, workspacePk } from './keys';

const MEMBER_PREFIX = 'MEMBER#';

export const listMembers = async (
  workspaceId: string,
  options?: { search?: string; role?: MemberRole },
): Promise<MemberProfile[]> => {
  const pk = workspacePk(workspaceId);
  const result = await docClient.send(
    new QueryCommand({
      TableName: config.tableName,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':prefix': MEMBER_PREFIX,
      },
    }),
  );

  let members = (result.Items ?? []).map((item) => ({
    userId: item.userId as string,
    email: item.email as string,
    displayName: item.displayName as string,
    avatarUrl: item.avatarUrl as string | undefined,
    role: item.role as MemberProfile['role'],
    status: item.status as MemberProfile['status'],
    joinedAt: item.joinedAt as string,
    lastActiveAt: item.lastActiveAt as string | undefined,
    bio: item.bio as string | undefined,
    location: item.location as string | undefined,
    website: item.website as string | undefined,
    skills: item.skills as string[] | undefined,
    workspaceId: item.workspaceId as string,
  }));

  if (options?.search) {
    const term = options.search.toLowerCase();
    members = members.filter(
      (m) =>
        m.displayName.toLowerCase().includes(term) ||
        m.email.toLowerCase().includes(term),
    );
  }

  if (options?.role) {
    members = members.filter((m) => m.role === options.role);
  }

  return members;
};

export const getMember = async (
  workspaceId: string,
  userId: string,
): Promise<MemberProfile | null> => {
  const result = await docClient.send(
    new GetCommand({
      TableName: config.tableName,
      Key: {
        pk: workspacePk(workspaceId),
        sk: memberSk(userId),
      },
    }),
  );

  if (!result.Item) return null;

  const item = result.Item;
  return {
    userId: item.userId as string,
    email: item.email as string,
    displayName: item.displayName as string,
    avatarUrl: item.avatarUrl as string | undefined,
    role: item.role as MemberProfile['role'],
    status: item.status as MemberProfile['status'],
    joinedAt: item.joinedAt as string,
    lastActiveAt: item.lastActiveAt as string | undefined,
    bio: item.bio as string | undefined,
    location: item.location as string | undefined,
    website: item.website as string | undefined,
    skills: item.skills as string[] | undefined,
    workspaceId: item.workspaceId as string,
  };
};

export const updateMemberProfile = async (
  workspaceId: string,
  userId: string,
  input: MemberProfileUpdateInput,
): Promise<MemberProfile> => {
  const expressionParts: string[] = [];
  const names: Record<string, string> = {};
  const values: Record<string, unknown> = {};

  if (input.displayName !== undefined) {
    expressionParts.push('#displayName = :displayName');
    names['#displayName'] = 'displayName';
    values[':displayName'] = input.displayName;
  }
  if (input.bio !== undefined) {
    expressionParts.push('#bio = :bio');
    names['#bio'] = 'bio';
    values[':bio'] = input.bio;
  }
  if (input.location !== undefined) {
    expressionParts.push('#location = :location');
    names['#location'] = 'location';
    values[':location'] = input.location;
  }
  if (input.website !== undefined) {
    expressionParts.push('#website = :website');
    names['#website'] = 'website';
    values[':website'] = input.website;
  }
  if (input.skills !== undefined) {
    expressionParts.push('#skills = :skills');
    names['#skills'] = 'skills';
    values[':skills'] = input.skills;
  }

  if (expressionParts.length === 0) {
    const existing = await getMember(workspaceId, userId);
    if (!existing) throw new Error('Member not found');
    return existing;
  }

  const result = await docClient.send(
    new UpdateCommand({
      TableName: config.tableName,
      Key: {
        pk: workspacePk(workspaceId),
        sk: memberSk(userId),
      },
      UpdateExpression: `SET ${expressionParts.join(', ')}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ReturnValues: 'ALL_NEW',
    }),
  );

  const item = result.Attributes!;
  return {
    userId: item.userId as string,
    email: item.email as string,
    displayName: item.displayName as string,
    avatarUrl: item.avatarUrl as string | undefined,
    role: item.role as MemberProfile['role'],
    status: item.status as MemberProfile['status'],
    joinedAt: item.joinedAt as string,
    lastActiveAt: item.lastActiveAt as string | undefined,
    bio: item.bio as string | undefined,
    location: item.location as string | undefined,
    website: item.website as string | undefined,
    skills: item.skills as string[] | undefined,
    workspaceId: item.workspaceId as string,
  };
};

export const updateMemberRole = async (
  workspaceId: string,
  userId: string,
  input: MemberRoleUpdateInput,
): Promise<MemberProfile> => {
  const result = await docClient.send(
    new UpdateCommand({
      TableName: config.tableName,
      Key: {
        pk: workspacePk(workspaceId),
        sk: memberSk(userId),
      },
      UpdateExpression: 'SET #role = :role',
      ExpressionAttributeNames: { '#role': 'role' },
      ExpressionAttributeValues: { ':role': input.role },
      ReturnValues: 'ALL_NEW',
    }),
  );

  const item = result.Attributes!;
  return {
    userId: item.userId as string,
    email: item.email as string,
    displayName: item.displayName as string,
    avatarUrl: item.avatarUrl as string | undefined,
    role: item.role as MemberProfile['role'],
    status: item.status as MemberProfile['status'],
    joinedAt: item.joinedAt as string,
    lastActiveAt: item.lastActiveAt as string | undefined,
    bio: item.bio as string | undefined,
    location: item.location as string | undefined,
    website: item.website as string | undefined,
    skills: item.skills as string[] | undefined,
    workspaceId: item.workspaceId as string,
  };
};

export const removeMember = async (workspaceId: string, userId: string): Promise<void> => {
  await docClient.send(
    new DeleteCommand({
      TableName: config.tableName,
      Key: {
        pk: workspacePk(workspaceId),
        sk: memberSk(userId),
      },
    }),
  );
};

export const inviteMember = async (
  workspaceId: string,
  input: MemberInviteInput,
): Promise<MemberProfile> => {
  const userId = createMemberId();
  const joinedAt = new Date().toISOString();
  const role = input.role ?? 'member';

  const member: MemberProfile = {
    userId,
    email: input.email,
    displayName: input.email,
    role,
    status: 'invited',
    joinedAt,
    workspaceId,
  };

  const item = {
    pk: workspacePk(workspaceId),
    sk: memberSk(userId),
    entityType: 'Member' as const,
    ...member,
  };

  await docClient.send(
    new PutCommand({
      TableName: config.tableName,
      Item: item,
    }),
  );

  return member;
};
