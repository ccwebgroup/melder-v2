import { defineStore } from "pinia";

//Firebase
import {
  db,
  auth,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "boot/firebase";

//Other Stores
import { useUserStore } from "./users";
import { useGroupStore } from "./groups";

export const useNotifStore = defineStore("notifs", {
  state: () => {
    return {
      notifications: [],
    };
  },

  actions: {
    async markAsViewed(notif) {
      const notifRef = doc(
        collection(doc(db, "users", auth.currentUser.uid), "notifications"),
        notif.id
      );
      updateDoc(notifRef, { viewed: true });
      const index = this.notifications.findIndex((item) => item.id == notif.id);
      if (index > -1) {
        this.notifications[index].viewed = true;
      }
    },

    async deleteNotif(notif) {
      const notifRef = doc(
        collection(doc(db, "users", auth.currentUser.uid), "notifications"),
        notif.id
      );
      deleteDoc(notifRef);
      this.notifications = this.notifications.filter(
        (item) => item.id != notif.id
      );
    },

    async getNotifications() {
      const userStore = useUserStore();
      const groupStore = useGroupStore();
      const notifRef = collection(
        doc(db, "users", auth.currentUser.uid),
        "notifications"
      );
      const q = query(notifRef, orderBy("createdAt"));
      const unsub = onSnapshot(notifRef, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const notif = change.doc.data();
            notif.id = change.doc.id;
            const user = await userStore.getUserProfile(notif.from);
            notif.from = user;
            notif.group = await groupStore.getGroupProfile(notif.groupId);

            if (!change.doc.metadata.hasPendingWrites) {
              notif.createdAt = notif.createdAt.toDate();
            } else {
              notif.createdAt = new Date();
            }
            const index = this.notifications.findIndex(
              (item) => item.id === notif.id
            );
            if (index === -1) {
              this.notifications.unshift(notif);
            }
          }

          if (change.type === "modified") {
            console.log("modified");
          }

          if (change.type === "removed") {
            this.notifications = this.notifications.filter(
              (item) => item.id !== change.doc.id
            );
          }
        });
      });
    },

    async addUserNotification(payload) {
      const authUserId = auth.currentUser.uid;
      const notifRef = doc(
        collection(doc(db, "users", payload.userId), "notifications")
      );
      await setDoc(notifRef, {
        createdAt: serverTimestamp(),
        type: payload.type,
        from: authUserId,
        groupId: payload.groupId,
        viewed: false,
      });
    },
  },
});
