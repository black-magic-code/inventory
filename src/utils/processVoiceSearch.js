import Fuse from "fuse.js"

import normalizeVoiceText from "@/lib/normalizeVoiceText"

export default function
processVoiceSearch(

  transcript,

  products = []

) {

  if (!transcript)
    return ""

  // NORMALIZE

  const normalized =

    normalizeVoiceText(
      transcript
    )

  // CREATE SEARCH DATASET

  const searchableProducts =

    products.map((product) => ({

      id: product._id,

      name: product.name || "",

      brand:
        product.brand || "",

      category:
        product.category || "",

      sku: product.sku || ""
    }))

  // FUZZY SEARCH

  const fuse = new Fuse(

    searchableProducts,

    {

      includeScore: true,

      threshold: 0.4,

      keys: [

        "name",

        "brand",

        "category",

        "sku"
      ]
    }
  )

  const results =
    fuse.search(normalized)

  // BEST MATCH

  if (
    results.length > 0 &&
    results[0].score < 0.45
  ) {

    return (
      results[0].item.name
    )
  }

  // FALLBACK

  return normalized
}