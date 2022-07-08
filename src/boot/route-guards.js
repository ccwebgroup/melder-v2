import { boot } from "quasar/wrappers";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default boot(async ({ router }) => {
  const auth = getAuth();
  await new Promise((resolve) => {
    const stopObserver = onAuthStateChanged(getAuth(), (firebaseUser) => {
      resolve(firebaseUser);
      stopObserver();
    });
  });

  router.beforeEach((to, from) => {
    if (to.meta.requiresAuth && !auth.currentUser) {
      return {
        path: "/auth/login",
        query: { redirect: to.fullPath },
      };
    }

    if (auth.currentUser && to.path === "/auth/login") {
      return { path: from.path };
    }
  });
});
