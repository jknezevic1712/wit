import { Fragment } from "react";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";

import { auth } from "utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const MobileMenu = ({ user }) => {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <Menu as="div" className="relative ml-3 md:hidden">
      <div>
        <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none">
          <span className="sr-only">Open user menu</span>
          <img
            className="h-8 w-8 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <Link href="/post">
                <p
                  className={classNames(
                    active ? "bg-gray-100" : "",
                    "block px-4 py-2 text-sm text-gray-700"
                  )}
                >
                  New Post
                </p>
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link href="/dashboard">
                <p
                  className={classNames(
                    active ? "bg-gray-100" : "",
                    "block px-4 py-2 text-sm text-gray-700"
                  )}
                >
                  Dashboard
                </p>
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={classNames(
                  active ? "bg-gray-100" : "",
                  "block px-4 py-2 text-sm text-gray-700"
                )}
                onClick={() => auth.signOut()}
              >
                Sign out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default function Nav() {
  const [user, loading] = useAuthState(auth);

  return (
    <nav className="flex justify-between items-center py-10">
      <Link href="/">
        <button className="text-base font-medium md:text-xl xl:text-2xl">
          Witty minds, witty lines!
        </button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link href="/auth/login">
            <a className="py-2 px-4 text-sm bg-cyan-500 text-slate-100 rounded-md font-medium ml-8">
              Join Now
            </a>
          </Link>
        )}
        {user && (
          <>
            <MobileMenu />
            <div className="hidden md:flex items-center gap-6">
              <Link href="post">
                <button className="font-medium bg-cyan-500 text-slate-100 py-2 px-4 rounded-md text-sm md:text-base xl:text-lg">
                  Post
                </button>
              </Link>
              <button
                className="font-medium bg-slate-200 py-2 px-4 rounded-md text-sm md:text-base xl:text-lg"
                onClick={() => auth.signOut()}
              >
                Sign out
              </button>
              <Link href="/dashboard">
                <img
                  className="w-12 rounded-full cursor-pointer md:w-14 xl:w-16"
                  src={user.photoURL}
                  alt="Dashboard"
                />
              </Link>
            </div>
          </>
        )}
      </ul>
    </nav>
  );
}
