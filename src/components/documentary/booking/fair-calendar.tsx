"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import dayjs, { type Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import weekday from "dayjs/plugin/weekday";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { useFairEvent } from "~/hooks/use-fair";

dayjs.extend(isBetween);
dayjs.extend(weekday);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface CalendarDay {
  date: Dayjs;
  isCurrentMonth: boolean;
  isDisabled: boolean;
}

const weekDays: readonly string[] = [
  "Su",
  "Mo",
  "Tu",
  "We",
  "Th",
  "Fr",
  "Sa",
] as const;

export const FairCalendar = () => {
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const { fairEvent, setDate } = useFairEvent();

  const generateCalendarDays = (date: Dayjs): CalendarDay[] => {
    const firstDayOfMonth = date.startOf("month");
    const lastDayOfMonth = date.endOf("month");
    const startDay = firstDayOfMonth.day(); // Get day of week (0-6)
    const daysInMonth = date.daysInMonth();
    const currentDate = dayjs(); // For comparing with today

    const days: CalendarDay[] = [];

    // Previous month's days
    for (let i = 0; i < startDay; i++) {
      const prevDate = firstDayOfMonth.subtract(startDay - i, "day");
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        isDisabled: true, // Always disable previous month's days
      });
    }

    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDayDate = firstDayOfMonth.add(i - 1, "day");
      
      // For fair events, check if the date is within the event period
      let isDisabled = currentDayDate.isBefore(currentDate, "day"); // Disable if date is before today
      
      if (fairEvent.event) {
        const eventStart = dayjs(fairEvent.event.startDate);
        const eventEnd = dayjs(fairEvent.event.endDate);
        
        // Only enable dates that fall within the event period
        if (!isDisabled && !currentDayDate.isBetween(eventStart, eventEnd, 'day', '[]')) {
          isDisabled = true;
        }
      }
      
      days.push({
        date: currentDayDate,
        isCurrentMonth: true,
        isDisabled: isDisabled,
      });
    }

    // Next month's days to complete the calendar grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = lastDayOfMonth.add(i, "day");
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        isDisabled: true,
      });
    }

    return days;
  };

  const handleDateClick = (day: CalendarDay) => {
    if (day.isDisabled) return;

    // Set selected date
    setDate(day.date.format("YYYY-MM-DD"));
  };

  const isDateSelected = (date: Dayjs): boolean => {
    return date.format("YYYY-MM-DD") === fairEvent.date;
  };

  const nextMonth = (): void => setCurrentDate(currentDate.add(1, "month"));
  const prevMonth = (): void => setCurrentDate(currentDate.subtract(1, "month"));

  const renderCalendarMonth = (date: Dayjs) => (
    <div className="w-full">
      <h2 className="mb-4 text-center font-heading text-base font-extrabold text-gray-900">
        {date.format("MMMM YYYY")}
      </h2>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="mb-1 text-center text-sm font-bold text-primary"
          >
            {day}
          </div>
        ))}

        {generateCalendarDays(date).map((day, index) => {
          const isSelected = isDateSelected(day.date);

          return (
            <Button
              type="button"
              key={index}
              onClick={() => handleDateClick(day)}
              disabled={day.isDisabled}
              variant={isSelected ? "default" : "outline"}
              className={`h-12 w-full ${
                day.isCurrentMonth 
                  ? "" 
                  : "opacity-40"
              } ${
                isSelected
                  ? "bg-primary text-white hover:bg-primary/90"
                  : ""
              }`}
            >
              {day.date.date()}
            </Button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {fairEvent.date && fairEvent.event && (
        <div className="mb-8 space-y-4 rounded-lg border bg-secondary/5 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-secondary">Selected Fair Event</h3>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Event:</span>
            <span className="font-medium text-secondary">
              {fairEvent.event.title}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Location:</span>
            <span className="font-medium">
              {fairEvent.event.vanue}, {fairEvent.event.location}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Selected Date:</span>
            <span className="font-medium">
              {dayjs(fairEvent.date).format("MMM D, YYYY")}
            </span>
          </div>
        </div>
      )}
      
      {!fairEvent.event && (
        <div className="mb-8 rounded-lg border bg-amber-50 p-4 text-amber-800">
          <p className="text-center">Please select a fair event first to continue with registration.</p>
        </div>
      )}
      
      {fairEvent.event && (
        <>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={prevMonth}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-medium">Select Date</h3>
            <Button
              variant="outline"
              size="icon"
              onClick={nextMonth}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2">
            {renderCalendarMonth(currentDate)}
            {renderCalendarMonth(currentDate.add(1, "month"))}
          </div>
        </>
      )}
    </>
  );
};