import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'
import { getServerSession, NextAuthOptions } from 'next-auth'
import KeycloakProvider from 'next-auth/providers/keycloak'
import { parseJwt } from './utils'
import { JWT } from 'next-auth/jwt'

const COOKIES_LIFE_TIME = 24 * 60 * 60
const COOKIE_PREFIX = process.env.NODE_ENV === 'production' ? '__Secure-' : ''

const refreshAccessToken = async (token: JWT) => {
  const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`
  const resp = await fetch(url, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.KEYCLOAK_CLIENT_ID ?? '',
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET ?? '',
      grant_type: 'refresh_token',
      refresh_token: token.refresh_token,
    }),
    method: 'POST',
    cache: 'no-store',
  })
  const refreshToken = await resp.json()
  if (!resp.ok) throw refreshToken

  const tokenData = parseJwt(refreshToken.access_token)

  return {
    ...token,
    access_token: refreshToken.access_token,
    id_token: refreshToken.id_token,
    expires_at: Math.floor(Date.now() / 1000) + refreshToken.expires_in,
    refresh_token: refreshToken.refresh_token,
    roles: tokenData?.realm_access?.roles ?? [],
  }
}

export const config: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    async jwt({ token, account, trigger }) {
      const isInitialTokenOnSignIn =
        !!account &&
        !!account.access_token &&
        !!account.id_token &&
        !!account.expires_at &&
        !!account.refresh_token
      const isExpires =
        !!account?.expires_at &&
        new Date().getTime() > account.expires_at * 1000

      try {
        if (trigger === 'update') {
          return await refreshAccessToken(token)
        }

        if (isInitialTokenOnSignIn) {
          if (!account.access_token)
            return { ...token, error: 'RefreshAccessTokenError' }

          const tokenData = parseJwt(account.access_token)

          if (!tokenData?.resource_access)
            return { ...token, error: 'RefreshAccessTokenError' }

          const resourceRoles =
            tokenData?.resource_access[process.env.KEYCLOAK_CLIENT_ID].roles

          return {
            ...token,
            roles: resourceRoles,
            access_token: account.access_token,
            id_token: account.id_token,
            expires_at: account.expires_at,
            refresh_token: account.refresh_token,
          }
        } else if (isExpires) {
          return await refreshAccessToken(token)
        }

        return token
      } catch {
        return { ...token, error: 'RefreshAccessTokenError' }
      }
    },
    async session({ session, token }) {
      return {
        ...session,
        roles: token.roles,
        sub: token.sub,
        error: token.error,
      }
    },
  },
  events: {
    async signOut({ token }) {
      const logOutUrl = new URL(
        `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`
      )
      logOutUrl.searchParams.set('id_token_hint', token.id_token)

      await fetch(logOutUrl, { cache: 'no-store' })
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  // pages: {
  //   signIn: '/auth/signin',
  // },
  cookies: {
    sessionToken: {
      name: `${COOKIE_PREFIX}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
    callbackUrl: {
      name: `${COOKIE_PREFIX}next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
    csrfToken: {
      name: `${COOKIE_PREFIX}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
    pkceCodeVerifier: {
      name: `${COOKIE_PREFIX}next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
        maxAge: COOKIES_LIFE_TIME,
      },
    },
    state: {
      name: `${COOKIE_PREFIX}next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
        maxAge: COOKIES_LIFE_TIME,
      },
    },
    nonce: {
      name: `${COOKIE_PREFIX}next-auth.nonce`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
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
