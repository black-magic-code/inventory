"use client"

import {
  useEffect,
  useRef,
  useState
} from "react"

export default function
useMic(isListening) {

  const [level, setLevel] =
    useState(0)

  const animationRef =
    useRef(null)

  const analyserRef =
    useRef(null)

  const audioContextRef =
    useRef(null)

  const streamRef =
    useRef(null)

  useEffect(() => {

    if (!isListening) {

      setLevel(0)

      // CLEANUP

      if (animationRef.current) {

        cancelAnimationFrame(
          animationRef.current
        )
      }

      if (streamRef.current) {

        streamRef.current
          .getTracks()
          .forEach(track =>
            track.stop()
          )
      }

      if (audioContextRef.current) {

        audioContextRef.current
          .close()
      }

      return
    }

    const startMicLevel =
      async () => {

        try {

          const stream =

            await navigator
              .mediaDevices
              .getUserMedia({

                audio: true
              })

          streamRef.current =
            stream

          const AudioContext =

            window.AudioContext ||

            window.webkitAudioContext

          const audioContext =
            new AudioContext()

          audioContextRef.current =
            audioContext

          const analyser =
            audioContext
              .createAnalyser()

          analyser.fftSize = 256

          analyserRef.current =
            analyser

          const source =

            audioContext
              .createMediaStreamSource(
                stream
              )

          source.connect(analyser)

          const dataArray =

            new Uint8Array(
              analyser.frequencyBinCount
            )

          const updateLevel =
            () => {

              analyser
                .getByteFrequencyData(
                  dataArray
                )

              let values = 0

              for (

                let i = 0;

                i < dataArray.length;

                i++

              ) {

                values +=
                  dataArray[i]
              }

              const average =

                values /
                dataArray.length

              // NORMALIZE

              const normalized =

                Math.min(
                  average / 100,
                  1
                )

              setLevel(normalized)

              animationRef.current =

                requestAnimationFrame(
                  updateLevel
                )
            }

          updateLevel()

        } catch (error) {

          console.log(error)
        }
      }

    startMicLevel()

  }, [isListening])

  return level
}