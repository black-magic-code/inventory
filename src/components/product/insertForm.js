"use client"

import {
  useState,
  useEffect,
  useRef
} from "react"

import {
  FaImage,
  FaCamera,
  FaTimes,
  FaBan
} from "react-icons/fa"

import {
  addProduct
} from "@/services/product"

import {
  PopAlert
} from "../layout/popAlert"

export default function ProductForm() {

  const videoRef = useRef(null)

  const canvasRef = useRef(null)

  const streamRef = useRef(null)

  const [success, setSuccess] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  const [preview, setPreview] =
    useState(null)

  const [showCamera, setShowCamera] =
    useState(false)

  const [cameraPermission, setCameraPermission] =
    useState("prompt")

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
      lowstock: ""
    })

  useEffect(() => {

    let permissionStatus = null

    const checkCameraPermission =
      async () => {

        try {

          if (
            !navigator.permissions
          ) {
            return
          }

          permissionStatus =
            await navigator.permissions.query({
              name: "camera"
            })

          setCameraPermission(
            permissionStatus.state
          )

          permissionStatus.onchange =
            () => {

              setCameraPermission(
                permissionStatus.state
              )

            }

        } catch (error) {

          console.log(error)

        }

      }

    checkCameraPermission()

    return () => {

      stopCamera()

      if (permissionStatus) {

        permissionStatus.onchange =
          null

      }

    }

  }, [])

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    })

  }

  const compressImage = (
    file,
    quality = 0.6,
    maxWidth = 1280
  ) => {

    return new Promise((resolve) => {

      const reader =
        new FileReader()

      reader.readAsDataURL(file)

      reader.onload = (event) => {

        const img =
          new Image()

        img.src =
          event.target.result

        img.onload = () => {

          const canvas =
            document.createElement(
              "canvas"
            )

          let width =
            img.width

          let height =
            img.height

          if (
            width > maxWidth
          ) {

            height *=
              maxWidth / width

            width =
              maxWidth

          }

          canvas.width = width
          canvas.height = height

          const ctx =
            canvas.getContext("2d")

          ctx.drawImage(
            img,
            0,
            0,
            width,
            height
          )

          let compressed =
            canvas.toDataURL(
              "image/jpeg",
              quality
            )

          resolve(compressed)

        }

      }

    })

  }

  const handleImage = async (e) => {

    const file =
      e.target.files[0]

    if (!file) return

    if (
      !file.type.startsWith("image/")
    ) {

      alert(
        "Only images allowed"
      )

      return

    }

    const compressed =
      await compressImage(file)

    setPreview(compressed)

    setForm((prev) => ({
      ...prev,
      image: compressed
    }))

  }

  const startCamera =
    async () => {

      if (
        cameraPermission ===
        "denied"
      ) {

        alert(
          "Camera permission denied. Enable it from browser settings."
        )

        return

      }

      try {

        const stream =
          await navigator
            .mediaDevices
            .getUserMedia({

              video: {
                facingMode:
                  "environment"
              },

              audio: false

            })

        streamRef.current =
          stream

        setShowCamera(true)

        setCameraPermission(
          "granted"
        )

        setTimeout(() => {

          if (
            videoRef.current
          ) {

            videoRef.current.srcObject =
              stream

          }

        }, 100)

      } catch (error) {

        console.log(error)

        setCameraPermission(
          "denied"
        )

      }

    }

  const stopCamera = () => {

    if (
      streamRef.current
    ) {

      streamRef.current
        .getTracks()
        .forEach((track) =>
          track.stop()
        )

    }

    setShowCamera(false)

  }

  const captureImage =
    async () => {

      const video =
        videoRef.current

      const canvas =
        canvasRef.current

      if (
        !video ||
        !canvas
      ) {
        return
      }

      const ctx =
        canvas.getContext("2d")

      canvas.width =
        video.videoWidth

      canvas.height =
        video.videoHeight

      ctx.drawImage(
        video,
        0,
        0
      )

      const base64 =
        canvas.toDataURL(
          "image/jpeg",
          0.6
        )

      setPreview(base64)

      setForm((prev) => ({
        ...prev,
        image: base64
      }))

      stopCamera()

    }

  const handleSubmit =
    async (e) => {

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
          lowstock: ""
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

    <div
      className="
      max-w-3xl
      mx-auto
      min-h-screen
      p-4
      space-y-6
    "
    >

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

        {/* IMAGE */}

        <div
          className="
          flex
          flex-col
          items-center
          justify-center
          border-2
          border-dashed
          rounded-2xl
          p-6
          gap-4
        "
        >

          {
            preview ? (

              <img
                src={preview}
                alt="preview"
                className="
                w-40
                h-40
                object-cover
                rounded-2xl
              "
              />

            ) : (

              <div
                className="
                flex
                flex-col
                items-center
                gap-2
                text-gray-400
              "
              >

                <FaImage size={60} />

                <div>
                  Product Image
                </div>

              </div>

            )
          }

          <div
            className="
            flex
            flex-wrap
            justify-center
            gap-3
          "
          >

            {/* FILE */}

            <label
              className="
              px-4
              py-3
              rounded-2xl
              bg-black
              text-white
              cursor-pointer
              flex
              items-center
              gap-2
            "
            >

              <FaImage />

              Upload Image

              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                hidden
              />

            </label>

            {/* CAMERA */}

            <button
              type="button"
              disabled={
                cameraPermission ===
                "denied"
              }
              onClick={
                startCamera
              }
              className={`
              px-4
              py-3
              rounded-2xl
              border
              flex
              items-center
              gap-2

              ${
                cameraPermission ===
                "denied"

                  ? `
                    opacity-50
                    cursor-not-allowed
                    border-red-500
                    text-red-500
                  `

                  : ""
              }
            `}
            >

              {
                cameraPermission ===
                "denied"

                  ? <FaBan />

                  : <FaCamera />
              }

              Camera

            </button>

          </div>

        </div>

        {/* CAMERA MODAL */}

        {
          showCamera && (

            <div
              className="
              fixed
              inset-0
              z-50
              bg-black/80
              backdrop-blur-sm
              flex
              items-center
              justify-center
              p-4
            "
            >

              <div
                className="
                bg-black
                border
                rounded-3xl
                overflow-hidden
                w-full
                max-w-md
              "
              >

                <div
                  className="
                  flex
                  items-center
                  justify-between
                  p-4
                  border-b
                "
                >

                  <h2
                    className="
                    text-white
                    font-bold
                  "
                  >

                    Capture Product

                  </h2>

                  <button
                    type="button"
                    onClick={
                      stopCamera
                    }
                    className="
                    text-white
                  "
                  >

                    <FaTimes />

                  </button>

                </div>

                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="
                  w-full
                  aspect-video
                  object-cover
                "
                />

                <div
                  className="
                  p-4
                "
                >

                  <button
                    type="button"
                    onClick={
                      captureImage
                    }
                    className="
                    w-full
                    bg-white
                    text-black
                    py-4
                    rounded-2xl
                    font-bold
                  "
                  >

                    Capture Image

                  </button>

                </div>

              </div>

            </div>

          )
        }

        <canvas
          ref={canvasRef}
          hidden
        />

        {/* FORM */}

        <div
          className="
          grid
          md:grid-cols-2
          gap-4
        "
        >

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

            <PopAlert
              message="
              Product Added Successfully
            "
              type="success"
            />

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
