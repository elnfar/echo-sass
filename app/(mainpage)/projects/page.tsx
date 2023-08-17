import { Button } from "@/components/ui/button"
import { getUserSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ProjectList } from "./projects"
import { redirect } from "next/navigation"



const BlackSlide = () => {
  return (
    <div className="flex items-center justify-center flex-col h-[70vh] ">

      <div className="bg-zinc-900 text-white w-[900px] text-center py-12 space-y-6 rounded-lg">
        <h2 className="text-[2rem] font-bold font-sans">Create a Project</h2>
        <p>Create a project for keeping your work organized!</p>
        <Button asChild variant="outline" className="text-black">
          <Link href="/projects/new">Create</Link>
        </Button>
      </div>

    </div>
  )
}




export default async function ProjectPage() {

  const user = await getUserSession();
  
  const projects =  await prisma.project.findMany({
    where: {
      tenantId:user.tenant.id
    },
    orderBy:{
        createdAt:'desc'
    }
  })

  if(projects.length > 0) {
    redirect(`/projects/${projects[0].id}`)
  }
  
  return (
    <div  className="container py-4">
      <BlackSlide/>
    </div>
  )
}
