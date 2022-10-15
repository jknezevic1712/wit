import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "utils/firebase";
import {
  arrayUnion,
  doc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

import Message from "components/message";

export default function Details() {
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [OPMessageTimestamp, setOPMessageTimestamp] = useState(null);

  const submitMessage = async () => {
    !auth.currentUser ? router.push("/auth/login") : null;
    if (message.length < 1) {
      toast.error("Don't leave an empty message please!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        username: auth.currentUser.displayName,
        timestamp: Timestamp.now(),
      }),
    });

    setMessage("");
  };

  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);

    /* 
      ! By using onSnapshot(), data, comments in this case, will update automatically(refresh)
      ! By using getDoc(), data gets fetched only once and you'd have to refresh the page to see the updated data
      * const docSnap = await getDoc(docRef);
      * setAllMessages(docSnap.data().comments);
    */
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setOPMessageTimestamp(snapshot.data().timestamp);
      setAllMessages(snapshot.data().comments);
    });

    return unsubscribe;
  };

  useEffect(() => {
    if (!router.isReady) return;

    getComments();
  }, [router.isReady]);

  return (
    <div className="my-12 text-lg font-medium lg:flex lg:flex-col lg:justify-center lg:items-center">
      <Message {...routeData} timestamp={OPMessageTimestamp}></Message>
      <div className="flex flex-col justify-center items-center md:w-3/4 md:mx-auto lg:w-1/2 xl:w-2/5 3xl:w-2/6">
        <div className="w-full flex flex-wrap mt-12 mb-6">
          <textarea
            className="w-full bg-slate-200 p-4 text-base resize-none rounded-md"
            maxLength={300}
            rows={5}
            wrap="soft"
            value={message}
            placeholder="Be witty please 😀"
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button
            className="w-full bg-cyan-500 text-slate-100 py-2 px-4 text-sm rounded-md"
            onClick={() => submitMessage()}
          >
            Submit
          </button>
        </div>
        <div className="w-full py-6">
          <h2 className="font-bold p-4">Comments</h2>
          {allMessages?.map((message, id) => (
            <Message
              key={id}
              inComments
              {...routeData}
              timestamp={message.timestamp}
            ></Message>
          ))}
        </div>
      </div>
    </div>
  );
}
