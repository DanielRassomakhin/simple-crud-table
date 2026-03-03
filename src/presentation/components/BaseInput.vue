<template>
  <VTextField
    ref="textFieldRef"
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
    @update:model-value="onUpdate"
  />
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import IMask from "imask";

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
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
}>();

const textFieldRef = ref<{ $el?: HTMLElement } | null>(null);
const maskRef = ref<ReturnType<typeof IMask> | null>(null);

const getInputElement = () =>
  textFieldRef.value?.$el?.querySelector("input") ?? null;

const emitValue = (value: string) => {
  emit("update:modelValue", value);
  emit("change", value);
};

const onUpdate = (value: string) => {
  if (props.mask) return;
  emitValue(value);
};

const destroyMask = () => {
  maskRef.value?.destroy();
  maskRef.value = null;
};

const initMask = () => {
  destroyMask();

  if (!props.mask) return;

  const input = getInputElement();
  if (!input) return;

  const normalizedMask = props.mask.replace(/#/g, "0");

  const mask = IMask(input, {
    mask: normalizedMask,
    lazy: false,
  });

  mask.on("accept", () => emitValue(mask.value));

  if (props.modelValue) {
    mask.value = props.modelValue;
  }

  maskRef.value = mask;
};

watch(
  () => props.modelValue,
  (value) => {
    if (!maskRef.value) return;
    if (maskRef.value.value !== value) {
      maskRef.value.value = value;
    }
  },
);

watch(
  () => props.mask,
  async () => {
    await nextTick();
    initMask();
  },
);

onMounted(async () => {
  await nextTick();
  initMask();
});

onBeforeUnmount(destroyMask);
</script>

<style scoped>
.base-input {
  width: 100%;
}
</style>
