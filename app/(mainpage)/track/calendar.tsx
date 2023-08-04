'use client'

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import MyCalendar from 'react-big-calendar';

const localizer = momentLocalizer(moment)

import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Activity } from '@prisma/client';
import { useState } from 'react';



function eventStyleGetter(event:any, start:any, end:any, isSelected:any) {
  console.log(event);
  var backgroundColor = ''
  var style = {
      backgroundColor: backgroundColor,
      borderRadius: '10px',
      opacity: 1,
      color: 'white',
      border: '0px',
      display: 'block'
  };
  return {
      style: style
  };
}


interface Props {
    endedActivities: Activity[]
}

export default function CalendarView({endedActivities}:Props) {

  const [openModal,setOpenModal] = useState(false)


    const events = endedActivities.map((activity) => ({
        title: activity.name,
        start: new Date(activity.startAt),
        end:new Date(activity.endAt as unknown as string)
      }));


      const eventStart = events.map((item) => item.start)


  return (
    <div className='text-white'>
    <Calendar
      events={events}
      localizer={localizer}
      startAccessor="start"
      endAccessor="end"
      defaultView='month'
      style={{ height: 700, }}
      titleAccessor="title"
      className='text-white'
      onSelectSlot={() => setOpenModal(true)}
      eventPropGetter={(eventStyleGetter)}
    components={{
      toolbar:CustomToolbar
    }}
    />
    </div>
  )
}





type CustomToolBar = {
  label:string,
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void,
  onView: (view: 'week' | 'day' | 'agenda' | 'month' ) => void,

}

const CustomToolbar = ({ label, onNavigate,onView }:CustomToolBar) => {
  const navigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    onNavigate(action);
  }
  const view = (view: 'week' | 'day' | 'agenda' | 'month' ) => {
    onView(view);
  }

  return (
    <div className="rbc-toolbar px-12">
        <span className="rbc-btn-group">
        <button type="button" onClick={() => navigate('PREV')}>Back</button>
        <button type="button" onClick={() => navigate('TODAY')}>Today</button>
        <button type="button" onClick={() => navigate('NEXT')}>Next</button>
      </span>
      <span className="rbc-toolbar-label">{label}</span>
      <span className="rbc-btn-group">
        <button type="button" onClick={() => view('day')}>Day</button>
        <button type="button" onClick={() => view('week')}>Week</button>
        <button type="button" onClick={() => view('month')}>Month</button>
        <button type="button" onClick={() => view('agenda')}>Agenda</button>
      </span>
    </div>
  );
}
