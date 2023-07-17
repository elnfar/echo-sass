import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getUserSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Activity } from "@prisma/client"
import { revalidatePath } from "next/cache"
import Duration from "./duration"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import ActivityItem from "./activity-item"




type TimeProps = {
  startAt:string
}



type NewActivityProps = {
    activity?:Activity | null
}

const NewActivity = ({activity}:NewActivityProps) => {

  async function startActivity(data:FormData){
    'use server'

    const user = await getUserSession()
    console.log(user);
    
     await prisma.activity.create({
      data: {
        user: {connect:{id:user.id}},
        tenant: {connect:{id:user.tenant.id}},
        name: data.get('name') as string,
        startAt: new Date(),
      
      }
    })
      revalidatePath('/track')
  }

  async function stopActivity(data:FormData) {
    'use server'

    await prisma.activity.update({
      where: {
        id:data.get('id') as string
      },
      data: {
        endAt:new Date(),
        name: data.get('name') as string,
      }
    })

    revalidatePath('/track')

  }

  return (
    <div>
      <h2>What are you working on ?</h2>

      <form action={activity ? stopActivity : startActivity}>
        <div className="flex items-center space-x-4">
        <Input name="name" type="text" defaultValue={activity?.name || ''}/>
        <input type="hidden" name="id" defaultValue={activity?.id || ''}/>
        {activity && ( <Duration startAt={activity.startAt}/>)} 
        <Button type="submit" value="submit">{activity ? 'Stop':'Start'}</Button>
        </div>
      </form>
      
    </div>
  )
}

type DailyActivityProps = {
  activities:Activity[]
}


const DailyActivities = ({activities}:DailyActivityProps) => {
    return (
      <div className="py-12">
        <ul>
        {activities.map((activity) => (
         <ActivityItem activity={activity} key={activity.id}/>
        ))}
        </ul>
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

  const now = new Date();
  const startOfToday =  new Date(now.getFullYear(),now.getMonth(),now.getDate())
  const endOfToday =  new Date(now.getFullYear(),now.getMonth(),now.getDate(),23,59,59)


  const dailyActivities = await prisma.activity.findMany({
    where: {
      tenantId:user.tenantId,
      userId:user.id,     
     OR: [
      {
        startAt: {
          equals:startOfToday
        }
      },
      {
        endAt:{
          lte:endOfToday
        }
      }
     ]
    },
    orderBy: {
      startAt:"asc"
    }
  })
  return (
    <main  className="container py-4">
      <NewActivity activity={currentActivity}/>
      <DailyActivities activities={dailyActivities}/>
    </main>
  )
}