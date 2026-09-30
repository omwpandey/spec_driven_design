import { describe, expect, it } from 'vitest';
import { resolveTemplate } from '../useFormValidation';

describe('resolveTemplate', () => {
  it('replaces simple and nested path tokens', () => {
    const data = { user: { name: 'Ana' }, branchCode: 'BR-1' };

    expect(resolveTemplate('user.name', data)).toBe('Ana');
    expect(resolveTemplate('{branchCode}-{user.name}', data)).toBe('BR-1-Ana');
    expect(resolveTemplate('{user.name}-{branchCode}', data)).toBe('Ana-BR-1');
  });

  it('handles very large brace-heavy template payloads without hanging', () => {
    const data = { a: 'A', b: 'B' };
    const repeated = Array.from({ length: 20000 }, () => '{a}-{b}').join('-');

    const start = performance.now();
    const result = resolveTemplate(repeated, data);
    const elapsedMs = performance.now() - start;

    expect(result).toBe(Array.from({ length: 20000 }, () => 'A-B').join('-'));
    expect(elapsedMs).toBeLessThan(1500);
  });
});
