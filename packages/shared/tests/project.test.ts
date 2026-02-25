import { createProjectId, normalizeName } from '../src/index';

import { describe, expect, it } from 'vitest';

describe('shared utils', () => {
  it('creates a project id', () => {
    const id = createProjectId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(10);
  });

  it('normalizes names', () => {
    expect(normalizeName('  BuildrLab  ')).toBe('BuildrLab');
  });
});
