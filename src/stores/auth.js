import { defineStore } from "pinia";
import { auth, fa, db, fs } from "boot/firebase";
// Quasar Plugins
import { Loading, Dialog } from "quasar";
//Other Stores
import { useUserStore } from "./users";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authUser: null,
  }),

  actions: {
    async singInWithProvider(payload) {
      const userStore = useUserStore();
      let provider;
      if (payload == "google") {
        provider = new fa.GoogleAuthProvider();
      }

      try {
        const result = await fa.signInWithPopup(auth, provider);
        // If user successfully signed up
        if (result.user) {
          const user = result.user;

          const userRef = fs.doc(db, "users", user.uid);
          const userSnap = await fs.getDoc(userRef);
          if (!userSnap.exists()) {
            //Add a User Profile
            userStore.addUserProfile({
              id: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL ? user.photoURL : null,
            });
          }

          this.router.replace("/home");
        }
      } catch (err) {
        // Handle Errors here.
        const errCode = err.code;
        const errMessage = err.message;
        // The email of the user's account used.
        const email = err.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(err);
        // ...
        Dialog.create({
          title: "Sorry, signing in error.",
          message: `We've got trouble for ${email}: ${errMessage}`,
        });
      }
    },

    async logoutUser() {
      await auth.signOut();
      this.router.replace("/auth/login");
    },

    async loginUser(payload) {
      try {
        Loading.show();
        const userCredential = await fa.signInWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        );

        Loading.hide();
        this.router.replace("/home");
      } catch (err) {
        const errCode = err.code;
        let errMessage;

        switch (errCode) {
          case "auth/invalid-email":
            errMessage = "Email is invalid";
            break;
          case "auth/user-not-found":
            errMessage = "User is not registered.";
            break;
          case "auth/wrong-password":
            errMessage = "Wrong password.";
            break;
        }

        Loading.hide();
        Dialog.create({
          title: "Login Error",
          message: errMessage,
        });
      }
    },

    async signUpUser(payload) {
      const userStore = useUserStore();
      Loading.show();
      try {
        const userCredential = await fa.createUserWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        );

        // If user successfully signed up
        if (userCredential.user) {
          const user = userCredential.user;
          // Set Display Name in firebase authentication service
          await fa.updateProfile(user, {
            displayName: payload.displayName,
          });
          //Add a User Profile
          await userStore.addUserProfile({
            id: user.uid,
            displayName: payload.displayName,
            email: user.email,
            photoURL: null,
          });
          Loading.hide();
          this.router.replace("/home");
        }
      } catch (error) {
        const errorCode = error.code;
        let errMessage;
        switch (errorCode) {
          case "auth/email-already-in-use":
            errMessage = "Email is already registered!";
            break;
          case "auth/invalid-email":
            errMessage = "Invalid Email.";
            break;
          case "auth/operation-not-allowed":
            errMessage = "Operation is not allowed.";
            break;
          case "auth/weak-password":
            errMessage =
              "Password is weak. Try putting some symbols and numbers. Should be 8 digits or more.";
            break;
        }
        Loading.hide();
        // A Dialog to display Sign up Error
        Dialog.create({
          title: "Sign Up Error",
          message: errMessage,
        });
      }
    },

    async handleAuthStateChanged() {
      fa.onAuthStateChanged(auth, (authUser) => {
        if (authUser) {
          this.authUser = authUser;
          //Get Auth User's profile as well
          // userStore.getUserProfile(authUser.uid).then((profile) => {
          //   this.authUserProfile = profile;
          // });
        }
      });
    },
  },

  // persist: {
  //   enabled: true,
  // },
});
