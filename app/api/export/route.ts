export const dynamic = 'force-dynamic'

export async function GET() {
  const data = {
    message: 'export file...',
    now: new Date().toJSON(),
  }

  return Response.json(data)
}
