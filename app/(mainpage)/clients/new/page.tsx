import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"

export default async function NewClientsPage() {

    const user = await getUserSession();
    
    async function onCreate(data:FormData) {
        'use server'
        await prisma.client.create({
            data: {
                tenantId:user.tenant.id,
                name:data.get('name') as string,
                color:data.get('color') as string
            }
        })
        revalidatePath('/clients')
        redirect('/clients')
    }

    return (
      <div  className="container py-4">
        <h2>Create a new client</h2>
        
        <form action={
            onCreate
        } 
        className="flex gap-4"
        >
            <Input type="text" name="name" placeholder="Client name"/>
            <Input type="color" name="color" placeholder="Color"/>
            <Button type="submit">Create</Button>
        </form>
      </div>
    )
  }
  