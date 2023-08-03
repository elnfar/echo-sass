
import React from 'react'
import CalendarView from '../track/calendar'
import { prisma } from '@/lib/prisma'
import { getUserSession } from '@/lib/auth'

export default async function page() {

    const user = await getUserSession()
    
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
    <div>
        <CalendarView endedActivities={dailyActivities}/>
    </div>
  )
}
