import { defineStore } from 'pinia';
import { type Account } from '@/models/account.model';
import { v4 as uuidv4 } from 'uuid';

/**
 * Хранилище для управления учетными записями
 * @class AccountStore
 */
export const useAccountStore = defineStore('account', {
  state: () => ({
    /**
     * Список учетных записей
     * @type {Account[]}
     */
    accounts: [] as Account[],
  }),
  actions: {
    /**
     * Добавляет новую учетную запись
     * @method addAccount
     * @example
     * store.addAccount();
     */
    addAccount() {
      const newAccount = {
        id: uuidv4(),
        labels: [],
        type: 'LDAP' as 'LDAP' | 'Local',
        login: '',
        password: null,
      };

      this.accounts.push(newAccount);
      this.saveToLocalStorage();
    },
    /**
     * Удаляет учетную запись
     * @method deleteAccount
     * @param {String} id - Удаляет данные учетной записи
     */
    deleteAccount(id: string) {
      this.accounts = this.accounts.filter((account) => account.id !== id);
      this.saveToLocalStorage();
    },
    /**
     * Обновляет существующую учетную запись
     * @method updateAccount
     * @param {Account} updatedAccount - Обновленные данные учетной записи
     * @throws {Error} Если запись не найдена
     */
    updateAccount(updatedAccount: Account) {
      const index = this.accounts.findIndex((acc) => acc.id === updatedAccount.id);

      if (index !== -1) {
        this.accounts[index] = updatedAccount;
        this.saveToLocalStorage();
      }
    },
    saveToLocalStorage() {
      localStorage.setItem('accounts', JSON.stringify(this.accounts));
    },
    loadFromLocalStorage() {
      const stored = localStorage.getItem('accounts');
      if (stored) {
        this.accounts = JSON.parse(stored);
      }
    },
  },
});
