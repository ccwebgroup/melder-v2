import { defineStore } from "pinia";

//Firebase
import {
  db,
  auth,
  doc,
  setDoc,
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
    async deleteNotif(notif) {
      const notifRef = doc(
        collection(doc(db, "users", auth.currentUser.uid), "notifications"),
        notif.id
      );
      deleteDoc(notifRef);
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
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const notif = change.doc.data();
            notif.id = change.doc.id;
            if (notif.type === "group-invite") {
              userStore.getUserProfile(notif.from).then((user) => {
                notif.from = user;
              });
              groupStore.getGroupProfile(notif.groupId).then((group) => {
                notif.group = group;
              });
              const index = this.notifications.findIndex(
                (item) => item.id === notif.id
              );
              if (index === -1) {
                this.notifications.unshift(notif);
              }
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
      });
    },
  },
});
