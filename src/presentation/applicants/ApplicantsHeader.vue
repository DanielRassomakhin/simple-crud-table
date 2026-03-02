<template>
  <header class="applicants-header">
    <BaseButton color="primary" @click="$emit('create')">
      Добавить заявителя
    </BaseButton>

    <BaseButton
      class="applicants-header__live"
      :variant="liveUpdateEnabled ? 'flat' : 'outlined'"
      :color="liveUpdateEnabled ? 'success' : 'secondary'"
      @click="$emit('toggle-live-update')"
    >
      Live update: {{ liveUpdateEnabled ? "On" : "Off" }}
    </BaseButton>
  </header>
</template>

<script setup lang="ts">
import BaseButton from "@/presentation/components/BaseButton.vue";

defineProps<{
  liveUpdateEnabled: boolean;
}>();

defineEmits<{
  create: [];
  "toggle-live-update": [];
}>();
</script>

<style scoped>
.applicants-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 4px;
}

.applicants-header__live {
  min-width: 160px;
}
</style>
