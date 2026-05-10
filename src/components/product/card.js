"use client"

import {
  FaBoxOpen
} from "react-icons/fa"

import {
  useState,
  memo
} from "react"

function ProductCard({
  product
}) {

  const [showCost, setcostShow] =
    useState(false)

  const [showPrice, setPriceShow] =
    useState(false)


  return (

    <div
      className={`
      ${Number(product.quantity) <= Number(product.lowstock)
          ? "bg-red-200"
          : "bg-white"
        }
      text-black
      border
      rounded-3xl
      overflow-hidden
      shadow-sm
      flex
      flex-col
      h-full
      select-none
    `}
    >

      {/* IMAGE */}

      <div
        className="
        aspect-square
        bg-gray-100
        overflow-hidden
        flex
        items-center
        justify-center
      "
      >

        {
          product.image ? (

            <img
              src={product.image}
              alt={product.name}
              className="
              w-full
              h-full
              object-cover
              pointer-events-none
              cursor-default
              select-none
            "
            />

          ) : (

            <div
              className="
              text-gray-400
              text-sm
              flex
              flex-col
              items-center
              gap-2
            "
            >

              <FaBoxOpen />

              <span>
                No Image
              </span>

            </div>

          )
        }

      </div>

      {/* CONTENT */}

      <div
        className="
        p-3
        flex
        flex-col
        gap-3
        flex-1
      "
      >

        {/* BRAND + CATEGORY */}

        <div
          className="
          flex
          items-center
          justify-between
          gap-2
          text-xs
          font-semibold
          uppercase
          text-gray-500
        "
        >

          <div
            className="
            flex
            items-center
            gap-1
            min-w-0
            flex-1
          "
          >

            <span className="truncate">
              {
                product.brand ||
                "-"
              }
            </span>

            <span>•</span>

            <span className="truncate">
              {
                product.category ||
                "-"
              }
            </span>

          </div>

          <span
            className="
            whitespace-nowrap
            cursor-pointer
            select-none
          "
            onDoubleClick={() =>
              setcostShow(
                (cost) => !cost
              )
            }
            onClick={() =>
              setcostShow(false)
            }
          >

            {
              showCost
                ? `₹${product.cost || 0}`
                : "xx"
            }

          </span>

        </div>

        {/* PRODUCT NAME */}

        <h2
          className="
          text-xl
          font-bold
          leading-tight
          line-clamp-2
          wrap-break-words
        "
        >

          {
            product.name ||
            "Unnamed Product"
          }

        </h2>

        {/* SKU */}

        <div
          className="
          text-sm
          font-bold
          break-all
        "
        >

          SKU :
          {" "}
          {
            product.sku ||
            "NO_SKU"
          }

        </div>

        {/* NOTE */}

        <p
          className="
          text-sm
          text-gray-500
          line-clamp-3
          wrap-break-words
        "
        >

          {
            product.note ||
            "No description"
          }

        </p>

        {/* PRICE + QUANTITY */}

        <div
          className="
          grid
          grid-cols-2
          gap-2
          mt-auto
        "
        >

          {/* PRICE */}

          <div
            className="
            border
            rounded-2xl
            p-2
            text-center 
          "
          >

            <div
              className="
              text-[10px]
              font-semibold
              uppercase
              text-gray-500
            "
              onDoubleClick={() => setPriceShow(show => !show)}
              onClick={() => setPriceShow(false)}>
              Price
            </div>

            <div
              className="
              text-xl
              font-black
            "
            >

              ₹
              {showPrice ? product.price || 0 : "-X-"}

            </div>

          </div>

          {/* QUANTITY */}

          <div
            className={`
            border
            rounded-2xl
            p-2
            text-center
            ${Number(product.quantity) <= Number(product.lowstock)
                ? "text-red-600 bg-red-100"
                : ""
              }
          `}
          >

            <div
              className="
              text-[10px]
              font-semibold
              uppercase
              text-gray-500
            "
            >
              Qty
            </div>

            <div
              className="
              w-full
              text-center
              text-xl
              font-black
            "
            >

              {
                product.quantity || 0
              }

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default memo(ProductCard)