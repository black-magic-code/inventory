"use client"

import PouchDB from "pouchdb-browser"

let db = null

export function getDB() {

  if (typeof window === "undefined") {
    return null
  }

  if (!db) {

    db = new PouchDB(
      process.env.NEXT_PUBLIC_DB_NAME || "inventory",
      {
        auto_compaction: true,
        revs_limit: 20
      }
    )
  }

  return db
}
