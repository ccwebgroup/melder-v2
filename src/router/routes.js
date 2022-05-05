const routes = [
  //Authentication Routes
  {
    path: "/auth",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      { path: "/login", component: () => import("pages/auth/LoginPage.vue") },
      {
        path: "/signup",
        component: () => import("pages/auth/SignupPage.vue"),
      },
    ],
  },
  /*
      Main Routes
  */
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    redirect: "/home",
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("pages/HomePage.vue"),
      },
      {
        path: "/groups",
        name: "Groups",
        component: () => import("pages/GroupsPage.vue"),
      },
      {
        path: "/updates",
        name: "Updates",
        component: () => import("pages/UpdatesPage.vue"),
      },
      // {
      //   path: "/files",
      //   name: "Files",
      //   component: () => import("pages/FilesPage.vue"),
      // },
    ],
  },

  //User Profile Routes
  {
    path: "/user",
    component: () => import("layouts/UserLayout.vue"),
    children: [
      {
        path: "/user/profile",
        component: () => import("pages/user/UserProfile.vue"),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },

  //Group Routes
  {
    path: "/group/",
    component: () => import("layouts/GroupLayout.vue"),
    children: [
      {
        path: "/group/create",
        component: () => import("pages/group/CreateGroup.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/group/:id",
        component: () => import("pages/group/GroupProfile.vue"),
      },
    ],
  },

  // Update ROutes
  {
    path: "/update/",
    name: "Update",
    component: () => import("layouts/UpdateLayout.vue"),
    children: [
      {
        path: "/update/view",
        component: () => import("pages/updates/ViewUpdate.vue"),
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
