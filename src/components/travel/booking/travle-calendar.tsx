"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import dayjs, { type Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import weekday from "dayjs/plugin/weekday";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { useRouter } from "next/navigation";
import { useTravel } from "~/hooks/use-travel";

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

export const TravelCalendar = () => {
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const { travelPackage, setPackage } = useTravel();
  const router = useRouter();

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
      days.push({
        date: currentDayDate,
        isCurrentMonth: true,
        isDisabled: currentDayDate.isBefore(currentDate, "day"), // Disable if date is before today
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

    const selectedDate = day.date.format("YYYY-MM-DD");
    
    // If the tour has a duration, we calculate the end date
    const endDate = travelPackage.tour 
      ? day.date.add(travelPackage.tour.duration - 1, "day").format("YYYY-MM-DD")
      : selectedDate;

    setPackage({
      startDate: selectedDate,
      endDate: endDate,
    });
  };

  const isDateSelected = (date: Dayjs): boolean => {
    if (!travelPackage.startDate) return false;
    
    const startDate = dayjs(travelPackage.startDate);
    const endDate = dayjs(travelPackage.endDate ?? travelPackage.startDate);
    
    return date.isSameOrAfter(startDate, 'day') && date.isSameOrBefore(endDate, 'day');
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
                day.isCurrentMonth ? "" : "opacity-40"
              } ${
                isSelected ? "bg-primary text-white hover:bg-primary/90" : ""
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
      {travelPackage.startDate && travelPackage.tour && (
        <div className="mb-8 space-y-4 rounded-lg border bg-secondary/5 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-secondary">
              Selected Travel Tour
            </h3>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              ${travelPackage.tour.price.toLocaleString()}
              {travelPackage.tour.isPricePerPerson ? ' per person' : ' per group'}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tour:</span>
            <span className="font-medium text-secondary">
              {travelPackage.tour.title}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Start Date:</span>
            <span className="font-medium">
              {dayjs(travelPackage.startDate).format("MMM D, YYYY")}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">End Date:</span>
            <span className="font-medium">
              {dayjs(travelPackage.endDate ??travelPackage.startDate).format("MMM D, YYYY")}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Duration:</span>
            <span className="font-medium">
              {travelPackage.tour.duration} days
            </span>
          </div>
        </div>
      )}

      {!travelPackage.tour && (
        <div className="mb-8 rounded-lg border bg-amber-50 p-4 text-amber-800">
          <p className="text-center">
            Please select a travel tour first to continue with booking.
          </p>
        </div>
      )}

      {travelPackage.tour && (
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
            <h3 className="text-lg font-medium">Select Start Date</h3>
            <Button
              variant="outline"
              size="icon"
              onClick={nextMonth}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-4 grid gap-8">
            {renderCalendarMonth(currentDate)}
          </div>
          <div className="mt-6">
            <Button
              type="button"
              className="w-full"
              disabled={!travelPackage.startDate}
              onClick={() => {
                router.push("/travel/booking");
              }}
            >
              Continue to Booking
            </Button>
          </div>
        </>
      )}
    </>
  );
};