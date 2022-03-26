const routes = [
  //Authentication Routes
  {
    path: "/auth",
    component: () => import("layouts/AuthLayout.vue"),
    meta: {
      requiresAuth: true,
    },
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
      { path: "/home", component: () => import("pages/HomePage.vue") },
      { path: "/groups", component: () => import("pages/GroupsPage.vue") },
    ],
    /*   children: [

          {
            path: "/files",
            name: "Files",
            component: () => import("pages/files/Files.vue"),
          },
          {
            path: "/groups",
            name: "Groups",
            component: () => import("pages/group/Groups.vue"),
          },
          {
            path: "/updates",
            name: "Updates",
            component: () => import("pages/updates/Updates.vue"),
          },
        ], */
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

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
