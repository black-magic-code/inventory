"use client"

import {
  useState
} from "react";
import { PopAlert } from "../layout/popAlert";

import {
  FaImage
} from "react-icons/fa"

import {
  addProduct
} from "@/services/product"

export default function ProductForm() {

  const [success, setSuccess] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  const [preview, setPreview] =
    useState(null)

  const [form, setForm] =
    useState({
      name: "",
      sku: "",
      category: "",
      brand: "",
      price: "",
      cost: "",
      quantity: "",
      note: "",
      image: "",
      lowstock:""
    })

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value
    })
  }

  const handleImage = (e) => {

    const file =
      e.target.files[0]

    if (!file) return

    if (
      !file.type.startsWith("image/")
    ) {
      alert("Only images allowed")
      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {

      const base64 =
        reader.result

      setPreview(base64)

      setForm((prev) => ({
        ...prev,
        image: base64
      }))
    }

    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      setLoading(true)
      await addProduct(form)
      setSuccess(true)
      setForm({
        name: "",
        sku: "",
        category: "",
        brand: "",
        price: "",
        cost: "",
        quantity: "",
        note: "",
        image: "",
        lowstock:""
      })

      setPreview(null)

      setTimeout(() => {

        setSuccess(false)

      }, 3000)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }

  return (

    <div className="
      max-w-3xl
      mx-auto
      min-h-screen
  p-4
  space-y-6
    ">

      <form
        onSubmit={handleSubmit}
        className="
  rounded-3xl
  shadow-lg
  border
  p-5
  space-y-5
"
      >

        <div className="
          flex
          flex-col
          items-center
          justify-center
          border-2
          border-dashed
          rounded-2xl
          p-6
        ">

          <label
            className="
    mt-4
    px-4
    py-2
    bg-black
    text-white
    rounded-xl
    cursor-pointer
    flex
    flex-col
    items-center
  "
          >
            {
              preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="
                  w-32
                  h-32
                  object-cover
                  rounded-xl
                "
                />
              ) : (
                <div>
                  <FaImage
                    size={50}
                    className="text-gray-400"
                  />
                  Choose Product Image
                </div>
              )
            }


            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              hidden
            />

          </label>

        </div>

        <div className="
          grid
          md:grid-cols-2
          gap-4
        ">

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="
              border
              p-3
              rounded-xl
              bg-white
text-black
outline-none
            "
          />

          <input
            type="text"
            name="sku"
            placeholder="SKU / Barcode"
            value={form.sku}
            onChange={handleChange}
            className="
              border
              p-3
              rounded-xl
              bg-white
text-black
outline-none
            "
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="
              border
              p-3
              rounded-xl
              bg-white
text-black
outline-none
            "
          />

          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={form.brand}
            onChange={handleChange}
            className="
              border
              p-3
              rounded-xl
              bg-white
text-black
outline-none
            "
          />

          <input
            type="number"
            name="price"
            placeholder="Selling Price"
            value={form.price}
            onChange={handleChange}
            className="
              border
              p-3
              rounded-xl
              bg-white
text-black
outline-none
            "
          />

          <input
            type="number"
            name="cost"
            placeholder="Cost Price"
            value={form.cost}
            onChange={handleChange}
            className="
              border
              p-3
              rounded-xl
              bg-white
text-black
outline-none
            "
          />

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            className="
              border
              p-3
              rounded-xl
              bg-white
text-black
outline-none
            "
          />
          <input
            type="number"
            name="lowstock"
            placeholder="Low Stock Alert"
            value={form.lowstock}
            onChange={handleChange}
            className="
              border
              p-3
              rounded-xl
              bg-white
text-black
outline-none
            "
          />

        </div>

        <textarea
          name="note"
          placeholder="
            Notes, missing info,
            unknown product details,
            supplier info etc.
          "
          value={form.note}
          onChange={handleChange}
          rows={5}
          className="
            border
            p-3
            rounded-xl
            w-full
            bg-white
text-black
outline-none
          "
        />
        {
          success && (
            <PopAlert message="Product Added Successfully" type="success" />
          )
        }
        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            bg-black
            text-white
            py-4
            rounded-2xl
            font-semibold
          "
        >

          {
            loading
              ? "Adding Product..."
              : "Add Product"
          }

        </button>

      </form>

    </div>
  )
}