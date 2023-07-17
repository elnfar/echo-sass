'use client'

import { Input } from "@/components/ui/input"
import { Activity } from "@prisma/client"
import { useState } from "react"
import { updateActivity } from "./actions"
import { Button } from "@/components/ui/button"

import { pad } from "@/utils/pad"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"



type Props = {
    activity:Activity
}


type EditItemProps = Props & {
    onSave:() => void
}

type EditDayTimeProps = {
    name?:string
    value:Date
    onChange?:(date:Date) => void
}


const EditDayTime = ({value,name,onChange}:EditDayTimeProps) => {

    const [date,setDate] = useState(value)


        const onDate = (d:Date | undefined) => {
            if(!d) return
            d.setHours(date.getHours())
            d.setMinutes(date.getMinutes())
            d.setSeconds(date.getSeconds())
            setDate(d)
            onChange && onChange(d);
            console.log(date,d);
            
        }

    return (
        <div>
            <div className="relative">
                <input type="hidden" name={name} defaultValue={date.toISOString()}/>
                <Input type="time" value={`${pad(date.getHours())}:${pad(date.getMinutes())}`}
                onChange={(e) => {
                    const [hours,minutes] = e.target.value.split(':');
                    const newDate = new Date(date);
                    newDate.setHours(parseInt(hours) || 0)
                    newDate.setMinutes(parseInt(minutes) || 0)
                    setDate(newDate);
                    onChange && onChange(newDate);

                }}
                />

                <Popover>
                    <PopoverTrigger>
                        <CalendarIcon size={16} className="absolute"/>
                    </PopoverTrigger>
                <PopoverContent>
                    <Calendar
                    mode="single"
                    selected={date}
                    onSelect={onDate}
                    />
                </PopoverContent>
                </Popover>
                
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
                <EditDayTime name="startAt" value={activity.startAt} />
                <EditDayTime name="endAt" value={activity.endAt || new Date()} />

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


