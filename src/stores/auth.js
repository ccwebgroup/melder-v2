import { defineStore } from "pinia";
// Quasar Plugins
import { Loading, Dialog } from "quasar";

import { GoogleAuthProvider } from "firebase/auth";
// Firebase
import {
  auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signInWithPopup,
} from "boot/firebase";

//Other Stores
import { useUserStore } from "./users";
import { useGroupStore } from "./groups";

export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      authUser: null,
      authUserProfile: null,
    };
  },

  getters: {
    getAuthProfile: (state) => {
      return Object.assign(state.authUser, state.authUserProfile);
    },
  },

  actions: {
    async logoutUser() {
      await auth.signOut();
      this.router.replace("/login");
    },

    async singInWithProvider(payload) {
      const userStore = useUserStore();
      let provider;
      if (payload == "google") {
        provider = new GoogleAuthProvider();
      }

      try {
        const result = await signInWithPopup(auth, provider);
        if (payload == "google") {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken; // MIght need for google drive reserve this code
        }

        // If user successfully signed up
        if (result.user) {
          const user = result.user;
          //Add a User Profile
          userStore.addUserProfile({
            id: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: null,
          });

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

        // A Dialog to display Sign up Error
        if (errorCode != "auth/popup-closed-by-user") {
          Dialog.create({
            title: "Sign in Error",
            message: errMessage,
          });
        }
      }
    },

    async loginUser(payload) {
      try {
        Loading.show();
        const userCredential = await signInWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        );
        const user = userCredential.user;
        Loading.hide();
        this.router.replace("/home");
      } catch (error) {
        const errorCode = error.code;
        let errMessage;

        switch (errorCode) {
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

    async reAuthenticateUser(payload) {
      const groupStore = useGroupStore();
      Loading.show({
        spinner: QSpinnerBall,
      });
      try {
        const credential = EmailAuthProvider.credential(
          payload.credential.email,
          payload.credential.password
        );

        reauthenticateWithCredential(auth.currentUser, credential)
          .then(() => {
            //  If User updates sensitive details
            if (payload.newDetails) {
              dispatch("updateUserProfile", payload.newDetails);
            }

            if (payload.groupDelete) {
              groupStore.softDeleteGroup(payload.groupId);
            }
            Loading.hide();
          })
          .catch((err) => {
            let errMessage;
            switch (err.code) {
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
              title: "Authentication Error",
              message: errMessage,
            });
          });
      } catch (error) {
        Loading.hide();
        Dialog.create({
          title: "Authentication Error",
          message: error.message,
        });
      }
    },

    async signUpUser(payload) {
      const userStore = useUserStore();
      Loading.show();
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        );

        // If user successfully signed up
        if (userCredential.user) {
          const user = userCredential.user;
          //Add a User Profile
          userStore.addUserProfile({
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
      const userStore = useUserStore();

      onAuthStateChanged(auth, (authUser) => {
        if (authUser) {
          this.authUser = authUser;
          //Get Auth User's profile as well
          userStore.getUserProfile(authUser.uid).then((profile) => {
            this.authUserProfile = profile;
          });
        }
      });
    },
  },

  persist: {
    enabled: true,
  },
});
