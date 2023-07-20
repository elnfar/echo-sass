import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getUserSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma";
import { MoreHorizontal } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function ProjectsLayout({params}:{params:{id:string}}) {
    const user = await getUserSession();

    const projects = await prisma.project.findFirst({
        where: {
            id:params.id,
            tenantId:user.tenant.id,
        },
        include:{
            client:true
        }
    })
    async function deleteProject() {
        'use server'
        if (!projects) notFound()
    
        await prisma.project.deleteMany({
          where: {
            tenantId: user.tenant.id,
            id: params.id
          }
        })
    
        revalidatePath('/projects')
        redirect('/projects')
      }
    
    if(!projects) {
        throw notFound();
    }
    return (        
        <div>
            <h1>Projectsss</h1>

            <Dialog>
        <DropdownMenu>
            <DropdownMenuTrigger>
                <MoreHorizontal/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                     <Link href={`/projects/${projects.id}/edit`}>
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
                <DialogTitle>Dou you want to confirm, you delete the client {projects.name}</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. Are you sure you want to permanently
                    delete this file from our servers?
                </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                <form action={deleteProject}>
                <Button type="submit" variant="destructive">
                  Delete
                </Button>
              </form>            

                </DialogFooter>
            </DialogContent>
        </Dialog>
            <div>{projects.name}</div>
            {projects.client && (
                <div>
                    <h2>Client</h2>
                    <div>{projects.client.name}</div>
                    
                </div>
            )}
        </div>
    )
}

// IMPORTANT PAGE//