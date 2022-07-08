import { defineStore } from "pinia";
import { db, fs, auth, storage, fStorage, fa } from "boot/firebase";
import { useAuthStore } from "./auth";
import { Notify } from "quasar";

export const useUserStore = defineStore("users", {
  state: () => ({
    userProfile: null,
  }),

  actions: {
    async updateProfile(changes) {
      const userRef = fs.doc(db, "users", authUser.uid);
      await fs.updateDoc(userRef, changes);
    },

    async getUserProfile(uid) {
      const userRef = fs.doc(db, "users", uid);
      const doc = await fs.getDoc(userRef);
      if (doc.exists()) {
        this.userProfile = doc.data();

        return { ...doc.data() };
      }
    },

    async addUserProfile(user) {
      await fs.setDoc(fs.doc(db, "users", user.id), user);
    },

    async updateSocial(payload) {
      const authUser = auth.currentUser;
      const userRef = fs.doc(db, "users", authUser.uid);

      // Add or Delete Social, Links
      if (payload.link) {
        if (payload.delete) {
          await fs.updateDoc(userRef, {
            social_links: fs.arrayRemove(payload.link),
          });
          const i = this.userProfile.social_links.indexOf(payload.link);
          if (i > -1) {
            this.userProfile.social_links.splice(i, 1);
          }

          Notify.create({
            type: "positive",
            icon: "thumb_up",
            message: "Removed successfully!",
            position: "bottom-right",
          });
        } else {
          await fs.updateDoc(userRef, {
            social_links: fs.arrayUnion(payload.link),
          });
          this.userProfile.social_links
            ? this.userProfile.social_links.push(payload.link)
            : (this.userProfile.social_links = [payload.link]);
          Notify.create({
            type: "positive",
            icon: "thumb_up",
            message: "Added successfully!",
            position: "bottom-right",
          });
          return true;
        }
      }
    },

    async updatePhoto(blobImage) {
      const uid = auth.currentUser.uid;
      const avatarsRef = fStorage.ref(
        storage,
        "users/" + uid + "/avatar/" + uid
      );
      await fStorage.uploadBytes(avatarsRef, blobImage);
      const url = await fStorage.getDownloadURL(avatarsRef);
      await fa.updateProfile(auth.currentUser, { photoURL: url });
      useAuthStore().authUser.photoURL = URL.createObjectURL(blobImage);
      this.updateProfile({ photoURL: url });
    },
  },
});
