import './globals.css'
import '../styles/animations.css'

export const metadata = {
  title: 'Інтерактивна казка — Котигорошко',
  description: 'Багатошарова інтерактивна казка',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body className="bg-black text-white overflow-hidden">
        {children}
      </body>
    </html>
  )
}
