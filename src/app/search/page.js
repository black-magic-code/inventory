"use client"

import {
  useEffect,
  useState
} from "react"

import VoicePopup from "@/components/search/voicePopup"
import NavHeader from "@/components/layout/header"
import useVoiceSearch from "@/hooks/useVoiceSearch"

import {
  FaBoxOpen,
  FaSearch,
  FaMicrophone,
  FaStop,
  FaBan
} from "react-icons/fa"

import dynamic from "next/dynamic"

const ProductCard = dynamic(
  () =>
    import(
      "@/components/product/card"
    ),
  {
    ssr: false
  }
)

import {
  searchProducts
} from "@/services/search"

import useDebounce
  from "@/hooks/debounce"

export default function SearchPage() {
  const [query, setQuery] =
    useState("");

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(false)

  const [voiceText, setVoiceText] =
    useState("")

  const [voiceRetry, setVoiceRetry] =
    useState(false)
  const debouncedQuery = useDebounce(query, 500)

  const { isListening, micLevel, startListening, stopListening, error } = useVoiceSearch((text) => {

    setVoiceRetry(false)

    setVoiceText(text)

    setQuery(text ?? "result");
  })

  useEffect(() => {

    const runSearch = async () => {

      try {

        if (!debouncedQuery.trim()) {

          setProducts([])

          return
        }

        setLoading(true)

        const result =
          await searchProducts(
            debouncedQuery
          )

        setProducts(result)
        if (

          isListening &&

          debouncedQuery.trim()

        ) {

          if (result.length === 0) {

            setVoiceRetry(true)

            setTimeout(() => {

              setVoiceText("")

            }, 1500)
          } else {

            setVoiceRetry(false)

            stopListening()
          }
        }

      } catch (error) {

        console.log(error)

      } finally {

        setLoading(false)
      }
    }

    runSearch()

  }, [debouncedQuery])

  return (

    <div className="p-4 space-y-5">

      <NavHeader pageName="Search Products" />

      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="
        Search product,
        brand, category,
        SKU or notes
      "
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            className="border w-full h-11 pl-11 pr-4 rounded-2xl text-sm outline-none" />

        </div>
        <button className={`h-11 w-11 ${error && "border-red-400 text-red-400"} rounded-2xl flex items-center justify-center border transition ${isListening ? "bg-red-500 text-white border-red-500 animate-pulse" : ""}`}
          onClick={() => {
            if (error) return;
            if (isListening) {

              stopListening()

            } else {

              startListening()
            }
          }}>
          {
            isListening
              ? <FaStop />
              : error ? <FaBan /> : <FaMicrophone />
          }

        </button>

      </div>

      {
        loading && (
          <p>Searching...</p>
        )
      }

      {
        !loading &&
        query &&
        products.length === 0 && (

          <div className="flex flex-col items-center justify-center py-20 text-gray-500">

            <FaBoxOpen size={70} />

            <h2 className="text-2xl font-semibold mt-4">
              Product Not Found
            </h2>

          </div>
        )
      }

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        {products.map((product) => (

          <ProductCard
            key={product._id}
            product={product}
          />

        ))}

      </div>

      <VoicePopup

        isListening={isListening}
        transcript={voiceText}
        micLevel={micLevel}
        onClose={stopListening}
        retry={voiceRetry}
      />
    </div>
  )
}