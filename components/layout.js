import Nav from "./nav";

export default function Layout({ children }) {
  return (
    <div className="mx-3 md:max-w-2xl md:mx-auto font-poppins text-slate-900 lg:max-w-[85%]">
      <Nav />
      <main>{children}</main>
    </div>
  );
}
