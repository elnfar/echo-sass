import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getUserSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProjectList } from '../projects'
import { Button } from '@/components/ui/button'
import Link from 'next/link'


export const metadata: Metadata = {
  title: 'echot',
  description: '',
}

export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const user = await getUserSession()

  
  const projects = await prisma.project.findMany({
    where: {
      tenantId:user.tenant.id,
    },
    orderBy:  {
        createdAt:'desc'
    }
  })


  return (
    <div className='container mx-auto flex gap-4 divide-x-2 py-4'>

      
        <div className='w-1/2 px-4'>
            <div className='flex justify-between items-center'> 
                  <h2>Projects List</h2>
                  <Button asChild>
                    <Link href='/projects/new'>Create Project</Link>
                  </Button>
      </div>
            <ProjectList projects={projects}/>
        </div>

        <div className='px-4 flex-grow'>{children}</div>
    </div>
  )
}
