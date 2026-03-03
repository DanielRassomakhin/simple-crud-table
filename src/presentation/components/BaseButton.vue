<template>
  <VBtn
    class="base-button"
    :color="color"
    :variant="variant"
    :loading="loading"
    :disabled="disabled"
    :block="block"
    @click="onClick"
  >
    <slot />
  </VBtn>
</template>

<script setup lang="ts">
type ButtonVariant =
  | "flat"
  | "outlined"
  | "text"
  | "tonal"
  | "elevated"
  | "plain";

const props = withDefaults(
  defineProps<{
    color?: string;
    variant?: ButtonVariant;
    loading?: boolean;
    disabled?: boolean;
    block?: boolean;
  }>(),
  {
    color: "primary",
    variant: "flat",
    loading: false,
    disabled: false,
    block: false,
  },
);

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const onClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return;
  emit("click", event);
};
</script>

<style scoped>
.base-button {
  text-transform: none;
}
</style>
