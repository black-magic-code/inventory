import Link from "next/link"

import {
  FaSearch
} from "react-icons/fa"

export default function NotFound() {

  return (

    <div
      className="
        min-h-screen
        flex
        flex-col
        items-center
        justify-center
        bg-gray-100
        p-6
        text-center
      "
    >

      <FaSearch
        size={80}
        className="
          text-gray-400
          mb-6
        "
      />

      <h1
        className="
          text-5xl
          font-black
          mb-4
        "
      >
        404
      </h1>

      <h2
        className="
          text-2xl
          font-bold
          mb-3
        "
      >
        Page Not Found
      </h2>

      <p
        className="
          text-gray-600
          max-w-md
          mb-8
        "
      >
        The page you are looking for
        does not exist.
      </p>

      <Link
        href="/"
        className="
          bg-black
          text-white
          px-6
          py-3
          rounded-2xl
        "
      >
        Go Home
      </Link>

    </div>
  )
}