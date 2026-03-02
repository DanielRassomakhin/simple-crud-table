<template>
  <BaseTable
    :headers="headers"
    :items="items"
    :loading="loading"
    :page="page"
    :items-per-page="itemsPerPage"
    :items-length="totalItems"
    :no-data-text="noDataText"
    item-key="id"
    @update:page="setPage"
    @update:items-per-page="setItemsPerPage"
    @update:sort-by="onSortBy"
  >
    <template #item.actions="{ item }">
      <BaseButton
        variant="text"
        color="primary"
        @click="$emit('edit', item as Applicant)"
      >
        Редактировать
      </BaseButton>
      <BaseButton
        variant="text"
        color="error"
        @click="$emit('delete', (item as Applicant).id)"
      >
        Удалить
      </BaseButton>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import type { Applicant } from "@/domain/applicants/applicant.model";
import BaseTable from "@/presentation/components/BaseTable.vue";
import BaseButton from "@/presentation/components/BaseButton.vue";
import { useApplicantsTable } from "./composables/useApplicantsTable";
import { useApplicantsStore } from "@/application/applicants/applicants.store";

const {
  headers,
  items,
  itemsPerPage,
  page,
  totalItems,
  loading,
  noDataText,
  setPage,
  setItemsPerPage,
  setSort,
} = useApplicantsTable();

const store = useApplicantsStore();

defineEmits<{
  edit: [applicant: Applicant];
  delete: [id: number];
}>();

type SortByItem = { key: string; order?: "asc" | "desc" };

const onSortBy = ([first]: SortByItem[]) => {
  if (!first?.order) return;
  if (first.key === "fullName" || first.key === "createdAt") {
    setSort(first.key, first.order);
  }
};

onMounted(() => void store.load());
</script>
