import React from "react";
import Link from "next/link";
import Button from "./Button";

const Header = () => {
  return (
    <div className="flex flex-col justify-around items-center gap-5 w-full h-96 p-4">
      <div className="text-center mt-8">
        <h1 className="text-4xl font-bold text-gray-900">
          🎉 Create a short version of your links. Free Forever
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          Elevate your online presence with our powerful URL shortening service
          and gain full control over your links. Our SaaS platform offers a
          comprehensive API solution, empowering developers to integrate and
          customize our URL shortening capabilities into their own applications
          seamlessly.
        </p>
      </div>
      <div>
        <Link href="/app">
          <Button>Create short link</Button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
