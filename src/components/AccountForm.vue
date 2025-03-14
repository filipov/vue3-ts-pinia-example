/**
* Компонент формы редактирования учетной записи
* @component AccountForm
*
* @prop {Account} account - Редактируемая учетная запись
* @emits {Account} update - Событие обновления данных
* @emits {string} delete - Событие удаления записи
*
* @example
* <AccountForm :account="currentAccount" @update="handleUpdate" @delete="handleDelete" />
*/
<script setup lang="ts">
import { type Account, AccountSchema, LabelSchema } from '@/models/account.model';
import { computed, ref, type Ref } from 'vue';
import { ZodError } from 'zod';
import FSelect from '@/components/atoms/FSelect.vue';
import FInputWrapper from '@/components/moleculas/FInputWrapper.vue';
import { DeleteTwo as DeleteIcon } from '@icon-park/vue-next';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const typeOptions = [
  { name: t('accountForm.typeOptions.ldap'), value: 'LDAP' },
  { name: t('accountForm.typeOptions.local'), value: 'Local' },
];

const props = defineProps<{
  account: Account;
}>();

const emit = defineEmits(['update', 'delete']);

const account = ref(props.account);

const labels = computed({
  get: () => props.account.labels?.map((l) => l.text).join(';') || '',
  set: (val) => {
    account.value.labels = val
      .split(';')
      .map((s) => ({ text: s.trim() }))
      .filter((l) => l.text);
  },
});

const errors: Ref<Partial<Record<keyof Account, string[]>>> = ref({});

const handleBlurOrChange = async (field: keyof Account, element: EventTarget | null) => {
  if (field === 'type' && account.value.type === 'LDAP') {
    account.value.password = null;
  }

  try {
    if (field === 'labels') {
      LabelSchema.parse({ labels: labels.value });
    } else {
      AccountSchema.parse(account.value);
    }

    emit('update', account.value);

    delete errors.value[field];
    if (element instanceof HTMLInputElement) {
      element.setCustomValidity('');
      element.reportValidity();
    }
  } catch (error) {
    if (error instanceof ZodError) {
      errors.value[field] = error.errors
        .filter((err) => err.path.includes(field))
        .map((err) => err.message);

      if (element instanceof HTMLInputElement) {
        if (
          element.checkValidity() ||
          errors.value[field]?.join(', ') !== element.validationMessage
        ) {
          element.setCustomValidity(errors.value[field]?.join(', '));
          element.reportValidity();

          // Некоторое время показываем сообщение об ошибке пользователю
          setTimeout(() => element.blur(), 1000);
        }
      }
    }
  }
};

const handleFocus = (event: FocusEvent) => {
  if (event.target instanceof HTMLInputElement) {
    event.target.reportValidity();
  }
};

const handleDelete = () => {
  emit('delete', props.account.id);
};
</script>

<template>
  <form class="account-form" :class="{ 'without-field': account.type !== 'Local' }">
    <f-input-wrapper :label="t('accountForm.labels')" :errors="errors.labels" name="labels">
      <template v-slot="{ id }">
        <input
          v-model="labels"
          :id="id"
          class="input"
          name="labels"
          data-test-id="labels-input"
          type="text"
          @blur="(event) => handleBlurOrChange('labels', event.target)"
          @focus="handleFocus"
        />
      </template>
    </f-input-wrapper>
    <f-input-wrapper :label="t('accountForm.accountType')" :errors="errors.type" name="type">
      <template v-slot="{ id }">
        <f-select
          v-model="account.type"
          :id="id"
          name="type"
          data-test-id="type-select"
          @change="(event) => handleBlurOrChange('type', event.target)"
          :values="typeOptions"
        />
      </template>
    </f-input-wrapper>
    <f-input-wrapper :label="t('accountForm.login')" :errors="errors.login" name="login">
      <template v-slot="{ id }">
        <input
          v-model="account.login"
          :id="id"
          class="input"
          name="login"
          data-test-id="login-input"
          type="text"
          @blur="(event) => handleBlurOrChange('login', event.target)"
          @focus="handleFocus"
      /></template>
    </f-input-wrapper>
    <f-input-wrapper
      v-if="account.type === 'Local'"
      :label="t('accountForm.password')"
      :errors="errors.password"
      name="password"
    >
      <template v-slot="{ id }">
        <input
          v-model="account.password"
          :id="id"
          class="input"
          name="password"
          data-test-id="password-input"
          type="password"
          @blur="(event) => handleBlurOrChange('password', event.target)"
          @focus="handleFocus"
      /></template>
    </f-input-wrapper>
    <button
      :title="t('common.delete')"
      class="icon-button"
      data-test-id="delete-button"
      @click.prevent="handleDelete"
    >
      <delete-icon class="icon-button remove" size="24" />
    </button>
  </form>
</template>

<style lang="scss" scoped>
.account-form {
  $base-size: 3fr;

  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(4, $base-size) 1fr;
  align-items: end;

  &.without-field > *:nth-child(3) {
    grid-column: 3 / span 2;
  }

  & > * {
    transition: width 0.1s;
  }
}
</style>
