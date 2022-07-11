const routes = [
  // Main Routes
  {
    path: "/",
    redirect: "/blogs",
    component: () => import("layouts/MainLayout.vue"),
    // meta: {
    //   requiresAuth: true,
    // },
    children: [
      // {
      //   path: "/home",
      //   name: "Home",
      //   component: () => import("pages/IndexPage.vue"),
      // },
      {
        path: "/profile",
        name: "Profile",
        meta: {
          requiresAuth: true,
        },
        component: () => import("pages/user/ProfilePage.vue"),
      },
      {
        path: "/manage/blogs",
        name: "Your blogs",
        meta: {
          requiresAuth: true,
        },
        component: () => import("pages/user/YourBlogs.vue"),
      },

      {
        path: "/user/:id",
        name: "Overview",
        component: () => import("pages/user/OverviewPage.vue"),
      },
      {
        path: "/blogs",
        name: "Blogs",
        component: () => import("pages/blog/BlogsList.vue"),
      },
      {
        path: "/blogs/create",
        name: "Create Post",
        component: () => import("pages/blog/CreatePost.vue"),
      },
      {
        path: "/blog/:slug",
        name: "Post",
        component: () => import("pages/blog/ViewPost.vue"),
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
