"use client"

import PouchDB from "pouchdb-browser"

import { getDB } from "./pouchDB"

let syncHandler = null

export async function startSync() {

  try {

    if (typeof window === "undefined") {
      return null
    }

    if (syncHandler) {
      return syncHandler
    }

    const localDB = getDB()

    if (!localDB) {
      return null
    }

    const remoteDB = new PouchDB(
      process.env.NEXT_PUBLIC_SYNC_URL,
      {
        skip_setup: true
      }
    )

    syncHandler = localDB.sync(
      remoteDB,
      {

        live: true,

        retry: true,

        heartbeat: 10000,

        timeout: 30000
      }
    )

      .on("change", (info) => {

        console.log(
          "SYNC CHANGE",
          info
        )
      })

      .on("paused", (error) => {

        if (error) {

          console.log(
            "SYNC PAUSED ERROR",
            error
          )

        } else {

          console.log(
            "SYNC PAUSED"
          )
        }
      })

      .on("active", () => {

        console.log(
          "SYNC ACTIVE"
        )
      })

      .on("denied", (error) => {

        console.log(
          "SYNC DENIED",
          error
        )
      })

      .on("complete", (info) => {

        console.log(
          "SYNC COMPLETE",
          info
        )
      })

      .on("error", (error) => {

        console.log(
          "SYNC ERROR",
          error
        )
      })

    return syncHandler

  } catch (error) {

    console.log(
      "START SYNC ERROR",
      error
    )

    return null
  }
}
