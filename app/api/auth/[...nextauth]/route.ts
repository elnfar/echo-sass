import { session } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'

const authOption: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    })
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (!profile?.email) {
        throw new Error('No profile')
      }
      await prisma.user.upsert({
        where: {
          email: profile?.email
        },
        create: {
          email: profile?.email,
          name: profile?.name,
          avatar: (profile as any).picture,
          tenant:{
            create:{}
          },
        },
        update: {
          name: profile?.name,
          avatar: (profile as any).picture
        }
        })
      return true
    },
    async session({ session, token }:any) {
      
      console.log(session,token,"here you gooo");
    
      session.user.id = token.id
      session.user.tenant = token.tenant
      return session
    },
    async jwt({ token, user, account, profile }) {
      console.log({ token, account, profile, user })
      if (profile) {
        const user = await prisma.user.findUnique({
          where: {
            email: profile.email
          }
        })
        if (!user) {
          throw new Error('No user found')
        }
        token.id = user.id
        token.tenant = {
          id: user.tenantId
        }
      }
      return token
    }
  }
}

const handler = NextAuth(authOption)
export { handler as GET, handler as POST }