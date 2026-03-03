<template>
  <main class="applicants-page">
    <ApplicantsHeader
      :live-update-enabled="liveUpdateEnabled"
      @create="openCreate"
      @toggle-live-update="toggleLiveUpdate"
    />

    <ApplicantsFilters />
    <ApplicantsTable @edit="openEdit" @delete="openDelete" />

    <ApplicantsFormDialog
      v-model="formDialogOpen"
      :applicant="selectedApplicant"
    />

    <BaseDialog
      v-model="deleteDialogOpen"
      title="Удаление заявителя"
      confirm-text="Удалить"
      confirm-color="error"
      @confirm="confirmDelete"
    >
      Вы действительно хотите удалить заявителя
      <strong v-if="selectedApplicant">
        {{ selectedApplicant.fullName }}
      </strong>
      ?
    </BaseDialog>
  </main>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { useIntervalFn } from "@vueuse/core";
import ApplicantsTable from "./ApplicantsTable.vue";
import ApplicantsFilters from "./ApplicantsFilters.vue";
import ApplicantsFormDialog from "./ApplicantsFormDialog.vue";
import ApplicantsHeader from "./ApplicantsHeader.vue";
import BaseDialog from "@/presentation/components/BaseDialog.vue";
import type { Applicant } from "@/domain/applicants/applicant.model";
import { useApplicantsStore } from "@/application/applicants/applicants.store";

const store = useApplicantsStore();

const formDialogOpen = ref(false);
const deleteDialogOpen = ref(false);
const selectedApplicant = ref<Applicant | null>(null);
const liveUpdateEnabled = ref(false);

const { pause: pauseLive, resume: resumeLive } = useIntervalFn(
  async () => {
    await store.liveTick();
  },
  2000,
  {
    immediate: false,
  },
);

const openCreate = () => {
  selectedApplicant.value = null;
  formDialogOpen.value = true;
};

const openEdit = (applicant: Applicant) => {
  selectedApplicant.value = applicant;
  formDialogOpen.value = true;
};

const openDelete = (id: number) => {
  const applicant = store.items.find((item) => item.id === id);
  if (!applicant) return;
  selectedApplicant.value = applicant;
  deleteDialogOpen.value = true;
};

const confirmDelete = async () => {
  if (!selectedApplicant.value) return;
  await store.deleteApplicant(selectedApplicant.value.id);
  deleteDialogOpen.value = false;
  selectedApplicant.value = null;
};

const toggleLiveUpdate = () => {
  liveUpdateEnabled.value = !liveUpdateEnabled.value;

  if (liveUpdateEnabled.value) {
    resumeLive();
  } else {
    pauseLive();
  }
};

onBeforeUnmount(() => {
  pauseLive();
});
</script>

<style scoped>
.applicants-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
