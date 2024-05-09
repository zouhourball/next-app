import { NextRequest } from "next/server"

// api de base
export async function GET(req: Request) {
      return  new Response('OK', {
            status: 200,
        })
}
export async function POST(req: NextRequest) {
    const body = await req.json()
    console.log(body)
    console.log(req.cookies.get('cookie'))

  return  new Response('DONE')
}