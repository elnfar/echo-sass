import { Button } from "@/components/ui/button"
import { getUserSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Client } from "@prisma/client"
import { ClientList, ClientListHeader } from "./client-list"
import Link from "next/link"



const BlackSlide = () => {
  return (
    <div>
      <h2>Create a Client</h2>
      <p>Create a client for keeping your work organized!</p>
      <Button asChild>
        <Link href="/clients/new">Create</Link>
      </Button>
    </div>
  )
}




export default async function ClientsPage() {

  const user = await getUserSession();
  
  const clients =  await prisma.client.findMany({
    where: {
      tenantId:user.tenant.id
    }
  })
  
  return (
    <div  className="container py-4 space-y-6">
     <ClientListHeader/>

     <div className="flex">
      {clients.length > 0 ? <ClientList clients={clients}/>:<BlackSlide/>}
     </div>
    </div>
  )
}
