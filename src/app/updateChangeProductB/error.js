"use client"

import {
  useEffect
} from "react"

import Link from "next/link"

import {
  FaExclamationTriangle
} from "react-icons/fa"

export default function Error({

  error,

  reset

}) {

  useEffect(() => {

    console.error(error)

  }, [error])

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

      <FaExclamationTriangle
        size={80}
        className="
          text-red-500
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
        500
      </h1>

      <h2
        className="
          text-2xl
          font-bold
          mb-3
        "
      >
        Something went wrong
      </h2>

      <p
        className="
          text-gray-600
          max-w-md
          mb-8
        "
      >
        An unexpected error occurred
        while loading this page.
      </p>

      <div
        className="
          flex
          gap-4
        "
      >

        <button
          onClick={() => reset()}
          className="
            bg-black
            text-white
            px-6
            py-3
            rounded-2xl
          "
        >
          Retry
        </button>

        <Link
          href="/"
          className="
            border
            px-6
            py-3
            rounded-2xl
            bg-white
          "
        >
          Home
        </Link>

      </div>

    </div>
  )
}