const routes = [
  // Main Routes
  {
    path: "/",
    redirect: "/home",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "/profile",
        name: "Profile",
        component: () => import("pages/user/ProfilePage.vue"),
      },
    ],
  },

  // Auth Routes
  {
    path: "/auth",
    component: () => import("layouts/AuthLayout.vue"),
    redirect: "/auth/login",
    children: [
      {
        path: "/auth/login",
        component: () => import("pages/auth/LoginPage.vue"),
      },
      {
        path: "/auth/signup",
        component: () => import("pages/auth/SignupPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
