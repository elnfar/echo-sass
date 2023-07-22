import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export default async function page({params}:{params:{id:string}}) {
    
    const user = await getUserSession();




    const clients = (await prisma.client.findMany({
        where: {
            tenantId:user.tenant.id
        }
    })).map((client) => ({
        value:client.id,
        label:client.name
    }))


    const projects = await prisma.project.findFirst({
        where: {
            id:params.id,
            tenantId:user.tenant.id,
        },
        include:{
            client:true
        }
    })


    async function editProject(data:FormData) {
        'use server'

        const client = data.get('client') as string

        await prisma.project.updateMany({
            where:{
                id:params.id,
                tenantId:user.tenant.id
            },
            data:{
                name:data.get('name') as string,
                color: data.get('color') as string,
                clientId:client ? client : null
            }
        })

        revalidatePath(`/projects/${params.id}`)
        redirect(`/projects/${params.id}`)
    }

  return (
    <div>
        <h1>Edit</h1>


        <form action={editProject}>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input type="name" defaultValue={projects?.name} name="name" id="name" placeholder="Project Name" required />
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="color">Color</Label>
                    <Input defaultValue={projects?.color || ''} type="color" name="color" id="color" placeholder="Color" />
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                    <div><Label>Client</Label></div>
                        <Select name="client" defaultValue={projects?.clientId || ''}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Assign a client" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Client</SelectLabel>
                            <SelectItem value="">None</SelectItem>
                                {clients.map((client) => (
                                      <SelectItem value={client.value} key={client.value}>{client.label}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit">Edit Project</Button>
                </form>

    </div>
  )
}
