import { useEffect, useState } from "react";
import { auth, db } from "utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import Toast from "components/toast";

export default function Post() {
  const route = useRouter();
  const routeData = route.query;

  const [post, setPost] = useState({
    description: "",
  });
  const [user, loading] = useAuthState(auth);

  const submitPost = async (e) => {
    e.preventDefault();

    if (!post.description) {
      <Toast type="error" text="Description empty!" />;
      return;
    } else if (post.description.length > 300) {
      <Toast type="error" text="Are you writing a novel?!" />;
      return;
    }

    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() };

      await updateDoc(docRef, updatedPost);

      <Toast type="success" text="Post updated!" />;
      return route.push("/");
    } else {
      const collectionRef = collection(db, "posts");

      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
      });

      <Toast type="success" text="Wit has been posted!" />;
      return route.push("/");
    }
  };

  const checkUser = async () => {
    loading ? null : !user ? route.push("auth/login") : null;

    routeData.id
      ? setPost({ description: routeData.description, id: routeData.id })
      : null;
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <div className="my-20 p-12 shadow-lg rounded-md max-w-md mx-auto">
      <form onSubmit={submitPost}>
        <h1 className="text-2xl font-bold">
          {post.hasOwnProperty("id") ? "Edit your post" : "Create a new post"}
        </h1>
        <div className="py-2">
          <h3 className="text-lg font-medium py-2">Description</h3>
          <textarea
            className="bg-gray-800 h-48 w-full text-slate-100 rounded-md p-2 text-sm"
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
          ></textarea>
          <p
            className={`text-cyan-600 font-medium text-sm ${
              post.description.length > 300 ? "text-red-600" : ""
            }`}
          >
            {post.description.length}/300
          </p>
        </div>
        <button
          className="w-full bg-cyan-600 text-slate-100 font-medium p-2 my-2 rounded-md text-sm"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
