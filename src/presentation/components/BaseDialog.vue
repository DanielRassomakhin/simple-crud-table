<template>
  <VDialog
    class="base-dialog"
    :model-value="modelValue"
    :max-width="maxWidth"
    :persistent="persistent"
    @update:model-value="onUpdateModelValue"
  >
    <VCard>
      <VCardTitle v-if="title" class="base-dialog__title">
        {{ title }}
      </VCardTitle>

      <VCardText class="base-dialog__content">
        <slot />
      </VCardText>

      <VCardActions class="base-dialog__actions">
        <VSpacer />

        <VBtn
          v-if="showCancel"
          variant="text"
          color="secondary"
          class="base-dialog__button base-dialog__button--cancel"
          @click="handleCancel"
        >
          {{ cancelText }}
        </VBtn>

        <VBtn
          v-if="showConfirm"
          :color="confirmColor"
          variant="flat"
          class="base-dialog__button base-dialog__button--confirm"
          :disabled="confirmDisabled"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    maxWidth?: number | string;
    persistent?: boolean;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: string;
    showConfirm?: boolean;
    showCancel?: boolean;
    confirmDisabled?: boolean;
  }>(),
  {
    title: "",
    maxWidth: 480,
    persistent: false,
    confirmText: "OK",
    cancelText: "Отмена",
    confirmColor: "primary",
    showConfirm: true,
    showCancel: true,
    confirmDisabled: false,
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [];
  cancel: [];
}>();

const onUpdateModelValue = (value: boolean) => {
  emit("update:modelValue", value);
};

const close = () => {
  emit("update:modelValue", false);
};

const handleConfirm = () => {
  if (props.confirmDisabled) {
    return;
  }
  emit("confirm");
  close();
};

const handleCancel = () => {
  emit("cancel");
  close();
};
</script>

<style scoped>
.base-dialog__title {
  font-weight: 500;
}

.base-dialog__content {
  padding-top: 8px;
  padding-bottom: 8px;
}

.base-dialog__actions {
  padding-inline: 16px;
  padding-bottom: 12px;
}

.base-dialog__button + .base-dialog__button {
  margin-left: 8px;
}
</style>
