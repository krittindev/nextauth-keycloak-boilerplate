import { NextMiddlewareWithAuth, withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

const ADMIN_PAGES_PROTECTED = ['/api/export', '/admin']
const USER_PAGES_PROTECTED = ['/user']
const PROTECTED = [...ADMIN_PAGES_PROTECTED, ...USER_PAGES_PROTECTED]

export const config = {
  matcher: ['/api/export/:path*', '/admin/:path*', '/user/:path*'],
}

const nextAuthMiddleware: NextMiddlewareWithAuth = (req) => {
  const token = req.nextauth.token
  const pathname = req.nextUrl.pathname
  const forbidden = NextResponse.rewrite(new URL('/forbidden', req.url))

  if (!PROTECTED.some((path) => pathname.startsWith(path)))
    return NextResponse.next()
  if (!token) return forbidden
  if (!token.roles) return forbidden

  const isAdmin = token.roles.includes(process.env.ADMIN_ROLE)
  const isUser = token.roles.includes(process.env.USER_ROLE)

  if (ADMIN_PAGES_PROTECTED.some((path) => pathname.startsWith(path))) {
    return isAdmin ? NextResponse.next() : forbidden
  }
  if (USER_PAGES_PROTECTED.some((path) => path.startsWith(path))) {
    return isUser ? NextResponse.next() : forbidden
  }
  return forbidden
}

const middleware = withAuth(nextAuthMiddleware)

export default middleware
