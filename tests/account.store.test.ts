import { describe, expect, test, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAccountStore } from '../src/stores/account';
import type { Account } from '../src/models/account.model';

describe('Account Store', () => {
  beforeEach(() => {
    // Сбрасываем состояние перед каждым тестом
    setActivePinia(createPinia());
    localStorage.clear();
  });

  test('add new account', () => {
    const store = useAccountStore();
    const initialCount = store.accounts.length;

    store.addAccount();

    expect(store.accounts).toHaveLength(initialCount + 1);
    expect(store.accounts[0]).toMatchObject({
      type: 'LDAP',
      login: '',
      password: null,
    });
  });

  test('deletes account', () => {
    const store = useAccountStore();
    store.addAccount();
    const accountId = store.accounts[0].id;

    store.deleteAccount(accountId);

    expect(store.accounts).toHaveLength(0);
  });

  test('updates existing account', () => {
    const store = useAccountStore();
    store.addAccount();
    const account = store.accounts[0];
    const updatedData: Partial<Account> = {
      login: 'new_login',
      type: 'Local',
      password: 'new_password',
    };

    store.updateAccount({ ...account, ...updatedData });

    const updatedAccount = store.accounts[0];
    expect(updatedAccount.login).toBe('new_login');
    expect(updatedAccount.type).toBe('Local');
    expect(updatedAccount.password).toBe('new_password');
  });

  test('does not update non-existent account', () => {
    const store = useAccountStore();
    const fakeAccount = {
      id: 'non-existent',
      labels: [],
      type: 'LDAP',
      login: 'test',
      password: null
    };

    store.updateAccount(fakeAccount);

    expect(store.accounts).toHaveLength(0);
  });

  describe('Account Type Handling', () => {
    test.each([
      ['LDAP', null],
      ['Local', 'password']
    ])('handles %s type correctly', (type, password) => {
      const store = useAccountStore();
      store.addAccount();
      const account = store.accounts[0];

      store.updateAccount({
        ...account,
        type: type as 'LDAP' | 'Local',
        password
      });

      const updatedAccount = store.accounts[0];
      expect(updatedAccount.type).toBe(type);
      expect(updatedAccount.password).toBe(password);
    });
  });
});
