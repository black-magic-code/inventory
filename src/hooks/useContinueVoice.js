"use client"

import {
    useState,
    useRef
} from "react"

import normalizeVoiceText
    from "@/lib/normalizeVoiceText"

export default function
    useVoiceSearch(onResult) {

    const [isListening, setIsListening] =
        useState(false)

    const recognitionRef =
        useRef(null)

    const finalTranscriptRef =
        useRef("")

    const startListening = () => {

        try {

            const SpeechRecognition =

                window.SpeechRecognition ||

                window.webkitSpeechRecognition

            if (!SpeechRecognition) {

                alert(
                    "Voice search not supported"
                )

                return
            }

            // STOP OLD SESSION

            if (
                recognitionRef.current
            ) {

                recognitionRef.current.stop()
            }

            const recognition =
                new SpeechRecognition()

            recognitionRef.current =
                recognition

            // LANGUAGE

            recognition.lang = "en"

            // CONTINUOUS STREAM

            recognition.continuous = true

            // LIVE WORDS

            recognition.interimResults = true

            recognition.maxAlternatives = 1

            setIsListening(true)

            recognition.start()

            // LIVE SPEECH RESULT

            recognition.onresult = (
                event
            ) => {

                let interimTranscript = ""

                // PREVIOUS FINAL TEXT

                let finalTranscript =

                    finalTranscriptRef.current

                for (

                    let i = event.resultIndex;

                    i < event.results.length;

                    i++

                ) {

                    const transcript =

                        event.results[i][0]
                            .transcript

                    // FINALIZED SPEECH

                    if (
                        event.results[i].isFinal
                    ) {

                        finalTranscript +=
                            transcript + " "

                    }

                    // LIVE SPEECH

                    else {

                        interimTranscript +=
                            transcript + " "
                    }
                }

                // SAVE FINAL MEMORY

                finalTranscriptRef.current =
                    finalTranscript

                // COMBINE BOTH

                const combinedText =

                    finalTranscript +
                    interimTranscript

                // NORMALIZE

                const normalized =

                    normalizeVoiceText(
                        combinedText
                    )

                // UPDATE UI

                onResult(normalized)

                console.log(
                    "VOICE:",
                    normalized
                )
            }

            recognition.onerror = (
                error
            ) => {

                console.log(
                    "VOICE ERROR:",
                    error
                )

                setIsListening(false)
            }

            recognition.onend = () => {

                console.log("VOICE END")

                if (
                    isListening
                ) {

                    try {

                        recognition.start()

                    } catch (error) {

                        console.log(
                            "RESTART ERROR",
                            error
                        )
                    }
                }
            }

        } catch (error) {

            console.log(error)

            setIsListening(false)
        }
    }

    const stopListening = () => {

        if (
            recognitionRef.current
        ) {

            recognitionRef.current.stop()
        }

        setIsListening(false)
    }

    return {

        isListening,

        startListening,

        stopListening
    }
}