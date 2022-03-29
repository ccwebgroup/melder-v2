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
  where,
  orderBy,
  onSnapshot,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "src/boot/firebase";

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
    async deleteUpdate(id) {
      deleteDoc(doc(db, "updates", id));
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
    },
  },
});
