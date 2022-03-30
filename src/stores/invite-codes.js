import { defineStore } from "pinia";
import { Loading } from "quasar";

//Firebase
import {
  db,
  doc,
  auth,
  collection,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  limit,
  serverTimestamp,
  Timestamp,
} from "boot/firebase";

//Other Stores
import { useUserStore } from "./users";
import { useGroupStore } from "./groups";
import { useNotifStore } from "./notifs";

export const useCodeStore = defineStore("inviteCodes", {
  state: () => {
    return {
      defaultCode: null,
    };
  },

  actions: {
    async deleteInviteCode(payload) {
      const codeRef = collection(db, "inviteCodes");
      const q = query(
        codeRef,
        where("creatorId", "==", payload.userId),
        where("groupId", "==", payload.groupId),
        where("expirationDate", "<", Timestamp.now().toDate())
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (codeDoc) => {
        await deleteDoc(doc(db, "inviteCodes", codeDoc.id));
      });
    },

    async joinGroupViaCode(code) {
      const groupStore = useGroupStore();
      const userStore = useUserStore();
      const codeRef = doc(db, "inviteCodes", code);
      const docSnap = await getDoc(codeRef);
      if (docSnap.exists()) {
        let codeData = docSnap.data();
        if (codeData.expiration) {
          if (codeData.expirationDate.toDate() < Timestamp.now().toDate()) {
            return { status: "invalid", message: "Invite code is expired." };
          }
        }
        Loading.show();
        // check if user is already a member of the group
        const members = await groupStore.getMembers({
          groupId: codeData.groupId,
        });
        if (members.includes(auth.currentUser.uid)) {
          return { status: "invalid", message: "User is already a member." };
        }
        await groupStore.addMember({
          userId: auth.currentUser.uid,
          groupId: codeData.groupId,
        });
        await userStore.addJoinedGroups({
          userId: auth.currentUser.uid,
          groupId: codeData.groupId,
        });
        const groupRef = doc(db, "groups", codeData.groupId);
        const groupSnap = await getDoc(groupRef);
        if (groupSnap.exists()) {
          let groupData = groupSnap.data();
          this.router.push({
            path: "/group/" + groupData.name.split(" ").join(""),
            query: { id: codeData.groupId },
          });
        }
        Loading.hide();
        return { status: "valid" };
      } else {
        return { status: "invalid", message: "Invite code is invalid." };
      }
    },

    async acceptInvite(notif) {
      const authUserId = auth.currentUser.uid;
      const userStore = useUserStore();
      const groupStore = useGroupStore();
      const notifStore = useNotifStore();
      //Add user to the group
      await groupStore.addMember({
        groupId: notif.groupId,
        userId: auth.currentUser.uid,
      });
      //Add group to users Joined Groups list
      userStore.addJoinedGroups({ userId: authUserId, groupId: notif.groupId });
      // Delete Notif
      await notifStore.deleteNotif(notif);
      //Remove from the group's invite list
      await groupStore.deleteInviteList(notif);
      const groupData = await groupStore.getGroupProfile(notif.groupId);
      groupStore.joinedGroups.push(groupData);
    },

    async declineInvite(notif) {
      const notifStore = useNotifStore();
      const groupStore = useGroupStore();
      // Delete Notif
      await notifStore.deleteNotif(notif);
      //Remove from the group's invite list
      await groupStore.deleteInviteList(notif);
    },

    async getDefaultCode(payload) {
      const codeRef = collection(db, "inviteCodes");
      const q = query(
        codeRef,
        where("creatorId", "==", auth.currentUser.uid),
        where("groupId", "==", payload.groupId),
        where("expiration", "==", payload.expiration),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((codeDoc) => {
        // Delete expired code
        this.deleteInviteCode({
          userId: auth.currentUser.uid,
          groupId: payload.groupId,
        });

        let codeData = codeDoc.data();
        let codeId = codeDoc.id;
        this.defaultCode = { ...codeData, id: codeId };
      });
    },

    async addInviteCode(payload) {
      if (payload.expiration) {
        let expirationDate = qDate.addToDate(Timestamp.now().toDate(), {
          days: payload.expiration,
        });
        payload.expirationDate = expirationDate;
      }
      payload.creatorId = auth.currentUser.uid;
      payload.createdAt = serverTimestamp();

      const codeRef = await addDoc(collection(db, "inviteCodes"), payload);
      this.defaultCode = { ...payload, id: codeRef.id };
    },
  },
});
