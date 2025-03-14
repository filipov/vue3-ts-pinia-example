// tests/components/AccountForm.spec.ts
import { describe, test, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import AccountForm from '../../src/components/AccountForm.vue';
import type { Account } from '../../src/models/account.model';
import { nextTick } from 'vue';
import {v4 as uuidv4} from "uuid";
import { i18n } from '../../src/i18n';

describe('AccountForm', () => {
  let account: Account;

  beforeEach(() => {
    account = {
      id: uuidv4(),
      labels: [],
      type: 'LDAP' as 'LDAP' | 'Local',
      login: '',
      password: null,
    };
  });

  test('renders form fields correctly', async () => {
    const wrapper = mount(AccountForm, {
      props: {
        account
      },
      global: {
        plugins: [i18n],
      },
    });

    expect(wrapper.find('[data-test-id="labels-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-id="type-select"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-id="login-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-id="password-input"]').exists()).toBe(false);
  });

  test('shows password field for Local type', async () => {
    const wrapper = mount(AccountForm, {
      props: {
        account: { ...account, type: 'Local', password: 'test' }
      },
      global: {
        plugins: [i18n],
      },
    });

    expect(wrapper.find('[data-test-id="password-input"]').exists()).toBe(true);
  });

  test('validates required fields', async () => {
    const wrapper = mount(AccountForm, {
      props: {
        account: { ...account, type: 'Local', password: null }
      },
      global: {
        plugins: [i18n],
      },
    });

    await wrapper.find('[data-test-id="login-input"]').setValue('');
    await wrapper.find('[data-test-id="login-input"]').trigger('blur');


    const errorMessage = wrapper.find('[data-test-id="login-input"]');
    expect(errorMessage.element).instanceof(HTMLInputElement);
    expect((errorMessage.element as HTMLInputElement).checkValidity()).toEqual(false);
    expect((errorMessage.element as HTMLInputElement).validationMessage).toContain('Обязательное поле');
  });

  test('emits update event on valid input', async () => {
    const wrapper = mount(AccountForm, {
      props: {
        account
      },
      global: {
        plugins: [i18n],
      },
    });

    await wrapper.find('[data-test-id="login-input"]').setValue('new_login');
    await wrapper.find('[data-test-id="login-input"]').trigger('blur');

    expect(wrapper.emitted('update')).toBeTruthy();
    const emittedAccount = wrapper.emitted('update')?.[0][0] as Account;
    expect(emittedAccount.login).toBe('new_login');
  });

  test('handles labels input correctly', async () => {
    const wrapper = mount(AccountForm, {
      props: {
        account: { ...account, login: 'test' }
      },
      global: {
        plugins: [i18n],
      },
    });

    const labelsInput = wrapper.find('[data-test-id="labels-input"]');
    await labelsInput.setValue('label1; label2');
    await nextTick();
    await labelsInput.trigger('blur');

    expect(wrapper.emitted('update')).toBeTruthy();
    const emittedAccount = wrapper.emitted('update')?.[0][0] as Account;
    expect(emittedAccount.labels).toEqual([
      { text: 'label1' },
      { text: 'label2' }
    ]);
  });

  test('shows error for invalid labels', async () => {
    const wrapper = mount(AccountForm, {
      props: {
        account
      },
      global: {
        plugins: [i18n],
      },
    });

    const longLabel = 'a'.repeat(51);
    await wrapper.find('[data-test-id="labels-input"]').setValue(longLabel);
    await wrapper.find('[data-test-id="labels-input"]').trigger('blur');
    await nextTick();

    const errorMessage = wrapper.find('[data-test-id="labels-input"]');
    expect(errorMessage.element).instanceof(HTMLInputElement);
    expect((errorMessage.element as HTMLInputElement).checkValidity()).toEqual(false);
    expect((errorMessage.element as HTMLInputElement).validationMessage).toContain('Максимум 50 символов');
  });

  test('emits delete event', async () => {
    const wrapper = mount(AccountForm, {
      props: {
        account
      },
      global: {
        plugins: [i18n],
      },
    });

    await wrapper.find('[data-test-id="delete-button"]').trigger('click');
    expect(wrapper.emitted('delete')).toEqual([[account.id]]);
  });

  test('updates password field visibility on type change', async () => {
    const wrapper = mount(AccountForm, {
      props: {
        account
      },
      global: {
        plugins: [i18n],
      },
    });

    // Change to Local type
    await wrapper.find('[data-test-id="type-select"]').setValue('Local');
    await nextTick();

    expect(wrapper.find('[data-test-id="password-input"]').exists()).toBe(true);

    // Change back to LDAP
    await wrapper.find('[data-test-id="type-select"]').setValue('LDAP');
    await nextTick();

    expect(wrapper.find('[data-test-id="password-input"]').exists()).toBe(false);
  });

  test('validates password for Local type', async () => {
    const wrapper = mount(AccountForm, {
      props: {
        account: { ...account, type: 'Local', password: null }
      },
      global: {
        plugins: [i18n],
      },
    });

    await wrapper.find('[data-test-id="password-input"]').setValue('');
    await wrapper.find('[data-test-id="password-input"]').trigger('blur');

    const errorMessage = wrapper.find('[data-test-id="password-input"]');
    expect(errorMessage.element).instanceof(HTMLInputElement);
    expect((errorMessage.element as HTMLInputElement).checkValidity()).toEqual(false);
    expect((errorMessage.element as HTMLInputElement).validationMessage).toContain('Обязательное поле');
  });
});
