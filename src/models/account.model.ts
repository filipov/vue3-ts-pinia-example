/**
 * Метаданные и схема валидации для работы с учетными записями
 * @module AccountModel
 */

import { z } from 'zod';
import { i18n } from '@/i18n';

const t = i18n.global.t;

/**
 * Схема валидации для метки аккаунта
 * @typedef {Object} LabelSchema
 * @property {string} labels - Текст метки
 */
export const LabelSchema = z.object({
  labels: z.string().max(50, t('accountForm.errors.maxLength', { max: 50 })),
});

/**
 * Основная схема валидации учетной записи
 * @typedef {Object} AccountSchema
 * @property {string} id - UUID идентификатор
 * @property {string[]} [labels] - Массив меток (необязательное поле)
 * @property {'LDAP' | 'Local'} type - Тип учетной записи
 * @property {string} login - Логин (обязательное, максимум 100 символов)
 * @property {string|null} password - Пароль (обязателен для Local типа)
 */
export const AccountSchema = z
  .object({
    id: z.string().uuid(),
    labels: z.array(z.object({ text: z.string() })).optional(),
    type: z.enum(['LDAP', 'Local']),
    login: z
      .string()
      .min(1, t('accountForm.errors.required'))
      .max(100, t('accountForm.errors.maxLength', { max: 100 })),
    password: z.union([
      z
        .string()
        .min(1, t('accountForm.errors.required'))
        .max(100, t('accountForm.errors.maxLength', { max: 100 }))
        .nullable(),
      z.null(),
    ]),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'Local' && !data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('accountForm.errors.passwordRequired'),
        path: ['password'],
      });
    }

    if (data.type === 'LDAP' && data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Пароль должен быть пустым для LDAP аккаунтов',
        path: ['password'],
      });
    }
  });

/**
 * Интерфейс учетной записи
 * @interface Account
 * @extends {z.infer<typeof AccountSchema>}
 */
export type Account = z.infer<typeof AccountSchema>;
