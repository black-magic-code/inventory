export default function Loading() {

  return (

    <div
      className="
        fixed
        inset-0
        flex
        items-center
        justify-center
        background
        text
        overflow-hidden
      "
    >

      {/* BACKGROUND GLOW */}

      <div
        className="
          absolute
          w-75
          h-75
          rounded-full
          bg-gray-400/20
          blur-3xl
          animate-pulse
        "
      />

      {/* CENTER CONTENT */}

      <div
        className="
          relative
          flex
          flex-col
          items-center
          gap-8
        "
      >

        {/* POLYMORPHISM ICON */}

        <div
          className="
            relative
            w-32
            h-32
            flex
            items-center
            justify-center
          "
        >

          {/* OUTER ROTATION */}

          <div
            className="
              absolute
              inset-0
              border-[6px]
              border-gray-400
              rounded-[35%]
              animate-spin
            "
            style={{
              animationDuration: "6s"
            }}
          />

          {/* INNER SHAPE */}

          <div
            className="
              absolute
              w-20
              h-20
              rounded-[30%]
              bg-linear-to-br
              from-gray-200
              to-gray-500
              animate-pulse
            "
          />

          {/* CORE */}

          <div
            className="
              absolute
              w-8
              h-8
              rounded-full
              bg-white
              shadow-2xl
            "
          />

        </div>

        {/* BLINK TEXT */}

        <h1
          className="
            text-4xl
            md:text-5xl
            font-black
            tracking-[0.4em]
            animate-pulse
            select-none
          "
        >

          INVENTORY

        </h1>

      </div>

    </div>
  )
}