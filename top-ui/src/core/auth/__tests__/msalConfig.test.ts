// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { loginRequest } from '../msalConfig';

describe('loginRequest', () => {
  it('requests only identity scopes for sign-in', () => {
    expect(loginRequest.scopes).toEqual(['openid', 'profile', 'email']);
  });
});
