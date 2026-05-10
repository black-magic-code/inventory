"use client"

import {
  deleteProduct,
  updateQuantity,
  updateName,
  updatePrice,
  updateBrand,
  updateCategory,
  updateCost,
  updateNote,
  updateSKU,
  updateImage,
  updateLowStock
} from "@/services/product"

import {
  FaBoxOpen,
  FaTimes,
  FaPen,
  FaTrash
} from "react-icons/fa"

import {
  useState,
  memo
} from "react"

function ProductCard({
  product,
  refreshProducts
}) {

  const [showCost, setcostShow] =
    useState(false)

  const [showChangeMenu, setShowChangeMenu] =
    useState(false)

  const [showModal, setShowModal] =
    useState(false)

  const [modalType, setModalType] =
    useState("edit")

  const [selectedField, setSelectedField] =
    useState("name")

  const [imagePreview, setImagePreview] =
    useState("")

  const [newValue, setNewValue] =
    useState("")

  const editableFields = [

    "name",

    "note",

    "brand",

    "category",

    "price",

    "qty",

    "cost",

    "sku",

    "image",

    "lowstock"

  ]

  const updateHandlers = {

    name: updateName,

    note: updateNote,

    brand: updateBrand,

    category: updateCategory,

    price: updatePrice,

    qty: updateQuantity,

    cost: updateCost,

    sku: updateSKU,

    image: updateImage,

    lowstock: updateLowStock

  }

  const handleDelete = async () => {

    await deleteProduct(product._id)

    setShowModal(false)

    refreshProducts?.()
  }

  const handleQuantity = async (e) => {

    const newQuantity =
      Number(e.target.value)

    if (
      newQuantity === product.quantity
    ) {
      return
    }

    await updateQuantity(
      product._id,
      newQuantity
    )

    refreshProducts?.()
  }

  const openEditModal = (field) => {

    setSelectedField(field)

    const fieldValue =

      field === "qty"

        ? product.quantity

        : field === "lowstock"

          ? product.lowstock

          : product[field]

    setNewValue(fieldValue || "")

    if (field === "image") {

      setImagePreview(
        product.image || ""
      )

    }

    setModalType("edit")

    setShowModal(true)

    setShowChangeMenu(false)
  }

  const openDeleteModal = () => {

    setModalType("delete")

    setShowModal(true)

    setShowChangeMenu(false)
  }

  const handleSave = async () => {

    try {

      const updater =
        updateHandlers[selectedField]

      if (!updater) {
        return
      }

      let formattedValue = newValue

      if (

        selectedField === "price" ||

        selectedField === "qty" ||

        selectedField === "cost" ||

        selectedField === "lowstock"

      ) {

        formattedValue =
          Number(newValue)

      }

      await updater(

        product._id,

        formattedValue

      )

      setShowModal(false)

      refreshProducts?.()

    } catch (error) {

      console.log(error)

    }

  }

  const handleImageChange = (e) => {

    const file =
      e.target.files?.[0]

    if (!file) {
      return
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      alert("Only images allowed")

      return
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {

      alert(
        "Image exceeds 5MB"
      )

      return
    }

    const reader =
      new FileReader()

    reader.onloadend = () => {

      const base64 =
        reader.result

      setImagePreview(base64)

      setNewValue(base64)

    }

    reader.readAsDataURL(file)

  }

  return (

    <>
      <div
        className={`
        ${Number(product.quantity) <= Number(product.lowstock) ?
            "bg-red-200" : "bg-white"}
        text-black
        border
        rounded-3xl
        overflow-hidden
        shadow-sm
        flex
        flex-col
        h-full
        relative
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
                No Image
                <FaBoxOpen />
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
              onClick={() =>
                setcostShow((cost) => !cost)
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
              >
                Price
              </div>

              <div
                className="
                text-xl
                font-black
              "
              >

                ₹
                {
                  product.price || 0
                }

              </div>

            </div>

            {/* QUANTITY */}

            <div
              className={`
              border
              rounded-2xl
              p-2
              text-center
              ${Number(product.quantity) <= Number(product.lowstock) &&
                "text-red-600 bg-red-200"}
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

              <input
                type="text"
                defaultValue={
                  product.quantity
                }
                onBlur={handleQuantity}
                className="
                w-full
                text-center
                text-xl
                font-black
                outline-none
                bg-transparent
              "
              />

            </div>

          </div>

          {/* CHANGE BUTTON */}

          <div className="relative">

            <button
              onClick={() =>
                setShowChangeMenu(
                  (prev) => !prev
                )
              }
              className="
              mt-2
              bg-black
              text-white
              rounded-2xl
              py-2
              font-semibold
              active:scale-95
              transition
              w-full
            "
            >

              Change

            </button>

            {/* CHANGE POPUP */}

            <div
              className={`
              absolute
              bottom-14
              left-0
              w-full
              rounded-3xl
              border
              border-white/30
              bg-white/20
              backdrop-blur-xl
              shadow-2xl
              overflow-hidden
              transition-all
              duration-300
              z-30
              ${showChangeMenu
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 translate-y-4 pointer-events-none"
                }
            `}
            >

              {
                editableFields.map((field) => (

                  <button
                    key={field}
                    onClick={() =>
                      openEditModal(field)
                    }
                    className="
                    w-full
                    px-4
                    py-3
                    text-left
                    text-sm
                    font-medium
                    text-black
                    border-b
                    border-white/20
                    hover:bg-white/20
                    transition
                    flex
                    items-center
                    gap-2
                  "
                  >

                    <FaPen />

                    {
                      field
                    }

                  </button>

                ))
              }

              <button
                onClick={
                  openDeleteModal
                }
                className="
                w-full
                px-4
                py-3
                text-left
                text-sm
                font-medium
                text-red-600
                hover:bg-red-100/40
                transition
                flex
                items-center
                gap-2
              "
              >

                <FaTrash />

                delete

              </button>

            </div>

          </div>

        </div>

      </div>

      {/* MODAL */}

      {
        showModal && (

          <div
            className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            backdrop-blur-sm
            p-4
          "
          >

            <div
              className="
              w-full
              max-w-md
              rounded-3xl
              border
              border-white/30
              bg-white/20
              backdrop-blur-2xl
              shadow-2xl
              overflow-hidden
              text-white
              animate-[fadeIn_.2s_ease]
            "
            >

              {/* HEADER */}

              <div
                className="
                flex
                items-center
                justify-between
                px-5
                py-4
                border-b
                border-white/20
              "
              >

                <div>

                  <div
                    className="
                    text-lg
                    font-bold
                    text-black
                  "
                  >

                    {
                      modalType === "delete"
                        ? "Delete Product"
                        : "Edit Product"
                    }

                  </div>

                  <div
                    className="
                    text-xs
                    text-black/60
                  "
                  >

                    Product ID :
                    {" "}
                    {
                      product._id
                    }

                  </div>

                </div>

                <button
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="
                  text-black
                  text-lg
                "
                >

                  <FaTimes />

                </button>

              </div>

              {/* BODY */}

              <div
                className="
                p-5
                flex
                flex-col
                gap-4
              "
              >

                {
                  modalType === "delete"
                    ? (
                      <>
                        <div
                          className="
                          text-black
                          font-medium
                        "
                        >
                          Are you sure you want to delete this product ?
                        </div>

                        <button
                          onClick={
                            handleDelete
                          }
                          className="
                          bg-red-500
                          text-white
                          rounded-2xl
                          py-3
                          font-semibold
                          active:scale-95
                          transition
                        "
                        >

                          Confirm Delete

                        </button>
                      </>
                    )
                    : (
                      <>
                        {/* FIELD */}

                        <div>

                          <div
                            className="
                            text-xs
                            uppercase
                            font-semibold
                            text-black/60
                            mb-1
                          "
                          >
                            Field Name
                          </div>

                          <input
                            value={
                              selectedField
                            }
                            disabled
                            className="
                            w-full
                            rounded-2xl
                            border
                            border-white/30
                            bg-white/30
                            backdrop-blur-md
                            px-4
                            py-3
                            outline-none
                            text-black
                          "
                          />

                        </div>

                        {/* CURRENT VALUE */}

                        <div>

                          <div
                            className="
                            text-xs
                            uppercase
                            font-semibold
                            text-black/60
                            mb-1
                          "
                          >
                            Current Value
                          </div>

                          <input
                            value={
                              selectedField === "qty"
                                ? product.quantity
                                : selectedField === "lowstock"
                                  ? product.lowstock
                                  : product[selectedField] || ""
                            }
                            disabled
                            className="
                            w-full
                            rounded-2xl
                            border
                            border-white/30
                            bg-white/30
                            backdrop-blur-md
                            px-4
                            py-3
                            outline-none
                            text-black
                          "
                          />

                        </div>
                        {
                          selectedField === "image" && (

                            <div className="
      flex
      flex-col
      gap-3
    "
                            >

                              <img
                                src={
                                  imagePreview ||
                                  product.image
                                }
                                alt="preview"
                                className="
        w-full
        h-52
        object-cover
        rounded-2xl
        border
        border-white/20
      "
                              />

                              <label
                                className="
        bg-black
        text-white
        rounded-2xl
        py-3
        text-center
        font-semibold
        cursor-pointer
        active:scale-95
        transition
      "
                              >

                                Change Image

                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={
                                    handleImageChange
                                  }
                                  className="hidden"
                                />

                              </label>

                            </div>

                          )
                        }

                        {/* NEW VALUE */}

                        {selectedField !== "image" && (
                          <div>

                            <div
                              className="
                            text-xs
                            uppercase
                            font-semibold
                            text-black/60
                            mb-1
                          "
                            >
                              New Value
                            </div>

                            <input
                              value={newValue}
                              onChange={(e) =>
                                setNewValue(
                                  e.target.value
                                )
                              }
                              className="
                            w-full
                            rounded-2xl
                            border
                            border-white/30
                            bg-white/30
                            backdrop-blur-md
                            px-4
                            py-3
                            outline-none
                            text-black
                          "
                            />

                          </div>
                        )}

                        {/* PRODUCT ID */}

                        <div>

                          <div
                            className="
                            text-xs
                            uppercase
                            font-semibold
                            text-black/60
                            mb-1
                          "
                          >
                            Product ID
                          </div>

                          <input
                            value={
                              product._id
                            }
                            disabled
                            className="
                            w-full
                            rounded-2xl
                            border
                            border-white/30
                            bg-white/30
                            backdrop-blur-md
                            px-4
                            py-3
                            outline-none
                            text-black
                          "
                          />

                        </div>

                        {/* SAVE */}

                        <button
                          onClick={
                            handleSave
                          }
                          className="
                          bg-black
                          text-white
                          rounded-2xl
                          py-3
                          font-semibold
                          active:scale-95
                          transition
                        "
                        >

                          Save Changes

                        </button>
                      </>
                    )
                }

              </div>

            </div>

          </div>

        )
      }
    </>
  )
}

export default memo(ProductCard)