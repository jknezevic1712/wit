import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "utils/firebase";
import {
  arrayUnion,
  doc,
  getDoc,
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
        time: Timestamp.now(),
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
      setAllMessages(snapshot.data().comments);
    });

    return unsubscribe;
  };

  useEffect(() => {
    if (!router.isReady) return;

    getComments();
  }, [router.isReady]);

  return (
    <div>
      <Message {...routeData}></Message>
      <div className="my-4">
        <div className="flex">
          <input
            className="w-full bg-gray-800 p-2 text-slate-100 text-sm"
            type="text"
            value={message}
            placeholder="Be witty please 😀"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="bg-cyan-500 text-slate-100 py-2 px-4 text-sm"
            onClick={() => submitMessage()}
          >
            Submit
          </button>
        </div>
        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {allMessages?.map((message, id) => {
            console.log("ID => ", id, ", MESS => ", message);

            return (
              <div key={id} className="bg-slate-50 p-4 my-4 border-2">
                <div className="flex items-center gap-2 mb-4">
                  <img
                    className="w-10 rounded-full"
                    src={message.avatar}
                    alt=""
                  />
                  <h2>{message.username}</h2>
                </div>
                <h2>{message.message}</h2>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
