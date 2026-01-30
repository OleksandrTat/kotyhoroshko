import './globals.css'

export const metadata = {
  title: 'Котигорошко — Інтерактивна казка',
  description: 'Зануртесь у чарівний світ української народної казки',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Marck+Script&family=Philosopher:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-black text-white overflow-hidden antialiased">
        {children}
      </body>
    </html>
  )
}