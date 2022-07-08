import { defineStore } from "pinia";
import { db, fs, auth } from "boot/firebase";

export const useUserStore = defineStore("users", {
  state: () => ({
    userProfile: null,
  }),

  actions: {
    async getUserProfile(uid) {
      const userRef = fs.doc(db, "users", uid);
      const userSnap = await fs.getDoc(userRef);
      if (userSnap.exists()) {
        this.userProfile = userSnap.data();
      }
    },

    async addUserProfile(user) {
      await fs.setDoc(fs.doc(db, "users", user.id), user);
    },

    async updateUserProfile(payload) {
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
        } else {
          await fs.updateDoc(userRef, {
            social_links: fs.arrayUnion(payload.link),
          });
          this.userProfile.social_links.push(payload.link);
          return true;
        }
      }
    },
  },
});
