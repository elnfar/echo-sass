import { Button } from "@/components/ui/button"
import { getUserSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ProjectList } from "./projects"



const BlackSlide = () => {
  return (
    <div>
      <h2>Create a Project</h2>
      <p>Create a project for keeping your work organized!</p>
      <Button asChild>
        <Link href="/projects/new">Create</Link>
      </Button>
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
  
  return (
    <div  className="container py-4">
      {projects.length > 0 ? <ProjectList projects={projects}/>:<BlackSlide/>}
 
    </div>
  )
}
