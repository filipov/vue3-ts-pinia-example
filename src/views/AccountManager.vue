/**
* Главный компонент управления учетными записями
* @component AccountManager
*
* @description
* Обеспечивает:
* - Отображение списка учетных записей
* - Добавление новых записей
* - Интеграцию с хранилищем данных
*
* @see {@link module:AccountStore} Используемое хранилище
*/
<script setup lang="ts">
import { useAccountStore } from '@/stores/account';
import AccountForm from '@/components/AccountForm.vue';
import { AddOne } from '@icon-park/vue-next';
import type { Account } from '@/models/account.model.ts';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const accountStore = useAccountStore();
accountStore.loadFromLocalStorage();

const accounts = computed(() => accountStore.accounts);

const addAccount = () => accountStore.addAccount();
const updateAccount = (account: Account) => accountStore.updateAccount(account);
const deleteAccount = (id: string) => accountStore.deleteAccount(id);
</script>

<template>
  <main class="account-manager">
    <div class="account-manager__header">
      <h1 class="page-header">{{ t('accountManagement.title') }}</h1>
      <button :title="t('common.addAccount')" class="icon-button" @click="addAccount">
        <add-one class="icon-button" size="24px" />
      </button>
    </div>
    <aside class="account-manager__notice">
      Для указания нескольких меток для одной пары логин/пароль используйте разделитель «;»
    </aside>
    <section>
      <AccountForm
        v-for="account in accounts"
        :key="account.id"
        :account="account"
        @update="updateAccount"
        @delete="deleteAccount"
      />
    </section>
  </main>
</template>

<style lang="scss" scoped>
.account-manager {
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__header {
    display: flex;
    align-items: center;
  }

  &__notice {
    padding: 10px;
    background-color: var(--color-text);
    color: var(--color-background);
    border-radius: 4px;
  }
}
</style>
