import 'bootstrap/dist/css/bootstrap.css'
import './globals.css'

export const metadata = {
  title: 'Tiffin Management',
  description: 'Tiffin Management',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href='https://w1.pngwing.com/pngs/920/74/png-transparent-school-black-and-white-tiffin-logo-cafeteria-meal-breakfast-lunch-symbol.png'/>
      </head>
      <body>{children}</body>
    </html>
  )
}
