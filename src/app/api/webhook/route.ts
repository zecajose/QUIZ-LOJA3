import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const data = await req.json()

    // Envie do servidor para o Make (URL secreta fica aqui, não no cliente)
    const makeRes = await fetch('https://hook.us2.make.com/ape5oo85bbbeiiwd9tuyt483ij27ge8d', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      // Importante: Next no server não sofre CORS
    })

    const text = await makeRes.text()
    return NextResponse.json({ ok: makeRes.ok, status: makeRes.status, body: text })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
