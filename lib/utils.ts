import { clsx, type ClassValue } from 'clsx'
import { JWT } from 'next-auth/jwt'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseJwt(token: string): JWT | undefined {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
  } catch {
    return undefined
  }
}
