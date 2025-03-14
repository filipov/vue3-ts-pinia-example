/**
 * Метаданные и схема валидации для работы с учетными записями
 * @module AccountModel
 */

import { z } from 'zod';

/**
 * Схема валидации для метки аккаунта
 * @typedef {Object} LabelSchema
 * @property {string} text - Текст метки (максимум 50 символов)
 */
export const LabelSchema = z.object({
  text: z.string().max(50, 'Максимум 50 символов'),
});

/**
 * Основная схема валидации учетной записи
 * @typedef {Object} AccountSchema
 * @property {string} id - UUID идентификатор
 * @property {LabelSchema[]} [labels] - Массив меток (необязательное поле)
 * @property {'LDAP' | 'Local'} type - Тип учетной записи
 * @property {string} login - Логин (обязательное, максимум 100 символов)
 * @property {string|null} password - Пароль (обязателен для Local типа)
 */
export const AccountSchema = z
  .object({
    id: z.string().uuid(),
    labels: z.array(LabelSchema).optional(),
    type: z.enum(['LDAP', 'Local']),
    login: z.string().min(1, 'Обязательное поле').max(100, 'Максимум 100 символов'),
    password: z.union([
      z.string().min(1, 'Обязательное поле').max(100, 'Максимум 100 символов').nullable(),
      z.null(),
    ]),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'Local' && !data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Пароль обязателен для локальных аккаунтов',
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

export type Account = z.infer<typeof AccountSchema>;
