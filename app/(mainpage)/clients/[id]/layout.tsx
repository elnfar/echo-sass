    import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClientList, ClientListHeader } from '../client-list'
import { getUserSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'


export const metadata: Metadata = {
  title: 'echot',
  description: '',
}

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const user = await getUserSession()

  
  const clients = await prisma.client.findMany({
    where: {
      tenantId:user.tenant.id,
    }
  })


  return (
    <html lang="en">
      <div className=' container py-16'>
        <ClientListHeader/>
          <ClientList clients={clients}/>
          {children}

      </div>
    
    </html>
  )
}
