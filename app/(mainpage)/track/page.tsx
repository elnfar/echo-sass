import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getUserSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Activity } from "@prisma/client"
import { revalidatePath } from "next/cache"


type NewActivityProps = {
    activity?:Activity
}

const NewActivity = ({activity}:NewActivityProps) => {

  async function createActivity(data:FormData){
    'use server'

    const user = await getUserSession()
    console.log(user);
    
    const activity = await prisma.activity.create({
      data: {
        user: {connect:{id:user.id}},
        tenant: {connect:{id:user.tenant.id}},
        name: data.get('name') as string,
        startAt: new Date(),
      
      }
    })
      revalidatePath('/track')
  }

  return (
    <div>
      <h2>What are you working on ?</h2>

      <form action={createActivity}>
        <div className="flex items-center mx-auto space-x-4">
        <Input name="name" type="text" defaultValue={activity?.name || ''}/>
        <Button type="submit" value="submit">Start</Button>
        </div>
      </form>
      
    </div>
  )
}

export default async function TrackTimePage() {

  const user = await getUserSession()

  
  const currentActivity = await prisma.activity.findFirst({
    where: {
      tenantId:user.tenantId,
      userId:user.id,     
      endAt:null
    }
  })

  return (
    <main  className="container py-4">
      <NewActivity/>
    </main>
  )
}
