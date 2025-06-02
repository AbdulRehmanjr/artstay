"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import dayjs, { type Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import weekday from "dayjs/plugin/weekday";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { usePackage } from "~/hooks/use-artisan";
import { useRouter } from "next/navigation";

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

export const ArtisanCalendar = () => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const { artisanPackage, setPackage } = usePackage();

  const generateCalendarDays = (date: Dayjs): CalendarDay[] => {
    const firstDayOfMonth = date.startOf("month");
    const lastDayOfMonth = date.endOf("month");
    const startDay = firstDayOfMonth.day();
    const daysInMonth = date.daysInMonth();
    const currentDate = dayjs();
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

    const startDate = day.date;
    const endDate = startDate.add(artisanPackage.duration - 1, "day");

    setPackage({
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
    });
  };

  const isDateInRange = (date: Dayjs): boolean => {
    if (!artisanPackage.startDate || !artisanPackage.endDate) return false;
    const start = dayjs(artisanPackage.startDate);
    const end = dayjs(artisanPackage.endDate);
    return date.isBetween(start, end, "day", "[]");
  };

  const isDateSelected = (date: Dayjs): boolean => {
    return (
      date.format("YYYY-MM-DD") === artisanPackage.startDate ||
      date.format("YYYY-MM-DD") === artisanPackage.endDate
    );
  };

  const nextMonth = (): void => setCurrentDate(currentDate.add(1, "month"));
  const prevMonth = (): void =>
    setCurrentDate(currentDate.subtract(1, "month"));

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
          const isInRange = isDateInRange(day.date);
          const isSelected = isDateSelected(day.date);

          return (
            <Button
              type="button"
              key={index}
              onClick={() => handleDateClick(day)}
              disabled={day.isDisabled}
              variant={isSelected || isInRange ? "default" : "outline"}
              className="h-[5rem] w-[5rem]"
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
      {artisanPackage.startDate && (
        <div className="mt-4 space-y-2 rounded-lg border bg-secondary/5 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Selected Period:</span>
            <span className="font-medium text-secondary">
              {artisanPackage.duration} Days
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Start Date:</span>
            <span className="font-medium">
              {dayjs(artisanPackage.startDate).format("MMM D, YYYY")}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">End Date:</span>
            <span className="font-medium">
              {dayjs(artisanPackage.endDate).format("MMM D, YYYY")}
            </span>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={prevMonth}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={nextMonth}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-8">
        {renderCalendarMonth(currentDate)}
        {renderCalendarMonth(currentDate.add(1, "month"))}
      </div>
      <div>
        <Button
          type="button"
          disabled={
            artisanPackage.startDate == "" || artisanPackage.endDate == ""
          }
          onClick={() => {
            router.push("/artisan/booking");
          }}
        >
          Continue
        </Button>
      </div>
    </>
  );
};
