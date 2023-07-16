'use client'

import { Input } from "@/components/ui/input"
import { Activity } from "@prisma/client"
import { useState } from "react"
import { updateActivity } from "./actions"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { pad } from "@/utils/pad"



type Props = {
    activity:Activity
}


type EditItemProps = Props & {
    onSave:() => void
}

type EditDayTimeProps = {
    value:Date
    onChange:(date:Date) => void
}

const EditDayTime = ({value,onChange}:EditDayTimeProps) => {

    const [date,setDate] = useState(value)

    return (
        <div>
            <div className="relative">
                <Input type="time" value={`${pad(date.getHours())}:${pad(date.getMinutes())}`} name="time" 
                onChange={(e) => {
                    const [hours,minutes] = e.target.value.split(':');
                    const newDate = new Date(date);
                    newDate.setHours(parseInt(hours))
                    newDate.setMinutes(parseInt(minutes))
                    setDate(newDate);
                    onChange(newDate);

                }}
                />
                <Calendar size={16} className="absolute"/>
            </div>      
        </div>
    )
}


const EditItem = ({activity, onSave}:EditItemProps) => {
    return (
        <li className="py-2 flex items-center">
            <form action={async(data) => {
                await updateActivity(data)
                onSave()
            }}>
                <Input type="text" name="name" defaultValue={activity.name || ''}/>
                <EditDayTime value={activity.startAt} onChange={() => {}}/>
                <Button type="submit">Save</Button>
            </form>
        </li>
    )
}


export const ReadItemRow = ({activity}:Props) => {

    return (
    <li className="py-2 flex items-center">
            <span className="w-1/2">{activity.name}</span>

            <span className=" ml-12">
              {new Intl.DateTimeFormat(undefined,{
                hour:"numeric",
                minute:"numeric"
              }).format(activity.startAt)}
            </span>

            ----------
            
            <span>
              {new Intl.DateTimeFormat(undefined,{
                hour:"numeric",
                minute:"numeric"
              }).format(activity.endAt || new Date())}
            </span>
            </li>
    )
}


export default function ActivityItem({activity}:Props) {

    const [isEditing, setIsEditing] = useState(false)


    return isEditing ? (
        <EditItem activity={activity} onSave={() => setIsEditing(false)}/>
    ):(
        <>
        <ReadItemRow activity={activity}/>
        <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
    )
}


