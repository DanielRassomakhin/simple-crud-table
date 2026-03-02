import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useToast } from "vue-toastification";
import type {
  Applicant,
  ApplicantStatus,
} from "@/domain/applicants/applicant.model";
import {
  fetchApplicants,
  type ApplicantsQuery,
  type ApplicantCreatePayload,
  createApplicantApi,
  updateApplicantApi,
  deleteApplicantApi,
} from "@/infrastructure/api/api";

export const useApplicantsStore = defineStore("applicants", () => {
  const toast = useToast();
  const items = ref<Applicant[]>([]);
  const total = ref(0);

  const page = ref(1);
  const itemsPerPage = ref(10);
  const search = ref("");
  const status = ref<ApplicantStatus | "">("");
  const sortBy = ref<"fullName" | "createdAt">("createdAt");
  const sortOrder = ref<"asc" | "desc">("desc");

  const loading = ref(false);
  const mutationLoading = ref(false);
  const error = ref<string | null>(null);

  const query = computed<ApplicantsQuery>(() => ({
    page: page.value,
    perPage: itemsPerPage.value,
    search: search.value || undefined,
    status: status.value || undefined,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
  }));

  async function load() {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchApplicants(query.value);

      items.value = response.data;
      total.value = response.meta.total;
      page.value = response.meta.page;
      itemsPerPage.value = response.meta.perPage;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Не удалось загрузить список заявителей";
      error.value = message;
      toast.error(message);
    } finally {
      loading.value = false;
    }
  }

  async function createApplicant(
    payload: ApplicantCreatePayload
  ): Promise<Applicant> {
    mutationLoading.value = true;
    error.value = null;

    try {
      const created = await createApplicantApi(payload);
      items.value = [created, ...items.value];
      total.value += 1;
      toast.success("Заявитель создан");
      return created;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Не удалось создать заявителя";
      error.value = message;
      toast.error(message);
      throw err;
    } finally {
      mutationLoading.value = false;
    }
  }

  async function updateApplicant(
    id: number,
    payload: Partial<ApplicantCreatePayload>
  ): Promise<Applicant> {
    mutationLoading.value = true;
    error.value = null;

    try {
      const updated = await updateApplicantApi(id, payload);
      const index = items.value.findIndex((item) => item.id === id);

      if (index !== -1) {
        items.value.splice(index, 1, updated);
      }

      toast.success("Заявитель обновлён");

      const statusFilterActive = !!status.value;

      if(statusFilterActive && updated.status !== status.value) {
        await load();
      }

      return updated;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Не удалось обновить заявителя";
      error.value = message;
      toast.error(message);
      throw err;
    } finally {
      mutationLoading.value = false;
    }
  }

  async function deleteApplicant(id: number): Promise<void> {
    mutationLoading.value = true;
    error.value = null;

    try {
      await deleteApplicantApi(id);
      items.value = items.value.filter((item) => item.id !== id);
      total.value = Math.max(0, total.value - 1);
      toast.success("Заявитель удалён");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Не удалось удалить заявителя";
      error.value = message;
      toast.error(message);
      throw err;
    } finally {
      mutationLoading.value = false;
    }
  }

  function setPage(value: number) {
    if (value === page.value) return;
    page.value = value;
    void load();
  }

  function setItemsPerPage(value: number) {
    if (value === itemsPerPage.value) return;
    itemsPerPage.value = value;
    page.value = 1;
    void load();
  }

  function setSearch(value: string) {
    search.value = value;
    page.value = 1;
    void load();
  }

  function setStatus(value: ApplicantStatus | "") {
    status.value = value;
    page.value = 1;
    void load();
  }

  function setSort(field: "fullName" | "createdAt", order: "asc" | "desc") {
    sortBy.value = field;
    sortOrder.value = order;
    void load();
  }

  async function liveTick() {
    if (!items.value.length) {
      await load();
      return;
    }

    const index = Math.floor(Math.random() * items.value.length);
    const current = items.value[index];
    if (!current) return;

    const STATUS_CYCLE: Record<ApplicantStatus, ApplicantStatus> = {
      new: "in_work",
      in_work: "done",
      done: "new",
    };

    await updateApplicant(current.id, { status: STATUS_CYCLE[current.status] });
  }

  return {
    items,
    total,
    page,
    itemsPerPage,
    search,
    status,
    sortBy,
    sortOrder,
    loading,
    mutationLoading,
    error,

    load,
    setPage,
    setItemsPerPage,
    setSearch,
    setStatus,
    setSort,
    createApplicant,
    updateApplicant,
    deleteApplicant,
    liveTick,
  };
});
