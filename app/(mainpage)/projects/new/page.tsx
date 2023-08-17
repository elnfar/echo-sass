import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function CreateProjectPage() {
    const user = await getUserSession();


    const clients = (await prisma.client.findMany({
        where: {
            tenantId:user.tenant.id
        }
    })).map((client) => ({
        value:client.id,
        label:client.name
    }))

    async function createProject(data:FormData) {
        'use server'
        const client = data.get('client') as string

        const user = await getUserSession();

        const project = await prisma.project.create({
            data: {
                tenantId:user.tenant.id,
                name:data.get('name') as string,
                color: data.get('color') as string,
                clientId:client ? client : undefined
            }
        })

       

        revalidatePath(`/projects`)
        redirect(`/projects/${project.id}`)
    }

    return (
        <form action={createProject} className="flex items-center justify-center flex-col h-[70vh] gap-7">
                <h1 className="text-[3rem] font-bold">Create Project</h1>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input type="name" name="name" id="name" placeholder="Project Name" required />
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="color">Color</Label>
                    <Input type="color" name="color" id="color" placeholder="Color" />
                    <div><Label>Client</Label></div>
                        <Select name="client">
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
                    <Button type="submit">Submit</Button>
        </form>
    )
}


