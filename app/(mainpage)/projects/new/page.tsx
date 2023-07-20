import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function CreateProjectPage() {

    async function createProject(data:FormData) {
        'use server'

        const user = await getUserSession();

        const project = await prisma.project.create({
            data: {
                tenantId:user.tenant.id,
                name:data.get('name') as string,
                color: data.get('color') as string
            }
        })

        revalidatePath(`/projects`)
        redirect(`/projects/${project.id}`)
    }

    return (
        <form action={createProject}>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input type="name" name="name" id="name" placeholder="Project Name" required />
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="color">Color</Label>
                    <Input type="color" name="color" id="color" placeholder="Color" />
                    </div>
                    <Button type="submit">Submit</Button>
        </form>
    )
}