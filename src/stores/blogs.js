import { defineStore } from "pinia";
import { db, fs, auth } from "boot/firebase";
import { Loading, Notify } from "quasar";
import { useUserStore } from "./users";

export const useBlogStore = defineStore("blogs", {
  state: () => ({
    allBlogs: [],
    blog: null,
  }),

  actions: {
    async getBlog(id) {
      const blogRef = fs.doc(db, "blogs", id);
      const doc = await fs.getDoc(blogRef);
      if (doc.exists) {
        const blog = { ...doc.data() };
        blog.createdAt = blog.createdAt.toDate();
        // Get author details
        const author = await useUserStore().getUserProfile(blog.authorId);
        blog.author = author;
        this.blog = blog;

        return true;
      }
    },

    async getAllBlogs() {
      const blogsRef = fs.collection(db, "blogs");
      const q = fs.query(blogsRef, fs.orderBy("createdAt", "desc"));
      const docSnap = await fs.getDocs(q);
      docSnap.forEach(async (doc) => {
        const blog = { ...doc.data(), id: doc.id };
        blog.createdAt = blog.createdAt.toDate();
        // Get Author Details
        const author = await useUserStore().getUserProfile(blog.authorId);
        blog.author = author;

        const i = this.allBlogs.findIndex((item) => item.id == blog.id);
        if (i < 0) this.allBlogs.push(blog);
      });
    },

    async addBlog(blog) {
      Loading.show();
      try {
        const blogRef = fs.collection(db, "blogs");
        const doc = await fs.addDoc(blogRef, {
          ...blog,
          authorId: auth.currentUser.uid,
          createdAt: fs.serverTimestamp(),
        });

        this.allBlogs.unshift({
          ...blog,
          createdAt: new Date(),
        });

        Notify.create({
          type: "positive",
          icon: "thumb_up",
          message: "Post saved successfully!",
          position: "bottom-right",
        });
      } catch (err) {
        console.log(err);
      } finally {
        Loading.hide();
      }
    },
  },
});
