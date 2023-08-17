import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

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


    async function deleteClient() {
        'use server'

        if(!client) throw new Error('Client not found');
        await prisma.client.deleteMany({
            where: {
                tenantId:user.tenant.id,
                id:client.id
            }
        })
        redirect('/clients')
    }

    return (
      <div  className="container py-16 flex gap-4">
                  <h1 className="text-[4rem]">{client.name}</h1>
   
    
        <Dialog>
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button>Manage</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                     <Link href={`/clients/${client.id}/edit`}>
                        Edit
                    </Link>
                </DropdownMenuItem>
                <DialogTrigger asChild>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                </DialogTrigger>
            </DropdownMenuContent>
        </DropdownMenu>
                    <DialogContent>
                <DialogHeader>
                <DialogTitle>Dou you want to confirm, you delete the client {client.name}</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. Are you sure you want to permanently
                    delete this file from our servers?
                </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <form action={deleteClient}>
                      <Button type="submit" variant="destructive">Delete</Button>
                    </form>               

                </DialogFooter>
            </DialogContent>
        </Dialog>

    </div>
  
    )
  }
  