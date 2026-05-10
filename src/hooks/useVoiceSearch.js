"use client"

import {
  useState,
  useRef
} from "react"

import normalizeVoiceText from "@/lib/normalizeVoiceText"

export default function useVoiceSearch(
  onResult
) {

  const [isListening, setIsListening] =
    useState(false)

  const [micLevel, setMicLevel] =
    useState(0)

  const recognitionRef =
    useRef(null)

  const audioContextRef =
    useRef(null)

  const analyserRef =
    useRef(null)

  const animationRef =
    useRef(null)

  const [error, setError] = useState("");

  const audioStreamRef = useRef(null)

  const startListening = () => {

    try {

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        alert("Voice search not supported")
        return
      }

      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition

      recognition.lang = "en-IN"
      recognition.continuous = false
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      try {
        setIsListening(true)
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream) => {
            audioStreamRef.current = stream
            const AudioContext = window.AudioContext || window.webkitAudioContext
            const audioContext = new AudioContext()
            audioContextRef.current = audioContext

            const analyser = audioContext.createAnalyser()
            analyser.fftSize = 256
            analyserRef.current = analyser
            const source = audioContext.createMediaStreamSource(stream)
            source.connect(analyser)
            const dataArray = new Uint8Array(analyser.frequencyBinCount)

            const updateLevel = () => {
              analyser.getByteFrequencyData(dataArray)
              let values = 0

              for (let i = 0; i < dataArray.length; i++) { values += dataArray[i] }
              const average = values / dataArray.length
              const normalized = Math.min(average / 100, 1)
              setMicLevel(normalized)
              animationRef.current = requestAnimationFrame(updateLevel)
            }
            updateLevel()
          })

      } catch (error) {

        setError(
          "Microphone permission denied or Not Supported"
        )

        return
      }

      recognition.start()

      recognition.onresult = (event) => {
        let finalText = ""
        let interimText = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalText += transcript + " "
          } else {
            interimText += transcript
          }
        }

        const combined = normalizeVoiceText(finalText + interimText)
        onResult(combined)
        setIsListening(false);
      }

      recognition.onerror = (
        error
      ) => {

        setError(error?.message);

        setIsListening(false)
      }

      recognition.onend = () => {
        stopListening();
        setIsListening(false)
      }

    } catch (error) {
      setError(error?.message);

      setIsListening(false)
    }
  }

  const stopListening = () => {

    try {

      if (animationRef.current) {

        cancelAnimationFrame(
          animationRef.current
        )
      }

      if (recognitionRef.current) {

        recognitionRef.current.onend = null

        recognitionRef.current.stop()

        recognitionRef.current.abort()

        recognitionRef.current = null
      }

      if (audioStreamRef.current) {

        audioStreamRef.current
          .getTracks()
          .forEach(track =>
            track.stop()
          )

        audioStreamRef.current =
          null
      }

      if (

        audioContextRef.current &&

        audioContextRef.current
          .state !== "closed"

      ) {

        audioContextRef.current
          .close()

        audioContextRef.current =
          null
      }

      setMicLevel(0)

    } catch (error) {

      setError(error?.message);
    }

    setIsListening(false)
  }

  return {

    isListening,

    micLevel,

    startListening,

    stopListening,
    error
  }
}