"use client"

let dbInstance = null

export async function getDB() {

  if (typeof window === "undefined") {
    return null
  }

  if (dbInstance) {
    return dbInstance
  }

  const PouchDB =
    (await import("pouchdb-browser"))
      .default

  dbInstance = new PouchDB(

    "inventory",

    {

      auto_compaction: true,

      revs_limit: 20
    }
  )

  console.log(
    "POUCH DB CONNECTED"
  )

  return dbInstance
}