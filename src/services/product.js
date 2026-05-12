"use client"

import { getDB } from "@/database/pouchdb"

import { db } from "@/lib/firebase"

import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc
} from "firebase/firestore"

const PRODUCTS_COLLECTION = "products"
let isSyncing = false

export const syncFromCloud = async () => {

  if (isSyncing) return

  isSyncing = true

  try {

    const localDB = await getDB()

    const snapshot =
      await getDocs(
        collection(
          db,
          PRODUCTS_COLLECTION
        )
      )

    for (const cloudDoc of snapshot.docs) {

      const data = cloudDoc.data()

      try {

        const existing =
          await localDB.get(
            data._id
          )

        if (
          existing.updatedAt ===
          data.updatedAt
        ) {
          continue
        }

        try {

          await localDB.put({

            ...existing,

            ...data,

            _rev: existing._rev
          })

        } catch (error) {

          if (error.status !== 409) {

            console.log(
              "PUT SYNC ERROR",
              error
            )
          }
        }

      } catch (error) {

        // DOCUMENT NOT FOUND
        // CREATE IT LOCALLY

        if (error.status === 404) {

          try {

            await localDB.put(data)

          } catch (putError) {

            if (
              putError.status !== 409
            ) {

              console.log(
                "CREATE LOCAL ERROR",
                putError
              )
            }
          }

        } else {

          console.log(
            "SYNC DOC ERROR",
            error
          )
        }
      }
    }

    console.log(
      "FIREBASE -> LOCAL SYNC DONE"
    )

  } catch (error) {

    console.log(
      "SYNC FROM CLOUD ERROR",
      error
    )

  } finally {

    isSyncing = false
  }
}

export const syncToCloud = async (
  product
) => {

  try {

    await setDoc(

      doc(
        db,
        PRODUCTS_COLLECTION,
        product._id
      ),

      product
    )

    console.log(
      "LOCAL -> FIREBASE SYNC DONE"
    )

  } catch (error) {

    console.log(
      "SYNC TO CLOUD ERROR",
      error
    )
  }
}

export const addProduct = async (
  product
) => {

  const localDB =
    await getDB()

  const newProduct = {
    _id: crypto.randomUUID(),
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
    updatedAt: new Date().toISOString(),
    deleted: false,
    deletedAt: null,
  }

  await localDB.put(
    newProduct
  )

  syncToCloud(newProduct)

  return newProduct
}

export const getProducts =
  async () => {

    try {

      await syncFromCloud()

      const localDB =
        await getDB()

      const result =
        await localDB.allDocs({

          include_docs: true
        })

      return result.rows

        .map((row) => row.doc)

        .filter(
          (doc) =>
            doc?.type === "product" &&
            !doc?.deleted
        )

    } catch (error) {

      console.log(
        "GET PRODUCTS ERROR",
        error
      )

      return []
    }
  }

export const deleteProduct = async (id) => {

  const localDB =
    await getDB()

  const docData =
    await localDB.get(id)

  docData.deleted = true

  docData.deletedAt =
    new Date().toISOString()

  docData.updatedAt =
    new Date().toISOString()

  await localDB.put(docData)

  syncToCloud(docData)
}

export const updateQuantity =
  async (
    id,
    quantity
  ) => {

    const localDB =
      await getDB()

    const docData =
      await localDB.get(id)

    docData.quantity =
      Number(quantity)

    docData.updatedAt =
      new Date().toISOString()

    await localDB.put(docData)

    syncToCloud(docData)
  }

export const updateName =
  async (
    id,
    name
  ) => {

    const localDB =
      await getDB()

    const docData =
      await localDB.get(id)

    docData.name =
      name

    docData.updatedAt =
      new Date().toISOString()

    await localDB.put(docData)

    syncToCloud(docData)
  }

export const updatePrice =
  async (
    id,
    price
  ) => {

    const localDB =
      await getDB()

    const docData =
      await localDB.get(id)

    docData.price =
      Number(price)

    docData.updatedAt =
      new Date().toISOString()

    await localDB.put(docData)

    syncToCloud(docData)
  }

export const updateBrand =
  async (
    id,
    brand
  ) => {

    const localDB =
      await getDB()

    const docData =
      await localDB.get(id)

    docData.brand =
      brand

    docData.updatedAt =
      new Date().toISOString()

    await localDB.put(docData)

    syncToCloud(docData)
  }

export const updateCategory =
  async (
    id,
    category
  ) => {

    const localDB =
      await getDB()

    const docData =
      await localDB.get(id)

    docData.category =
      category

    docData.updatedAt =
      new Date().toISOString()

    await localDB.put(docData)

    syncToCloud(docData)
  }

export const updateCost =
  async (
    id,
    cost
  ) => {

    const localDB =
      await getDB()

    const docData =
      await localDB.get(id)

    docData.cost =
      Number(cost)

    docData.updatedAt =
      new Date().toISOString()

    await localDB.put(docData)

    syncToCloud(docData)
  }

export const updateNote =
  async (
    id,
    note
  ) => {

    const localDB =
      await getDB()

    const docData =
      await localDB.get(id)

    docData.note =
      note

    docData.updatedAt =
      new Date().toISOString()

    await localDB.put(docData)

    syncToCloud(docData)
  }

export const updateSKU =
  async (
    id,
    sku
  ) => {

    const localDB =
      await getDB()

    const docData =
      await localDB.get(id)

    docData.sku =
      sku

    docData.updatedAt =
      new Date().toISOString()

    await localDB.put(docData)

    syncToCloud(docData)
  }

export const updateImage =
  async (
    id,
    image
  ) => {

    const localDB =
      await getDB()

    const docData =
      await localDB.get(id)

    docData.image =
      image

    docData.updatedAt =
      new Date().toISOString()

    await localDB.put(docData)

    syncToCloud(docData)
  }

export const updateLowStock =
  async (
    id,
    lowstock
  ) => {

    const localDB =
      await getDB()

    const docData =
      await localDB.get(id)

    docData.lowstock =
      Number(lowstock)

    docData.updatedAt =
      new Date().toISOString()

    await localDB.put(docData)

    syncToCloud(docData)
  }

export const subscribeProducts = async (callback) => {

  const localDB =
    await getDB()

  return localDB

    .changes({

      since: "now",

      live: true,

      include_docs: true
    })

    .on(
      "change",
      async () => {

        try {

          const result =
            await localDB.allDocs({

              include_docs: true
            })

          const products =
            result.rows

              .map((row) => row.doc)

              .filter(
                (doc) =>
                  doc?.type === "product" &&
                  !doc?.deleted
              )

          callback(products)

        } catch (error) {

          console.log(
            "SUBSCRIBE ERROR",
            error
          )
        }
      }
    )
}