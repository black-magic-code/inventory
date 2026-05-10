"use client"

import { getDB } from "@/database/pouchdb"

export const addProduct = async (
  product
) => {

  const db = await getDB()

  const newProduct = {
    _id: Date.now().toString(),
    type: "product",
    name: product.name,
    sku: product.sku,
    brand: product.brand,
    category: product.category,
    price: Number(product.price),
    cost: Number(product.cost),
    quantity: Number(product.quantity),
    note: product.note,
    image: product.image,
    lowstock: product.lowstock,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  return await db.put(newProduct)
}
export const getProducts = async () => {

  const db = await getDB()

  const result = await db.allDocs({
    include_docs: true
  })

  return result.rows
    .map((row) => row.doc)
    .filter((doc) => doc.type === "product")
}
export const deleteProduct = async (
  id
) => {

  const db = await getDB()
  const doc = await db.get(id)
  return await db.remove(doc)
}
export const updateQuantity = async (
  id,
  quantity
) => {

  const db = await getDB()

  const doc = await db.get(id)

  doc.quantity = Number(quantity)

  return await db.put(doc)
}
export const updateName = async (
  id,
  name
) => {
  if (!name) return;
  const db = await getDB()

  const doc = await db.get(id)

  doc.name = name.trim()

  return await db.put(doc)
}
export const updatePrice = async (
  id,
  price
) => {
  if (!price || price < 0) return;
  const db = await getDB()

  const doc = await db.get(id)

  doc.price = Number(price);

  return await db.put(doc)
}
export const updateBrand = async (
  id,
  brandName
) => {

  const db = await getDB()

  const doc = await db.get(id)

  doc.brand = brandName

  return await db.put(doc)
}
export const updateCategory = async (
  id,
  category
) => {

  const db = await getDB()

  const doc = await db.get(id)

  doc.category = category

  return await db.put(doc)
}
export const updateCost = async (
  id,
  cost
) => {

  const db = await getDB()

  const doc = await db.get(id)

  doc.cost = Number(cost)

  return await db.put(doc)
}
export const updateNote = async (
  id,
  note
) => {

  const db = await getDB()

  const doc = await db.get(id)

  doc.note = note

  return await db.put(doc)
}
export const updateSKU = async (
  id,
  sku
) => {

  const db = await getDB()

  const doc = await db.get(id)

  doc.sku = sku

  return await db.put(doc)
}

export const updateImage = async (
  id,
  image
) => {

  const db = await getDB()

  const doc = await db.get(id)

  doc.image = image

  return await db.put(doc)
}

export const updateLowStock = async (
  id,
  lowstock
) => {

  const db = await getDB()

  const doc = await db.get(id)

  doc.lowstock = Number(lowstock)

  return await db.put(doc)
}
export const subscribeProducts = async (
  callback
) => {

  const db = await getDB()

  return db
    .changes({

      since: "now",

      live: true,

      include_docs: true

    })

    .on("change", async () => {

      const products =
        await getProducts()

      callback(products)

    })
}