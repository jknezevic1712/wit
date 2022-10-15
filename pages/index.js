import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "utils/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { HashLoader } from "react-spinners";

import Message from "components/message";

export default function Home() {
  const [allPosts, setAllPosts] = useState([]);

  const getPosts = async () => {
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return unsubscribe;
  };

  const commentNumbers = (post) =>
    post.comments?.length > 0
      ? post.comments?.length === 1
        ? `${post.comments.length} comment`
        : `${post.comments.length} comments`
      : "0 comments";

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      <Head>
        <title>Wit</title>
        <meta name="description" content="Witty minds, witty lines!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="my-12 text-lg font-medium lg:flex lg:flex-col lg:justify-center lg:items-center">
        <h2 className="pb-10 text-center md:text-left xl:w-full xl:pb-20 xl:text-xl">
          See what other people are witting about
        </h2>
        {allPosts.length > 0 ? (
          allPosts.map((post) => {
            return (
              <Message key={post.id} {...post}>
                <div className="flex justify-end">
                  <Link
                    href={{
                      pathname: `/${post.id}`,
                      query: { ...post, timestamp: post.timestamp },
                    }}
                  >
                    <button>{commentNumbers(post)}</button>
                  </Link>
                </div>
              </Message>
            );
          })
        ) : (
          <HashLoader color="rgb(6 182 212)" />
        )}
      </div>
    </>
  );
}
