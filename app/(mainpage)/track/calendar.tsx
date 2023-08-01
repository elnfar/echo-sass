'use client'

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
const localizer = momentLocalizer(moment)

import 'react-big-calendar/lib/css/react-big-calendar.css';

import { useState } from 'react';
import { Activity } from '@prisma/client';



interface Props {
    endedActivities: Activity[]
}

export default function CalendarView({endedActivities}:Props) {

    const events = endedActivities.map((activity) => ({
        title: activity.name,
        start: new Date(activity.startAt),
        end:new Date(activity.endAt as unknown as string)
      }));

  return (
    <div>
    <Calendar
        events={events}
      localizer={localizer}
      startAccessor="start"
      endAccessor="end"
      defaultView='month'
      style={{ height: 550 }}
      titleAccessor="title"
    />
    </div>
  )
}
