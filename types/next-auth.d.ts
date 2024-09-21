import { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

interface ResourceAccess extends Record<string, { roles: string[] }> {
  account: { roles: string[] }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    resource_access: ResourceAccess
    roles: string[] | undefined
  }
}

declare module 'next-auth' {
  interface User extends DefaultUser {
    roles: string[] | undefined
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      roles: string[] | undefined
    } & DefaultSession['user']
  }
}
