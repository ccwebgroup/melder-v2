import { defineStore } from "pinia";
import { db, fs, auth } from "boot/firebase";
import { Dialog, Loading, Notify } from "quasar";
import { useUserStore } from "./users";

export const useBlogStore = defineStore("blogs", {
  state: () => ({
    allBlogs: [],
    blog: null,
    yourBlogs: [],
  }),

  actions: {
    async addLikeOrDislike(blogId, type) {
      const blogRef = fs.doc(db, "blogs", blogId);
      let changes;
      if (type == "like") {
        changes = { likes: fs.increment(1) };
        this.blog.likes += 1;
      } else {
        changes = { dislikes: fs.increment(1) };
        this.blog.dislikes += 1;
      }
      await fs.updateDoc(blogRef, changes);
    },

    async deleteComment(blogId, commentId) {
      const blogRef = fs.doc(db, "blogs", blogId);
      const commentRef = fs.doc(blogRef, "comments", commentId);
      await fs.deleteDoc(commentRef);
      await fs.updateDoc(blogRef, { commentsCount: fs.increment(1) });
      const i = this.blog.comments.findIndex((item) => item.id == commentId);
      this.blog.commentsCount -= 1;
      this.blog.comments.splice(i, 1);
    },

    async addComment(comment) {
      const blogRef = fs.doc(db, "blogs", comment.blogId);
      const commentRef = fs.collection(blogRef, "comments");
      const doc = await fs.addDoc(commentRef, {
        authorId: auth.currentUser.uid,
        text: comment.text,
        createdAt: fs.serverTimestamp(),
      });
      await fs.updateDoc(blogRef, { commentsCount: fs.increment(1) });
      this.blog.commentsCount += 1;
      this.blog.comments.push({
        ...comment,
        id: doc.id,
        canUpdate: true,
        author: auth.currentUser,
        createdAt: new Date(),
      });

      return true;
    },

    async getComments(blogId) {
      const blogRef = fs.doc(db, "blogs", blogId);
      const commentRef = fs.collection(blogRef, "comments");
      const q = fs.query(commentRef, fs.orderBy("createdAt"));
      const docs = await fs.getDocs(q);
      docs.forEach(async (doc) => {
        const comment = {
          ...doc.data(),
          id: doc.id,
        };
        // Get Author Details
        const author = await useUserStore().getUserProfile(comment.authorId);
        comment.canUpdate =
          comment.authorId == auth.currentUser.uid ? true : false;
        comment.author = author;
        comment.createdAt = comment.createdAt.toDate();
        this.blog.comments.push(comment);
      });
    },

    async restoreSoftDelete(id) {
      const blogRef = fs.doc(db, "blogs", id);
      await fs.updateDoc(blogRef, { softDelete: false });
      const i = this.yourBlogs.findIndex((item) => item.id == id);
      if (i > -1) this.yourBlogs[i].softDelete = false;

      Notify.create({
        type: "positive",
        icon: "thumb_up",
        message: "Post restored successfully!",
        position: "bottom-right",
      });
    },

    async deletePost(id, type) {
      const blogRef = fs.doc(db, "blogs", id);
      if (type == "permanent") {
        await fs.deleteDoc(blogRef);
        const i = this.yourBlogs.findIndex((item) => item.id == id);
        if (i > -1) this.yourBlogs.splice(i, 1);
      } else {
        await fs.updateDoc(blogRef, { softDelete: true });
        const i = this.yourBlogs.findIndex((item) => item.id == id);
        if (i > -1) this.yourBlogs[i].softDelete = true;
      }

      return true;
    },

    async getBlogViaSlug(slug) {
      const blogRef = fs.collection(db, "blogs");
      const q = fs.query(blogRef, fs.where("slug", "==", slug), fs.limit(1));
      const docs = await fs.getDocs(q);
      docs.forEach(async (doc) => {
        if (doc.exists) {
          const blog = { ...doc.data(), id: doc.id };
          blog.comments = [];
          blog.createdAt = blog.createdAt.toDate();
          // Get author details
          const author = await useUserStore().getUserProfile(blog.authorId);
          blog.author = author;
          this.blog = blog;
          this.getComments(blog.id);
        }
      });

      return true;
    },

    async getYourBlogs() {
      let blogs = [];
      const blogsRef = fs.collection(db, "blogs");
      const q = fs.query(
        blogsRef,
        fs.where("authorId", "==", auth.currentUser.uid),
        fs.orderBy("createdAt")
      );
      const docs = await fs.getDocs(q);
      docs.forEach((doc) => {
        const blog = { ...doc.data(), id: doc.id };
        blog.createdAt = blog.createdAt.toDate();

        blogs.push(blog);
      });
      this.yourBlogs = blogs;
      return true;
    },

    async getAllBlogs() {
      const blogsRef = fs.collection(db, "blogs");
      const q = fs.query(
        blogsRef,
        fs.where("softDelete", "==", false),
        fs.orderBy("createdAt")
      );
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

      return true;
    },

    async addBlog(blog) {
      Loading.show();
      try {
        const blogRef = fs.collection(db, "blogs");
        const doc = await fs.addDoc(blogRef, {
          ...blog,
          likes: 0,
          dislikes: 0,
          commentsCount: 0,
          softDelete: false,
          authorId: auth.currentUser.uid,
          createdAt: fs.serverTimestamp(),
        });

        this.yourBlogs.unshift({
          ...blog,
          rate: [],
          softDelete: false,
          createdAt: new Date(),
        });

        Notify.create({
          type: "positive",
          icon: "thumb_up",
          message: "Post saved successfully!",
          position: "bottom-right",
        });
        this.router.push("/manage/blogs");
      } catch (err) {
        console.log("Error Code:", err.code);
        console.log("Message", err.message);
      } finally {
        Loading.hide();
      }
    },
  },
});
