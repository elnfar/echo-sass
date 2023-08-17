'use client'
import { Activity } from "@prisma/client";
import  dayjs  from  "dayjs";
import { useState } from  "react";
import { ReactFullYearScheduler } from "react-full-year-scheduler";
import  "react-full-year-scheduler/dist/style.css";

function  Calendar() {
    
    


const [events, setEvents] =  useState<any[]>([



{
    
	eventName: "event 1",
	startDate: dayjs(),
	endDate: dayjs("2023-02-01"),
	eventBgColor: "#ff5f4c",
	eventTextColor: "white",
},
{
	eventName: "event 2",
	startDate: dayjs("2023-04-01"),
	endDate: dayjs("2023-04-30"),
	eventBgColor: "",
	eventTextColor: "white",
},
{
	eventName: "event 3",
	startDate: dayjs("2023-05-01"),
	endDate: dayjs("2023-05-29"),
	eventBgColor: "green",
	eventTextColor: "white",
	},
]);



return (
<div>
<ReactFullYearScheduler
	events={events}
	locale="en"
	dateTooltipTheme="material"
	weekSeparatorWidth={10}
	weekSeparatorColor="white"
	headerWeekDayBgColor="#b39cd0"
	headerWeekendBgColor="rgba(75, 68, 83, 0.69)"
	weekendCellBackgroundColor="rgba(75, 68, 83, 0.69)"
	weekendCellTextColor="white"
	weekDayCellBackgroundColor="rgba(75, 68, 83, 0.69)"
	weekDayCellTextColor="white"
	selectionColor="black"
	selectionTextColor="white"
	maxRangeSelection={20}
	minRangeSelection={10}
	firstDayOfWeek="Monday"
	maxYear={2024}
	minYear={2020}
	readonlyCalendar={false}
	showWeekSeparator={true}
	showTodayButton={true}
	enableYearToYearSelection={false}
	enableWeekendSelection={true}
	minCellWidth={50}
	showSeparatorInHeader={false}
	enableEventOverwriting={true}
	onDatePick={(eventDate, clearSelectedCell) => {
	console.log(eventDate.toDate());
	}}
	onEventSinglePickInterception={(date, eventName, clearSelectedCell) => {
	console.table([eventName, date.toDate()]);
	}}
	onRangePick={(
	eventStartDate,
	eventEndDate,
	clearSecondSelectedCell,
	clearSelection
	) => {
	setTimeout(() => {
	clearSelection();
	}, 3000);
	}}

	onEventRangePickInterception={(
	eventFirstDate,
	eventLastDate,
	eventsToBeDeleted,
	eventsToBeUpdated,
	clearSecondSelectedCell,
	clearSelection
	) => {
	setTimeout(() => {
	clearSelection();
	}, 3000);
	}}
/>
</div>
);
}
export  default  Calendar;