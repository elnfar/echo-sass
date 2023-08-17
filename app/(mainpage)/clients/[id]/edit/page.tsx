import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { revalidatePath } from "next/cache";

type ClientPageProps = {
    params: {
        id:string
    }
}

export default async function ClientsEditPage({params}:ClientPageProps) {
    const user = await getUserSession();

    const client = await prisma.client.findFirst({
        where: {
            tenantId:user.tenant.id,
            id:params.id
        }
    })


    async function editClient(data:FormData) {
        'use server'

        if(!client) return redirect('/clients')
        const user = await getUserSession();

        await prisma.client.updateMany({
            where: {
                tenant:{
                    id:user.tenant.id
                },
                id:client.id,

            },
            data: {
                name:data.get('name') as string,
                color:data.get('color') as string
            }
        })
        revalidatePath(`/clients/${client.id}`)
        redirect(`/clients/${client.id}`)
    }

    if(!client) {
        return redirect('/clients')
    }
    return (
            <form action={editClient} className="py-6 flex flex-col gap-4 items-start">
                <h2>Edit Client</h2>
                <input type="hidden" defaultValue={client.id} />
                <Input type="text" name="name" placeholder="Client name" defaultValue={client.name || ''}/>
                <Input type="color" name="color" placeholder="Color" defaultValue={client.color || ''}/>

                <Button type="submit">Save</Button>

            </form>

    )
  }
  