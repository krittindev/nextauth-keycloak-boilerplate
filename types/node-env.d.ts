declare namespace NodeJS {
  export interface ProcessEnv {
    KEYCLOAK_CLIENT_ID: string
    KEYCLOAK_CLIENT_SECRET: string
    KEYCLOAK_ISSUER: string
    NEXTAUTH_URL: string
    NEXTAUTH_SECRET: string
    ADMIN_ROLE: string
    USER_ROLE: string
  }
}
