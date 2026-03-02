import { storeToRefs } from "pinia";
import { useApplicantsStore } from "@/application/applicants/applicants.store";

type TableHeader = {
  key: string;
  title: string;
  sortable?: boolean;
  align?: "start" | "end" | "center";
  width?: string | number;
};

const NO_DATA_TEXT = "Нет данных";

const HEADERS: TableHeader[] = [
  { key: "id", title: "ID", sortable: true, align: "start" },
  { key: "fullName", title: "ФИО", sortable: true, align: "start" },
  { key: "phone", title: "Телефон", align: "start" },
  { key: "status", title: "Статус", sortable: true, align: "start" },
  { key: "createdAt", title: "Создан", sortable: true, align: "start" },
  { key: "actions", title: "Действия", align: "end" },
];

export function useApplicantsTable() {
  const store = useApplicantsStore();
  const { items, total, page, itemsPerPage, loading } = storeToRefs(store);

  return {
    headers: HEADERS,
    items,
    totalItems: total,
    page,
    itemsPerPage,
    loading,
    noDataText: NO_DATA_TEXT,
    setPage: store.setPage,
    setItemsPerPage: store.setItemsPerPage,
    setSort: store.setSort,
  };
}
