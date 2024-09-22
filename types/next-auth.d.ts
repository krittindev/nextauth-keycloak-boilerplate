import NextAuth from 'next-auth'

declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string
    id_token: string
    expires_at: number
    refresh_token: string
    error?: string
    roles: string[]
    realm_access: { roles: string[] } | undefined
    resource_access: Record<'account' | string, { roles: string[] }> | undefined
  }
}

declare module 'next-auth' {
  interface Session {
    error?: string
    roles: string[]
    sub?: string
  }
}

export { NextAuth }
