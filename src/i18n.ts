import { createI18n } from 'vue-i18n';

type MessageSchema = typeof ruMessages;

const ruMessages = {
  accountManagement: {
    title: 'Учетными записи',
    notice: 'Для указания нескольких меток для одной пары логин/пароль используйте разделитель «;»',
  },
  common: {
    delete: 'Удалить',
    addAccount: 'Добавить учетную запись',
  },
  accountForm: {
    labels: 'Метки',
    accountType: 'Тип записи',
    login: 'Логин',
    password: 'Пароль',
    typeOptions: {
      ldap: 'LDAP',
      local: 'Локальная',
    },
    errors: {
      required: 'Обязательное поле',
      maxLength: 'Максимум {max} символов',
      passwordRequired: 'Обязательное поле для локальных аккаунтов',
    },
  },
  validation: {
    invalidLabels: 'Некорректные метки',
    invalidLogin: 'Некорректный логин',
    invalidPassword: 'Некорректный пароль',
  },
};

const enMessages = {
  accountManagement: {
    title: 'Accounts',
    notice: 'To specify multiple labels for one login/password pair, use the separator ";"',
  },
  common: {
    delete: 'Delete',
    addAccount: 'Add Account',
  },
  accountForm: {
    labels: 'Labels',
    accountType: 'Account Type',
    login: 'Login',
    password: 'Password',
    typeOptions: {
      ldap: 'LDAP',
      local: 'Local',
    },
    errors: {
      required: 'Required field',
      maxLength: 'Maximum {max} characters',
      passwordRequired: 'Required for local accounts',
    },
  },
  validation: {
    invalidLabels: 'Invalid labels',
    invalidLogin: 'Invalid login',
    invalidPassword: 'Invalid password',
  },
};

export const i18n = createI18n<[MessageSchema], 'ru' | 'en'>({
  legacy: false,
  locale: 'ru',
  fallbackLocale: 'en',
  messages: {
    ru: ruMessages,
    en: enMessages,
  },
});
