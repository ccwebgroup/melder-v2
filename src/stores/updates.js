import { async } from "@firebase/util";
import { defineStore } from "pinia";
import { Dialog, Loading, Notify } from "quasar";

import {
  auth,
  db,
  doc,
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "src/boot/firebase";

//Other Stores
import { useNotifStore } from "./notifs";
import { useGroupStore } from "./groups";

export const useUpdateStore = defineStore("updates", {
  state: () => {
    return {
      updates: [],
    };
  },

  getters: {
    getAllUpdates: (state) => {
      state.updates.forEach((item) => {
        if (item.creatorId == auth.currentUser.uid) {
          item.auth = true;
        }
      });
      return state.updates.sort((a, b) => b.createdAt - a.createdAt);
    },
  },

  actions: {
    async deleteUpdate(payload) {
      const updateRef = doc(
        collection(doc(db, "groups", payload.groupId), "updates"),
        payload.id
      );

      await deleteDoc(updateRef);
      // Delete Image if ther is
      if (payload.image) {
        const imageRef = ref(
          storage,
          `groups/${payload.groupId}/updates/${payload.id}`
        );
        deleteObject(imageRef);
      }

      Notify.create({
        message: "Post deleted.",
        icon: "check_circle_outline",
      });
    },

    async getAllUpdatesAllGroups() {
      const authUserId = auth.currentUser.uid;
      // Get all groups manage
      const groupsManageRef = collection(
        doc(db, "users", authUserId),
        "groupsManage"
      );
      const groupSnap = await getDocs(groupsManageRef);
      groupSnap.forEach(async (groupDoc) => {
        let groupId = groupDoc.id;
        let groupRef = doc(db, "groups", groupId);
        const docSnap = await getDoc(groupRef);
        let groupData = docSnap.data();
        //Get all updtes of a group
        const q = query(collection(groupRef, "updates"), orderBy("createdAt"));
        const unsub = onSnapshot(q, (snapshots) => {
          snapshots.docChanges().forEach(async (change) => {
            const updateData = change.doc.data();
            if (change.type === "added") {
              let userSnap = await getDoc(
                doc(db, "users", updateData.creatorId)
              );
              updateData.creator = userSnap.data();
              updateData.group = groupData;
              updateData.id = change.doc.id;
              if (!change.doc.metadata.hasPendingWrites) {
                updateData.createdAt = updateData.createdAt.toDate();
              } else {
                updateData.createdAt = new Date();
              }
              let index = this.updates.findIndex(
                (item) => item.id == updateData.id
              );
              if (index == -1) {
                this.updates.unshift(updateData);
              }
            }

            if (change.type === "modified") {
            }

            if (change.type === "removed") {
              this.updates = this.updates.filter(
                (item) => item.id !== change.doc.id
              );
            }
          });
        });
      });
    },

    async updateUpdate() {},

    async addGroupUpdate(payload) {
      Loading.show();
      const updateRef = collection(
        doc(db, "groups", payload.group.id),
        "updates"
      );
      const updateData = await addDoc(updateRef, {
        createdAt: serverTimestamp(),
        creatorId: auth.currentUser.uid,
        groupId: payload.group.id,
        type: payload.type,
        content: payload.content,
        bgColor: payload.bgColor,
        textWhite: payload.textWhite,
        highlights: payload.highlights,
      });

      if (payload.image) {
        await this.addUpdateImage({
          ...payload,
          updateId: updateData.id,
        });
      }
      //Get all Members and Notify them
      const notifStore = useNotifStore();
      const groupStore = useGroupStore();
      const memberIds = await groupStore.getMembers({
        groupId: payload.group.id,
      });
      memberIds.forEach((id) => {
        notifStore.addUserNotification({
          type: "group-update",
          groupId: payload.group.id,
          from: auth.currentUser.uid,
          userId: id,
        });
      });
      Loading.hide();
    },

    async addUpdateImage(payload) {
      const imageRef = ref(
        storage,
        "groups/" + payload.group.id + "/updates/" + payload.updateId
      );
      await uploadBytes(imageRef, payload.image);
      const url = await getDownloadURL(imageRef);

      // Update Group Avatar Url
      const docRef = doc(
        collection(doc(db, "groups", payload.group.id), "updates"),
        payload.updateId
      );
      await updateDoc(docRef, {
        image: url,
      });

      let index = this.updates.findIndex((item) => item.id == payload.updateId);
      if (index > -1) {
        this.updates[index].image = url;
      }
    },
  },
});
