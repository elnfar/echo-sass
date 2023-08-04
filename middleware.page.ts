export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/track/:path*',
    '/projects/:path*',
  ]
}