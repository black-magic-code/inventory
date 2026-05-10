"use client"
let db = null
const dbName = process.env.NEXT_PUBLIC_DB_NAME
export const getDB = async () => {

  if (typeof window === "undefined") {
    return null
  }

  if (db) {
    return db
  }

  const PouchDBModule = await import("pouchdb-browser")

  const PouchdbFindModule = await import("pouchdb-find")

  const HttpAdapterModule = await import("pouchdb-adapter-http")

  const PouchDB = PouchDBModule.default

  const PouchdbFind = PouchdbFindModule.default

  const HttpAdapter = HttpAdapterModule.default

  PouchDB.plugin(PouchdbFind)
  PouchDB.plugin(HttpAdapter)

  db = new PouchDB(dbName)

  return db
}