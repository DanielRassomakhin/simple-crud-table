<template>
  <VSelect
    class="base-select"
    :items="items"
    :item-title="itemTitle"
    :item-value="itemValue"
    :label="label"
    :placeholder="placeholder"
    :density="density"
    :disabled="disabled"
    :readonly="readonly"
    :clearable="clearable"
    :error="Boolean(error)"
    :error-messages="error"
    :hint="hint"
    :persistent-hint="Boolean(hint)"
    :model-value="modelValue"
    @update:model-value="onUpdate"
  />
</template>

<script setup lang="ts">
type Density = "default" | "comfortable" | "compact";

type SelectItem<T = unknown> = T & {
  title?: string;
  value?: string | number;
};

const props = withDefaults(
  defineProps<{
    modelValue: unknown;
    items: SelectItem[];
    itemTitle?: string;
    itemValue?: string;
    label?: string;
    placeholder?: string;
    density?: Density;
    disabled?: boolean;
    readonly?: boolean;
    clearable?: boolean;
    error?: string;
    hint?: string;
  }>(),
  {
    items: () => [],
    itemTitle: "title",
    itemValue: "value",
    density: "comfortable",
    disabled: false,
    readonly: false,
    clearable: false,
    error: "",
    hint: "",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: unknown): void;
  (e: "change", value: unknown): void;
}>();

const onUpdate = (value: unknown) => {
  emit("update:modelValue", value);
  emit("change", value);
};
</script>

<style scoped>
.base-select {
  width: 100%;
}
</style>
