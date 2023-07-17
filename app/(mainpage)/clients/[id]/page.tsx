import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ClientPageProps = {
    params: {
        id:string
    }
}

export default async function ClientsPage({params}:ClientPageProps) {
    const user = await getUserSession();

    const client = await prisma.client.findFirst({
        where: {
            tenantId:user.tenant.id,
            id:params.id
        }
    })


    if(!client) {
        return <div>Client not found!</div>
    }
    return (
      <div  className="container py-4">
            <h3>{client.name}</h3>
      </div>
    )
  }
  