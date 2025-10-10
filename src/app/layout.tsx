import './globals.css'

export const metadata = {
  title: 'Diagnóstico da Sua Loja',
  description: 'Responda ao quiz e receba um diagnóstico com plano de ação para sua loja de moda feminina.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
