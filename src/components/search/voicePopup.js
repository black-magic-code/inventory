"use client"

import {
  FaMicrophone,
  FaTimes
} from "react-icons/fa"

export default function VoicePopup({ isListening, micLevel, onClose}) {

  return (

    <div className={`fixed inset-0 z-9999 flex items-center justify-center transition-all duration-300 ${isListening ? `opacity-100 pointer-events-auto` : `opacity-0 pointer-events-none`}`}>
      <button onClick={onClose} className="absolute top-6 z-9999 right-6 w-12 h-12 rounded-full border flex items-center justify-center text-xl hover:scale-110 transition">
        <FaTimes />

      </button>

      <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" />

      <div className="relative flex flex-col items-center justify-center gap-14 px-8">

        <div className="absolute w-72 h-72 rounded-full border border-gray-500/40 transition-all duration-75"

          style={{

            transform:
              `scale(${1 + micLevel * 0.8})`,

            opacity:
              0.3 + micLevel
          }}
        />

        <div className="absolute w-96 h-96 rounded-full border border-gray-400/20 transition-all duration-100"

          style={{

            transform:
              `scale(${1 + micLevel * 1.2})`,

            opacity:
              0.2 + micLevel
          }}
        />

        <div className="absolute w-md h-112 rounded-full border border-gray-300/10 transition-all duration-150"

          style={{

            transform:
              `scale(${1 + micLevel * 1.6})`,

            opacity:
              0.1 + micLevel
          }}
        />

        <div className="relative w-40 h-40 rounded-[2.5rem] flex items-center justify-center transition-all duration-75 shadow-2xl"

          style={{

            transform:
              `scale(${1 + micLevel * 0.35})`
          }}
        >

          <FaMicrophone className="text-7xl text-[--foregorund]" />

        </div>

      </div>

    </div>
  )
}