'use client'

import { Input } from "@/components/ui/input"
import { Activity } from "@prisma/client"
import { useState } from "react"
import { updateActivity } from "./actions"
import { Button } from "@/components/ui/button"



type Props = {
    activity:Activity
}


type EditItemProps = Props & {
    onSave:() => void
}


const EditItem = ({activity, onSave}:EditItemProps) => {
    return (
        <li className="py-2 flex items-center">
            <form action={async(data) => {
                await updateActivity(data)
                onSave()
            }}>
                <Input type="text" name="name" defaultValue={activity.name || ''}/>
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


