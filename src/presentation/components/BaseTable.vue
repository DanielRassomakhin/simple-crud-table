<template>
  <div class="base-table__wrapper">
    <VDataTableServer
      class="base-table"
      :item-value="itemKey"
      :items="items"
      :headers="headers"
      :items-length="itemsLength ?? 0"
      :items-per-page="itemsPerPage"
      :page="page"
      :loading="loading"
      :density="density"
      v-model:sort-by="internalSortBy"
      @update:page="onUpdatePage"
      @update:items-per-page="onUpdateItemsPerPage"
      @update:sort-by="onUpdateSortBy"
    >
      <template #no-data>
        <div class="base-table__no-data" role="status" aria-live="polite">
          <span class="base-table__no-data-text">
            {{ noDataText }}
          </span>
        </div>
      </template>

      <template #item.actions="{ item }">
        <slot name="item.actions" :item="item" />
      </template>
    </VDataTableServer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

type BaseTableHeader = {
  key: string;
  title: string;
  sortable?: boolean;
  align?: "start" | "end" | "center";
  width?: string | number;
};

type SortByItem = {
  key: string;
  order?: "asc" | "desc";
};

type SortBy = SortByItem[];

const ROW_HEIGHT: Record<string, number> = {
  default: 52,
  comfortable: 52,
  compact: 36,
};
const HEADER_HEIGHT = 56;
const FOOTER_HEIGHT = 60;

const props = defineProps<{
  items: unknown[];
  headers: BaseTableHeader[];
  loading?: boolean;
  page?: number;
  itemsPerPage?: number;
  itemsLength?: number;
  density?: "default" | "comfortable" | "compact";
  noDataText?: string;
  itemKey?: string;
}>();

const emit = defineEmits<{
  "update:page": [value: number];
  "update:itemsPerPage": [value: number];
  "update:sortBy": [value: SortBy];
}>();

const internalSortBy = ref<SortBy>([]);

const itemKey = computed(() => props.itemKey ?? "id");

const minHeight = computed(() => {
  const rowH = ROW_HEIGHT[props.density ?? "comfortable"] ?? 52;
  const rows = props.itemsPerPage ?? 10;
  return `${HEADER_HEIGHT + rows * rowH + FOOTER_HEIGHT}px`;
});

const onUpdatePage = (value: number) => {
  emit("update:page", value);
};

const onUpdateItemsPerPage = (value: number) => {
  emit("update:itemsPerPage", value);
};

const onUpdateSortBy = (value: SortBy) => {
  emit("update:sortBy", value);
};
</script>

<style scoped>
.base-table__wrapper {
  overflow-x: auto;
  min-height: v-bind(minHeight);
  -webkit-overflow-scrolling: touch;
}

.base-table {
  width: 100%;
  min-width: 600px;
}

.base-table__no-data {
  padding: 16px;
  text-align: center;
}

.base-table__no-data-text {
  font-size: 0.875rem;
}
</style>
