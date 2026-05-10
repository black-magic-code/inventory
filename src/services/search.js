"use client"

import {
  getProducts
} from "./product"

export const searchProducts =
  async (query) => {

    const products =
      await getProducts()

    const search =
      query.toLowerCase().trim()

    let result =
      products.map((product) => {

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

        // EXACT

        if (name === search)
          score += 1000

        if (sku === search)
          score += 950

        if (brand === search)
          score += 900

        if (category === search)
          score += 850

        // STARTS WITH

        if (name.startsWith(search))
          score += 500

        if (sku.startsWith(search))
          score += 450

        if (brand.startsWith(search))
          score += 400

        if (category.startsWith(search))
          score += 350

        // INCLUDES

        if (name.includes(search))
          score += 250

        if (sku.includes(search))
          score += 220

        if (brand.includes(search))
          score += 180

        if (category.includes(search))
          score += 160

        if (note.includes(search))
          score += 80

        // MULTI WORD

        const words =
          search.split(" ")

        words.forEach((word) => {

          if (name.includes(word))
            score += 40

          if (sku.includes(word))
            score += 35

          if (brand.includes(word))
            score += 30

          if (category.includes(word))
            score += 25

          if (note.includes(word))
            score += 15
        })

        return {
          ...product,
          score
        }

      })

      .filter((product) =>
        product.score > 0
      )

    result.sort((a, b) => {

      if (b.score !== a.score) {

        return b.score - a.score
      }

      return (
        new Date(b.createdAt) -
        new Date(a.createdAt)
      )
    })

    return result
}