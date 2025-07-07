"use client";

import Link from "next/link";
import React, { ReactNode } from "react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

const Navbar = ({ logo }: { logo: ReactNode }) => {
  const { data } = authClient.useSession();

  return (
    <nav className="font-sans flex text-center sm:flex-row sm:text-left justify-between py-4 px-6 bg-white shadow sm:items-baseline w-full">
      <div className="mb-2 sm:mb-0">
        <Link
          href="/"
          className="text-2xl no-underline text-grey-darkest hover:text-blue-dark font-bold "
        >
          {logo}
        </Link>
      </div>
      <div>
        {data ? (
          <Link href={"/profile"}>
            <Image
              alt={`Profile picture of ${data.user?.name}`}
              className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
              src={data.user?.image as string}
              height={40}
              width={40}
            />
          </Link>
        ) : (
          <Link
            href="/auth"
            className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2 mr-2 font-bold text-blue-400"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
