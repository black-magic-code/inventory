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

    process.env.NEXT_PUBLIC_DB_NAME ||
    "inventory",

    {

      auto_compaction: true,

      revs_limit: 20
    }
  )

  return dbInstance
}
