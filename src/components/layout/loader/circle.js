function CircleLoader() {

  return (

    <div
      className="
      flex
      items-center
      justify-center
      w-full
    "
    >

      <div
        className="
        relative
        w-8
        h-8
      "
      >

        {/* BACKGROUND RING */}

        <div
          className="
          absolute
          inset-0
          rounded-full
          border-[5px]
          border-blue-100
        "
        />

        {/* SPINNING LOADER */}

        <div
          className="
          absolute
          inset-0
          rounded-full
          border-[5px]
          border-transparent
          border-t-blue-500
          border-r-blue-500
          animate-spin
        "
        />

        {/* GLOW EFFECT */}

        <div
          className="
          absolute
          inset-1
          rounded-full
          bg-blue-500/10
          blur-md
        "
        />

      </div>

    </div>

  )
}

export default CircleLoader