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

import { HashLoader } from "react-spinners";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";

import Message from "components/message";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);

  // See if user is logged in
  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");

    const collectionRef = collection(db, "posts");
    const q = query(
      collectionRef,
      orderBy("timestamp", "desc"),
      where("user", "==", user?.uid)
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
    !user ? route.push("/") : null;
    if (!user?.uid) return;

    getData();
  }, [user, loading]);

  return (
    <div className="my-12 text-lg font-medium">
      <h1 className="text-center pb-10 md:text-left xl:w-full xl:pb-20 xl:text-xl">
        Your posts
      </h1>
      <div className="lg:flex lg:flex-col lg:justify-center lg:items-center">
        {user?.uid && posts.length > 0 ? (
          posts.map((post) => (
            <Message key={post.id} {...post}>
              <div className="flex gap-4 justify-end">
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
          ))
        ) : (
          <HashLoader color="rgb(6 182 212)" />
        )}
      </div>
    </div>
  );
}
