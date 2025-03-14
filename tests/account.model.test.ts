import { describe, expect, test } from 'vitest';
import { AccountSchema, LabelSchema } from '../src/models/account.model';

describe('Account Model Validation', () => {
  describe('Label Schema', () => {
    test('valid label', () => {
      const result = LabelSchema.safeParse({ labels: 'test' });
      expect(result.success).toBe(true);
    });
  });

  describe('Account Schema', () => {
    const baseAccount = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      type: 'Local' as const,
      login: 'valid_login',
      password: 'secure_password'
    };

    test('valid LDAP account', () => {
      const account = { ...baseAccount, type: 'LDAP', password: null };
      const result = AccountSchema.safeParse(account);
      expect(result.success).toBe(true);
    });

    test('valid Local account', () => {
      const result = AccountSchema.safeParse(baseAccount);
      expect(result.success).toBe(true);
    });

    test('missing login', () => {
      const account = { ...baseAccount, login: '' };
      const result = AccountSchema.safeParse(account);
      expect(result.success).toBe(false);
    });

    test('login exceeds 100 chars', () => {
      const account = { ...baseAccount, login: 'a'.repeat(101) };
      const result = AccountSchema.safeParse(account);
      expect(result.success).toBe(false);
    });

    test('Local account without password', () => {
      const account = { ...baseAccount, password: null };
      const result = AccountSchema.safeParse(account);
      expect(result.success).toBe(false);
    });

    test('LDAP account with password', () => {
      const account = { ...baseAccount, type: 'LDAP', password: 'should_be_null' };
      const result = AccountSchema.safeParse(account);
      expect(result.success).toBe(false);
    });

    test('valid labels array', () => {
      const labels = [{ text: 'label1' }, { text: 'label2' }];
      const account = { ...baseAccount, labels };
      const result = AccountSchema.safeParse(account);
      expect(result.success).toBe(true);
    });

    test('invalid labels structure', () => {
      const labels = [{ value: 'invalid_label' }];
      const account = { ...baseAccount, labels };
      const result = AccountSchema.safeParse(account);
      expect(result.success).toBe(false);
    });

    test('password exceeds 100 chars', () => {
      const account = { ...baseAccount, password: 'a'.repeat(101) };
      const result = AccountSchema.safeParse(account);
      expect(result.success).toBe(false);
    });

    test('error messages structure', () => {
      const account = {
        ...baseAccount,
        login: '',
        password: null,
        labels: [{ text: 'a'.repeat(51) }]
      };

      const result = AccountSchema.safeParse(account);
      if (!result.success) {
        const errors = result.error.issues.map(issue => ({
          path: issue.path,
          message: issue.message
        }));

        expect(errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ path: ['login'] }),
            expect.objectContaining({ path: ['password'] })
          ])
        );
      }
    });
  });
});
