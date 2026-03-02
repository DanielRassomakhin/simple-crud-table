<template>
  <BaseDialog
    :model-value="modelValue"
    :title="isEditing ? 'Редактирование заявителя' : 'Создание заявителя'"
    :max-width="520"
    :persistent="submitting"
    :confirm-text="isEditing ? 'Сохранить' : 'Создать'"
    :confirm-disabled="!isFormValid || submitting"
    cancel-text="Отмена"
    @update:model-value="onUpdateModelValue"
    @confirm="onSubmit"
    @cancel="onCancel"
  >
    <form class="applicants-form" @submit.prevent="onSubmit">
      <BaseInput
        v-model="form.fullName"
        label="ФИО"
        :error="errors['fullName'] ?? ''"
        autocomplete="off"
        @change="validateField('fullName', form.fullName)"
      />

      <BaseInput
        v-model="form.phone"
        label="Телефон"
        placeholder="+7 900 000-00-00"
        type="tel"
        mask="+7 ### ###-##-##"
        :error="errors['phone'] ?? ''"
        autocomplete="off"
        @change="validateField('phone', form.phone)"
      />

      <BaseSelect
        v-model="form.status"
        :items="STATUS_ITEMS"
        label="Статус"
        :error="errors['status'] ?? ''"
      />
    </form>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import BaseDialog from "@/presentation/components/BaseDialog.vue";
import BaseInput from "@/presentation/components/BaseInput.vue";
import BaseSelect from "@/presentation/components/BaseSelect.vue";
import { useApplicantsStore } from "@/application/applicants/applicants.store";
import { type Applicant } from "@/domain/applicants/applicant.model";
import {
  applicantFormSchema,
  type ApplicantFormInput,
} from "@/domain/applicants/applicant.form";
import { useFormValidation } from "@/shared/validation/useFormValidation";

const STATUS_ITEMS = [
  { title: "Новый", value: "new" },
  { title: "В работе", value: "in_work" },
  { title: "Завершён", value: "done" },
];

const EMPTY_FORM: ApplicantFormInput = {
  fullName: "",
  phone: "+7 ",
  status: "new",
};

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    applicant?: Applicant | null;
  }>(),
  { modelValue: false, applicant: null }
);

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

const store = useApplicantsStore();
const submitting = ref(false);

const form = reactive<ApplicantFormInput>({ ...EMPTY_FORM });

const { errors, hasErrors, clearErrors, validateField, validate } =
  useFormValidation(applicantFormSchema);

const isEditing = computed(() => !!props.applicant);

const isFormValid = computed(
  () =>
    form.fullName.trim().length > 0 &&
    form.phone.replace(/\D/g, "").length === 11 &&
    !!form.status &&
    !hasErrors.value
);

const resetForm = () => {
  clearErrors();
  const { fullName, phone, status } = props.applicant ?? EMPTY_FORM;
  Object.assign(form, { fullName, phone, status });
};

watch(
  () => props.modelValue,
  (open) => {
    if (open) resetForm();
  }
);

const close = () => emit("update:modelValue", false);

const onUpdateModelValue = (value: boolean) => {
  if (!value && submitting.value) return;
  emit("update:modelValue", value);
};

const onCancel = () => {
  if (!submitting.value) close();
};

const onSubmit = async () => {
  if (submitting.value) return;

  const valid = validate(form);
  if (!valid) return;

  submitting.value = true;

  try {
    if (props.applicant) {
      await store.updateApplicant(props.applicant.id, valid);
    } else {
      await store.createApplicant(valid);
    }
    close();
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.applicants-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
