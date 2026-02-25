import { describe, expect, it } from 'vitest';

import { projectSk, userPk } from '../src/keys';

describe('key helpers', () => {
  it('builds user and project keys', () => {
    expect(userPk('user-1')).toBe('USER#user-1');
    expect(projectSk('project-1')).toBe('PROJECT#project-1');
  });
});
