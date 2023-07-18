import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

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
            <div>
        <h2>Client</h2>
    

        <DropdownMenu>
            <DropdownMenuTrigger>
                <MoreHorizontal/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                     <Link href={`/clients/${client.id}/edit`}>
                        Edit
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

</div>
            <h3>{client.name}</h3>
      </div>
    )
  }
  