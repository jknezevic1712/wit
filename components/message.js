export default function Message({
  children,
  inComments,
  avatar,
  username,
  description,
  timestamp,
}) {
  const messageTimestamp = new Date(timestamp?.seconds * 1000).toLocaleString();
  // const bgColorsPalette = [
  //   "bg-red-100",
  //   "bg-green-100",
  //   "bg-cyan-100",
  //   "bg-yellow-100",
  //   "bg-orange-100",
  //   "bg-purple-100",
  //   "bg-violet-100",
  //   "bg-pink-100",
  // ];
  // const randomBgColor =
  //   bgColorsPalette[~~(Math.random() * bgColorsPalette.length)];

  if (inComments) {
    return (
      <div className="bg-slate-200 p-8 border-b-2 rounded-md mb-4 shadow-lg">
        <div className="flex justify-between items-center border-b border-slate-400 pb-2 md:justify-start md:gap-2">
          <img className="w-10 rounded-full" src={avatar} alt="" />
          <div className="text-base md:w-full md:flex md:justify-between md:items-center md:text-lg">
            <h2>{username}</h2>
            <p className="text-slate-500">{messageTimestamp}</p>
          </div>
        </div>
        <div className="py-10">
          <p>{description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-200 p-8 border-b-2 rounded-md mb-4 shadow-2xl lg:w-3/4 xl:w-1/2 3xl:w-2/5">
      <div className="flex justify-between items-center border-b border-slate-400 pb-2 md:justify-start md:gap-2">
        <img className="w-10 rounded-full" src={avatar} alt="" />
        <div className="text-base md:w-full md:flex md:justify-between md:items-center md:text-lg">
          <h2>{username}</h2>
          <p className="text-slate-500">{messageTimestamp}</p>
        </div>
      </div>
      <div className="py-10">
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}
