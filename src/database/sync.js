"use client"

import { getDB }
  from "./pouchdb"

let started = false

const syncUrl = process.env.NEXT_PUBLIC_SYNC_URL

export const startSync = async () => {

  try {

    if (started) return
    if (!syncUrl) {
      console.error('Invalid Sync!')
      return
    }
    started = true

    const db =
      await getDB()

    if (!db) return

    const PouchDBModule =
      await import(
        "pouchdb-browser"
      )

    const PouchDB =
      PouchDBModule.default

    const remoteDB =
      new PouchDB(syncUrl, {
        auth: {
          username: "admin",
          password: "password"
        }
      }
      )

    const online =
      navigator.onLine

    // FIRST TIME ONLINE SYNC

    if (online) {
      await db.replicate.from(
        remoteDB
      )
    }

    db.sync(remoteDB, {

      live: true,

      retry: true

    })

  } catch (error) {
  }
}