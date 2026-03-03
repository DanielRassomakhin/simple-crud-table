<template>
  <section class="applicants-filters" aria-label="Фильтры заявителей">
    <div class="applicants-filters__row">
      <div class="applicants-filters__search">
        <BaseInput
          v-model="searchLocal"
          label="Поиск по ФИО"
          placeholder="Введите имя заявителя"
          autocomplete="off"
        />
      </div>

      <div class="applicants-filters__actions">
        <BaseButton variant="outlined" color="primary" @click="toggleFilters">
          {{ showFilters ? "Скрыть фильтры" : "Показать фильтры" }}
        </BaseButton>
      </div>
    </div>

    <section
      v-if="showFilters"
      class="applicants-filters__advanced"
      aria-label="Дополнительные фильтры"
    >
      <div class="applicants-filters__field">
        <BaseSelect
          v-model="statusLocal"
          :items="statusItems"
          label="Статус"
          placeholder="Выберите статус"
          @change="onStatusChange"
        />
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useDebounceFn } from "@vueuse/core";
import BaseInput from "@/presentation/components/BaseInput.vue";
import BaseButton from "@/presentation/components/BaseButton.vue";
import BaseSelect from "@/presentation/components/BaseSelect.vue";
import { useApplicantsStore } from "@/application/applicants/applicants.store";
import type { ApplicantStatus } from "@/domain/applicants/applicant.model";

const store = useApplicantsStore();
const { search: storeSearch, status: storeStatus } = storeToRefs(store);

const showFilters = ref(false);
const searchLocal = ref("");
const statusLocal = ref<ApplicantStatus | "">("");

const statusItems = [
  { title: "Все статусы", value: "" },
  { title: "Новый", value: "new" },
  { title: "В работе", value: "in_work" },
  { title: "Завершён", value: "done" },
];

const applySearch = useDebounceFn((value: string) => {
  store.setSearch(value);
}, 400);

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const onStatusChange = (value: unknown) => {
  store.setStatus((value as ApplicantStatus | "") ?? "");
};

watch(searchLocal, (value) => applySearch(value));

watch(storeSearch, (value) => { if (searchLocal.value !== value) searchLocal.value = value; });
watch(storeStatus, (value) => { if (statusLocal.value !== value) statusLocal.value = value; });
</script>

<style scoped>
.applicants-filters {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.applicants-filters__row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.applicants-filters__search {
  flex: 1 1 auto;
}

.applicants-filters__actions {
  flex: 0 0 auto;
}

.applicants-filters__advanced {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.applicants-filters__field {
  min-width: 220px;
  max-width: 260px;
}
</style>
