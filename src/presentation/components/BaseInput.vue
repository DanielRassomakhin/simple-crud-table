<template>
  <VTextField
    class="base-input"
    :label="label"
    :placeholder="placeholder"
    :type="type"
    :density="density"
    :disabled="disabled"
    :readonly="readonly"
    :clearable="clearable"
    :error="Boolean(error)"
    :error-messages="error"
    :hint="hint"
    :persistent-hint="Boolean(hint)"
    :prepend-inner-icon="prependInnerIcon"
    :append-inner-icon="appendInnerIcon"
    :autocomplete="autocomplete"
    :model-value="modelValue"
    v-maska="mask ? { mask } : undefined"
    @update:model-value="onUpdate"
  />
</template>

<script setup lang="ts">
type InputType = "text" | "tel" | "email" | "password";
type Density = "default" | "comfortable" | "compact";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    label?: string;
    placeholder?: string;
    type?: InputType;
    density?: Density;
    disabled?: boolean;
    readonly?: boolean;
    clearable?: boolean;
    error?: string;
    hint?: string;
    prependInnerIcon?: string;
    appendInnerIcon?: string;
    autocomplete?: string;
    mask?: string;
  }>(),
  {
    modelValue: "",
    type: "text",
    density: "comfortable",
    disabled: false,
    readonly: false,
    clearable: false,
    error: "",
    hint: "",
    prependInnerIcon: undefined,
    appendInnerIcon: undefined,
    autocomplete: "off",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
}>();

const onUpdate = (value: string) => {
  emit("update:modelValue", value);
  emit("change", value);
};
</script>

<style scoped>
.base-input {
  width: 100%;
}
</style>
