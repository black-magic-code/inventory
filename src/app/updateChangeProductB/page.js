"use client"

import {
    useEffect,
    useMemo,
    useState
} from "react"

import Link from "next/link"


import {
    getProducts, subscribeProducts
} from "@/services/product"

import NavHeader from "@/components/layout/header"

import dynamic from "next/dynamic"
const ProductCard = dynamic(

    () =>
        import(
            "@/components/product/cardUpdate"
        ),

    {
        ssr: false
    }
)
import { startSync } from "@/database/sync"

import {
    FaSearch,
    FaPlus,
    FaSlidersH,
    FaBoxOpen,
    FaSortAmountDown,
    FaTimes,
    FaLongArrowAltDown,
    FaLongArrowAltUp,
} from "react-icons/fa";



export default function HomePage() {

    const [products, setProducts] =
        useState([])

    const [loading, setLoading] =
        useState(true)

    const [showFilters, setShowFilters] =
        useState(false)

    const [showSort, setShowSort] =
        useState(false)

    const [textFilter, setTextFilter] =
        useState("")

    const [minPrice, setMinPrice] =
        useState("")

    const [maxPrice, setMaxPrice] =
        useState("")

    const [dateFilter, setDateFilter] =
        useState("")

    const [lowStock, setLowStock] =
        useState(false)

    const [sortType, setSortType] =
        useState("newest")

    const [refreshKey, setRefreshKey] =
        useState(0)

    const [visibleProducts, setVisibleProducts] =
        useState(20)

    const hasActiveFilters = Boolean(

        textFilter ||
        minPrice ||
        maxPrice ||
        dateFilter ||
        lowStock ||
        sortType !== "newest"

    )

    const loadProducts = async (
        showLoader = false
    ) => {

        try {

            if (showLoader) {

                setLoading(true)
            }

            const data =
                await getProducts()

            setProducts(data)

        } catch (error) {

            console.log(error)

        } finally {

            if (showLoader) {

                setLoading(false)
            }
        }
    }

    useEffect(() => {

        let subscription = null

        const initialize = async () => {

            // LOAD FAST FIRST

            await loadProducts(true)

            // START SYNC LATER

            setTimeout(async () => {

                await startSync()

                subscription =
                    await subscribeProducts(() => {

                        setRefreshKey(
                            prev => prev + 1
                        )
                    })

            }, 1500)
        }

        initialize()

        return () => {

            if (
                subscription &&
                subscription.cancel
            ) {

                subscription.cancel()
            }
        }

    }, [])

    useEffect(() => {

        loadProducts(false)

    }, [refreshKey])

    const filteredProducts = useMemo(() => {

        let result = [...products]


        if (textFilter.trim()) {

            const search =
                textFilter.toLowerCase().trim()

            result = result
                .map((product) => {

                    const name =
                        product.name
                            ?.toLowerCase() || ""

                    const note =
                        product.note
                            ?.toLowerCase() || ""

                    const brand =
                        product.brand
                            ?.toLowerCase() || ""

                    const category =
                        product.category
                            ?.toLowerCase() || ""

                    const sku =
                        product.sku
                            ?.toLowerCase() || ""

                    let score = 0

                    // EXACT MATCHES

                    if (name === search) {
                        score += 1000
                    }

                    if (sku === search) {
                        score += 950
                    }

                    if (brand === search) {
                        score += 900
                    }

                    if (category === search) {
                        score += 850
                    }

                    // STARTS WITH

                    if (
                        name.startsWith(search)
                    ) {
                        score += 500
                    }

                    if (
                        sku.startsWith(search)
                    ) {
                        score += 450
                    }

                    if (
                        brand.startsWith(search)
                    ) {
                        score += 400
                    }

                    if (
                        category.startsWith(search)
                    ) {
                        score += 350
                    }

                    // INCLUDES

                    if (
                        name.includes(search)
                    ) {
                        score += 250
                    }

                    if (
                        sku.includes(search)
                    ) {
                        score += 220
                    }

                    if (
                        brand.includes(search)
                    ) {
                        score += 180
                    }

                    if (
                        category.includes(search)
                    ) {
                        score += 160
                    }

                    // NOTE/META SEARCH

                    if (
                        note.includes(search)
                    ) {
                        score += 80
                    }

                    // MULTI WORD SEARCH

                    const words =
                        search.split(" ")

                    words.forEach((word) => {

                        if (
                            name.includes(word)
                        ) {
                            score += 40
                        }

                        if (
                            sku.includes(word)
                        ) {
                            score += 35
                        }

                        if (
                            brand.includes(word)
                        ) {
                            score += 30
                        }

                        if (
                            category.includes(word)
                        ) {
                            score += 25
                        }

                        if (
                            note.includes(word)
                        ) {
                            score += 15
                        }

                    })

                    return {
                        ...product,
                        score
                    }

                })

                .filter((product) =>
                    product.score > 0
                )

            // SMART PRIORITY SORT

            result.sort((a, b) => {

                // HIGHER SCORE FIRST

                if (b.score !== a.score) {

                    return b.score - a.score
                }

                // SAME SCORE → NEWEST FIRST

                return (
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
                )
            })
        }

        result = result.filter((product) => {

            const price =
                Number(product.price)

            const min =
                minPrice
                    ? price >= Number(minPrice)
                    : true

            const max =
                maxPrice
                    ? price <= Number(maxPrice)
                    : true

            return min && max
        })

        if (dateFilter.trim()) {

            const dateSearch =
                dateFilter.toLowerCase()

            result = result.filter((product) => {

                const createdDate =
                    new Date(
                        product.createdAt
                    )

                const fullDate =
                    createdDate
                        .toDateString()
                        .toLowerCase()

                return fullDate.includes(
                    dateSearch
                )
            })
        }

        if (lowStock) {
            return result = result.filter((product) => {
                return product.quantity <= product.lowstock
            })

        }

        // SORTING

        switch (sortType) {

            case "az":

                result.sort((a, b) =>
                    a.name.localeCompare(b.name)
                )

                break

            case "za":

                result.sort((a, b) =>
                    b.name.localeCompare(a.name)
                )

                break

            case "low-high":

                result.sort((a, b) =>
                    Number(a.price) -
                    Number(b.price)
                )

                break

            case "high-low":

                result.sort((a, b) =>
                    Number(b.price) -
                    Number(a.price)
                )

                break

            case "oldest":

                result.sort((a, b) =>
                    new Date(a.createdAt) -
                    new Date(b.createdAt)
                )

                break

            default:

                result.sort((a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
                )
        }
        return result

    }, [
        products,
        textFilter,
        minPrice,
        maxPrice,
        dateFilter,
        lowStock,
        sortType
    ])

    const clearFilters = () => {

        setTextFilter("")

        setMinPrice("")

        setMaxPrice("")

        setLowStock(false)

        setDateFilter("")

        setSortType("newest")
    }

    return (

        <div className="min-h-screen p-4 space-y-4 text background">

            {/* HEADER */}

            <div className="sticky top-0 z-50 pb-3 space-y-3 text background">

                {/* TOP BAR */}

                <NavHeader pageName="Edit Products" />

                {/* TOOLBAR */}

                <div className="
  flex
  items-center
  gap-2
">

                    {/* FILTER */}

                    <button
                        onClick={() =>
                            setShowFilters(
                                !showFilters
                            )
                        }
                        className={`
      h-11
      px-4
      rounded-2xl
      border
      flex
      items-center
      gap-2
      text-sm
      font-medium
      transition
      ${showFilters
                                ? "bg-black text-white"
                                : ""
                            }
    `}
                    >

                        <FaSlidersH />

                        <span className="hidden sm:block">
                            Filters
                        </span>

                    </button>

                    {/* SORT */}

                    <button
                        onClick={() =>
                            setShowSort(
                                !showSort
                            )
                        }
                        className={`
      h-11
      px-4
      rounded-2xl
      border
      flex
      items-center
      gap-2
      text-sm
      font-medium
      transition
      ${showSort
                                ? "bg-black text-white"
                                : ""
                            }
    `}
                    >

                        <FaSortAmountDown />

                        <span className="hidden sm:block">
                            Sort
                        </span>

                    </button>

                    {/* CLEAR / TOGGLE */}

                    <button

                        onClick={() => {

                            // ACTIVE FILTERS/SORTS

                            if (hasActiveFilters) {

                                clearFilters()

                                return
                            }

                            // ANY PANEL OPEN

                            if (
                                showFilters ||
                                showSort
                            ) {

                                setShowFilters(false)

                                setShowSort(false)

                                return
                            }

                            // BOTH CLOSED

                            setShowFilters(true)

                            setShowSort(true)

                        }}

                        className="
    ml-auto
    h-11
    w-11
    rounded-2xl
    border
    flex
    items-center
    justify-center
    text-lg
    transition
    shrink-0
  "
                    >

                        {

                            // CASE 3
                            // Any filter/sort active

                            hasActiveFilters ? (

                                <FaTimes />

                            ) :

                                // CASE 2
                                // Panels open

                                (
                                    showFilters ||
                                    showSort
                                ) ? (

                                    <FaLongArrowAltUp />

                                ) :

                                    // CASE 1
                                    // Panels closed

                                    (

                                        <FaLongArrowAltDown />

                                    )
                        }

                    </button>

                </div>

                {/* FILTER PANEL */}

                {
                    showFilters && (

                        <div className="
              border
              rounded-2xl
              p-2.5
              space-y-2
              shadow-sm
            ">

                            <input
                                type="text"
                                placeholder="
                  Filter by product or SKU
                "
                                value={textFilter}
                                onChange={(e) =>
                                    setTextFilter(
                                        e.target.value
                                    )
                                }
                                className="
                  border
                  rounded-xl
                  px-3
                  h-10
                  text-sm
                  outline-none
                "
                            />

                            <div className="
                grid
                grid-cols-2
                gap-3
              ">

                                <input
                                    type="number"
                                    placeholder="Start Price"
                                    value={minPrice}
                                    onChange={(e) =>
                                        setMinPrice(
                                            e.target.value
                                        )
                                    }
                                    className="
                    border
                    rounded-xl
                    px-3
                    h-10
                    text-sm
                    outline-none
                  "
                                />

                                <input
                                    type="number"
                                    placeholder="End Price"
                                    value={maxPrice}
                                    onChange={(e) =>
                                        setMaxPrice(
                                            e.target.value
                                        )
                                    }
                                    className="
                    border
                    rounded-xl
                    px-3
                    h-10
                    text-sm
                    outline-none
                  "
                                />

                            </div>

                            <input
                                type="text"
                                placeholder="
                  Search by date,
                  month or year
                "
                                value={dateFilter}
                                onChange={(e) =>
                                    setDateFilter(
                                        e.target.value
                                    )
                                }
                                className="
                  border
                  rounded-xl
                  px-3
                  h-10
                  text-sm
                  outline-none
                "
                            />
                            <button
                                onClick={() =>
                                    setLowStock(
                                        prev => !prev
                                    )
                                }

                                className={`
    w-full
    border
    rounded-xl
    px-3
    h-10
    text-sm
    font-medium
    transition
    ${lowStock
                                        ? "bg-red-500 text-white border-red-500"
                                        : ""
                                    }
  `}
                            >

                                Low Stock

                            </button>

                        </div>
                    )
                }

                {/* SORT PANEL */}

                {
                    showSort && (

                        <div className="
              border
              rounded-2xl
              p-2.5
              grid
              grid-cols-2
              gap-2
              shadow-sm
            ">

                            {
                                [
                                    {
                                        label: "A-Z",
                                        value: "az"
                                    },

                                    {
                                        label: "Z-A",
                                        value: "za"
                                    },

                                    {
                                        label: "Low-High",
                                        value: "low-high"
                                    },

                                    {
                                        label: "High-Low",
                                        value: "high-low"
                                    },

                                    {
                                        label: "Newest",
                                        value: "newest"
                                    },

                                    {
                                        label: "Oldest",
                                        value: "oldest"
                                    }

                                ].map((item) => (

                                    <button
                                        key={item.value}
                                        onClick={() =>
                                            setSortType(
                                                item.value
                                            )
                                        }
                                        className={`
                      h-10
                      rounded-xl
                      text-sm
                      border
                      transition
                      ${sortType ===
                                                item.value
                                                ? "bg-black text-white"
                                                : ""
                                            }
                    `}
                                    >

                                        {item.label}

                                    </button>

                                ))
                            }

                        </div>
                    )
                }

            </div>

            {/* PRODUCTS */}

            {
                loading ? (

                    <div
                        className="
    grid
    grid-cols-1
    sm:grid-cols-2
    md:grid-cols-3
    lg:grid-cols-4
    xl:grid-cols-5
    gap-4
  "
                    >

                        {
                            Array.from({ length: 5 })
                                .map((_, index) => (

                                    <div
                                        key={index}
                                        className="
            animate-pulse
            border
            rounded-3xl
            overflow-hidden
            background
          "
                                    >

                                        {/* IMAGE */}

                                        <div
                                            className="
              aspect-square
              bg-gray-300
              dark:bg-gray-800
            "
                                        />

                                        {/* CONTENT */}

                                        <div
                                            className="
              p-4
              space-y-4
            "
                                        >

                                            <div
                                                className="
                h-3
                rounded-full
                w-2/3
                bg-gray-300
                dark:bg-gray-700
              "
                                            />

                                            <div
                                                className="
                h-6
                rounded-full
                w-full
                bg-gray-300
                dark:bg-gray-700
              "
                                            />

                                            <div
                                                className="
                h-4
                rounded-full
                w-3/4
                bg-gray-300
                dark:bg-gray-700
              "
                                            />

                                            <div
                                                className="
                h-16
                rounded-2xl
                bg-gray-300
                dark:bg-gray-700
              "
                                            />

                                            <div
                                                className="
                grid
                grid-cols-2
                gap-3
              "
                                            >

                                                <div
                                                    className="
                  h-14
                  rounded-2xl
                  bg-gray-300
                  dark:bg-gray-700
                "
                                                />

                                                <div
                                                    className="
                  h-14
                  rounded-2xl
                  bg-gray-300
                  dark:bg-gray-700
                "
                                                />

                                            </div>

                                            <div
                                                className="
                h-12
                rounded-2xl
                bg-gray-300
                dark:bg-gray-700
              "
                                            />

                                        </div>

                                    </div>

                                ))
                        }

                    </div>

                ) : (

                    <div className="
            grid
            grid-cols-1
            xsm:grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
            gap-4
          ">
                        {filteredProducts.length === 0 && !loading && (
                            <div className=" flex flex-col items-center justify-center py-20 text-gray-500 "> <FaBoxOpen size={70} /> <h2 className=" text-2xl font-semibold mt-4 "> Product Not Found </h2> </div>
                        )}


                        {filteredProducts
                            .slice(0, visibleProducts)
                            .map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    refreshProducts={loadProducts}
                                />
                            ))}

                        {
                            filteredProducts.length >
                            visibleProducts && (

                                <button

                                    onClick={() =>
                                        setVisibleProducts(
                                            prev => prev + 20
                                        )
                                    }

                                    className="
        w-full
        h-12
        rounded-2xl
        border
        mt-6
      "
                                >

                                    Load More

                                </button>
                            )
                        }

                    </div>
                )
            }

        </div>
    )
}
