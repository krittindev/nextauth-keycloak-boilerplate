import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'
import { getServerSession, NextAuthOptions } from 'next-auth'
import KeycloakProvider from 'next-auth/providers/keycloak'
import { parseJwt } from './utils'

export const config = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      const accessTokenJwt = account?.access_token
      if (!accessTokenJwt) return token
      const accessToken = parseJwt(accessTokenJwt)
      if (!accessToken) return token
      const roles =
        accessToken.resource_access[process.env.KEYCLOAK_CLIENT_ID].roles
      return { ...token, roles }
    },
    async session({ session, token }) {
      if (!token.roles) return session
      return { ...session, roles: token.roles }
    },
  },
} satisfies NextAuthOptions

export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config)
}
