import { reactive, computed } from "vue";
import { z } from "zod";

/**
 * Composable для валидации форм на основе Zod-схемы.
 *
 * @example
 * const { errors, hasErrors, validate, validateField, clearErrors } =
 *   useFormValidation(mySchema);
 *
 * // Валидация одного поля при вводе
 * validateField('email', form.email);
 *
 * // Полная валидация при сабмите — возвращает трансформированные данные или null
 * const result = validate(form);
 * if (!result) return;
 */
export function useFormValidation<TSchema extends z.ZodObject<z.ZodRawShape>>(
  schema: TSchema
) {
  type Input = z.input<TSchema>;
  type Output = z.output<TSchema>;
  type FieldKey = keyof Input & string;

  const errors = reactive<Record<string, string>>({});

  const hasErrors = computed(() => Object.keys(errors).length > 0);

  const clearErrors = () => {
    Object.keys(errors).forEach((key) => {
      delete errors[key];
    });
  };

  const validateField = (field: FieldKey, value: unknown) => {
    const fieldSchema = schema.shape[field];
    if (!fieldSchema) return;

    const result = (fieldSchema as z.ZodTypeAny).safeParse(value);

    if (!result.success) {
      errors[field] = result.error.issues[0]?.message ?? "Ошибка";
    } else {
      delete errors[field];
    }
  };

  const validate = (data: Input): Output | null => {
    clearErrors();

    const result = schema.safeParse(data);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (field && !(field in errors)) {
          errors[field] = issue.message;
        }
      }
      return null;
    }

    return result.data as Output;
  };

  return {
    errors,
    hasErrors,
    clearErrors,
    validateField,
    validate,
  };
}
