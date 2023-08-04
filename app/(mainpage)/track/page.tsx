import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getUserSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Activity, Client, Project } from "@prisma/client"
import { revalidatePath } from "next/cache"
import Duration from "./duration"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import ActivityItem from "./activity-item"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, FolderGit2, PersonStanding, Play, ProjectorIcon, StopCircle } from "lucide-react"
import CalendarView from "./calendar"



type NewActivityProps = {
    activity?:Activity | null
    clients:Client[]
    projects:Project[]
}

const NewActivity = ({activity,clients,projects}:NewActivityProps) => {

  async function upsertActivity(data:FormData){
    'use server'

    const user = await getUserSession()
    console.log(user);
    
      const client = data.get('client') as string
      const project = data.get('project') as string

     await prisma.activity.upsert({
      where: {
        id:data.get('id') as string,
      },
      create: {
        user: {connect:{id:user.id}},
        tenant: {connect:{id:user.tenant.id}},
        name: data.get('name') as string,
        startAt: new Date(),
       client: !!client ? {connect:{id:client}} : undefined,
       project: !!project ? {connect:{id:project}} : undefined,
      },
      update: {
        name: data.get('name') as string,
        client: !!client ? {connect:{id:client}} : undefined,
        project: !!project ? {connect:{id:project}} : undefined,
      }
    })
      revalidatePath('/track')
  }

  async function stopActivity(data:FormData) {
    'use server'

    const client = data.get('client') as string
    const project = data.get('project') as string
    
    await prisma.activity.update({
      where: {
        id:data.get('id') as string
      },
      data: {
        endAt:new Date(),
        name: data.get('name') as string,
        client: !!client ? {connect:{id:client}} : undefined,
        project: !!project ? {connect:{id:project}} : undefined,
      }
    })

    revalidatePath('/track')

  }

  return (
    <div>
      <form action={activity ? stopActivity : upsertActivity} className="">
        <div className="flex items-center space-x-4">
        <Input name="name" type="text" defaultValue={activity?.name || ''}/>
        <input type="hidden" name="id" defaultValue={activity?.id || ''}/>

        <Button type="submit" value="submit">{activity ? <StopCircle/>: <Play />}</Button>

        {activity && ( <Duration startAt={activity.startAt}/>)} 
        <Select name="client">
                        <SelectTrigger className="w-[100px]">
                          <PersonStanding size={32}/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Client</SelectLabel>
                            <SelectItem value="">None</SelectItem>
                                {clients.map((client) => (
                                      <SelectItem value={client.id} key={client.id}>{client.name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                        </Select>

                        <Select name="project">
                        <SelectTrigger className="w-[100px]">
                        <FolderGit2 size={32}/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Project</SelectLabel>
                            <SelectItem value="">None</SelectItem>
                                {projects.map((project) => (
                                      <SelectItem value={project.id} key={project.id}>{project.name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                        </Select>




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

  const clients= await prisma.client.findMany({
    where: {
      tenantId:user.tenant.id
    }
  })
  
  const projects = await prisma.project.findMany({
    where: {
      tenantId:user.tenant.id
    }
  })
  
  
  
  const currentActivity = await prisma.activity.findFirst({

    where: {
      tenantId:user.tenant?.id,
      userId:user.id,     
      endAt:null
    }
  })

  const now = new Date();
  const startOfToday =  new Date(now.getFullYear(),now.getMonth(),now.getDate())
  const endOfToday =  new Date(now.getFullYear(),now.getMonth(),now.getDate(),23,59,59)


  const dailyActivities = await prisma.activity.findMany({
    where: {
      tenantId:user.tenant.id,
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
    <main  className="">
      <div className="shadow-md w-full py-4 px-4">
        <NewActivity activity={currentActivity} projects={projects} clients={clients}/>
      </div>
  
      {/* <DailyActivities activities={dailyActivities}/> */}
      <CalendarView endedActivities={dailyActivities}/>
    </main>
  )
}