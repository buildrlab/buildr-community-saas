import { DeleteCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

import { createProjectId, normalizeName, type Project, type ProjectCreateInput } from '@buildrlab/shared';

import { config } from './config';
import { docClient } from './db';
import { projectSk, userPk } from './keys';

const PROJECT_PREFIX = 'PROJECT#';

export const listProjects = async (ownerId: string): Promise<Project[]> => {
  const pk = userPk(ownerId);
  const result = await docClient.send(
    new QueryCommand({
      TableName: config.tableName,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':prefix': PROJECT_PREFIX,
      },
    }),
  );

  return (result.Items ?? []).map((item) => ({
    projectId: item.projectId as string,
    name: item.name as string,
    createdAt: item.createdAt as string,
    ownerId: item.ownerId as string,
  }));
};

export const createProject = async (ownerId: string, input: ProjectCreateInput): Promise<Project> => {
  const name = normalizeName(input.name);
  if (!name) {
    throw new Error('Project name is required');
  }

  const projectId = createProjectId();
  const createdAt = new Date().toISOString();

  const item = {
    pk: userPk(ownerId),
    sk: projectSk(projectId),
    entityType: 'Project',
    projectId,
    name,
    createdAt,
    ownerId,
  };

  await docClient.send(
    new PutCommand({
      TableName: config.tableName,
      Item: item,
      ConditionExpression: 'attribute_not_exists(pk) AND attribute_not_exists(sk)',
    }),
  );

  return { projectId, name, createdAt, ownerId };
};

export const deleteProject = async (ownerId: string, projectId: string): Promise<void> => {
  await docClient.send(
    new DeleteCommand({
      TableName: config.tableName,
      Key: {
        pk: userPk(ownerId),
        sk: projectSk(projectId),
      },
    }),
  );
};
