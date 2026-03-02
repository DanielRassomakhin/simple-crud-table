import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import ApplicantsPage from "@/presentation/applicants/ApplicantsPage.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "applicants",
    component: ApplicantsPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
