import './globals.css'

export const metadata = {
  title: 'Котигорошко — Інтерактивна українська казка',
  description: 'Зануртесь у чарівний світ української народної казки про хороброго героя Котигорошка',
  keywords: 'українська казка, Котигорошко, інтерактивна історія, folk tale',
  authors: [{ name: 'Kotyhoroshko Tale' }],
  openGraph: {
    title: 'Котигорошко — Інтерактивна українська казка',
    description: 'Зануртесь у чарівний світ української народної казки',
    type: 'website',
  },
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
        <link 
          href="https://fonts.googleapis.com/css2?family=Marck+Script&family=Philosopher:wght@400;700&display=swap" 
          rel="stylesheet" 
        />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  )
}