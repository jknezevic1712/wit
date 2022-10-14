import { useEffect, useState } from "react";
import { auth, db } from "utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import Link from "next/link";

import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";

import Message from "components/message";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);

  // See if user is logged in
  const getData = async () => {
    loading ? null : !user ? route.push("auth/login") : null;

    const collectionRef = collection(db, "posts");
    const q = query(
      collectionRef,
      where("user", "==", user.uid),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return unsubscribe;
  };

  const deletePost = async (docId) => {
    const docRef = doc(db, "posts", docId);

    await deleteDoc(docRef);
  };

  // Get user's data
  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div>
      <h1>Your posts</h1>
      <div>
        {posts.map((post) => (
          <Message key={post.id} {...post}>
            <div className="flex gap-4">
              <Link href={{ pathname: "/post", query: post }}>
                <button className="text-teal-600 flex items-center justify-center gap-2 py-2 text-sm">
                  <AiFillEdit className="text-2xl" /> Edit
                </button>
              </Link>
              <button
                className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm"
                onClick={() => deletePost(post.id)}
              >
                <BsTrash2Fill className="text-2xl" /> Delete
              </button>
            </div>
          </Message>
        ))}
      </div>
      <button
        className="font-medium text-slate-100 bg-gray-800 py-2 px-4 rounded my-6"
        onClick={() => auth.signOut()}
      >
        Sign out
      </button>
    </div>
  );
}
