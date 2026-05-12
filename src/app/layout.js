import "./globals.css"

export const metadata = {

  title: "Birmadir",

  description:
    "Offline First Inventory Application",

  manifest: "/manifest.json"
}

export default function RootLayout({
  children
}) {

  return (

    <html lang="en">

      <body>

        {children}

      </body>

    </html>
  )
}
