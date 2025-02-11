"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "~/components/ui/button";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import weekday from "dayjs/plugin/weekday";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isBetween);
dayjs.extend(weekday);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface DateRange {
  start: Dayjs | null;
  end: Dayjs | null;
}

interface CalendarDay {
  date: Dayjs;
  isCurrentMonth: boolean;
  isDisabled: boolean;
}

export const ArtisanCalendar = () => {
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    start: null,
    end: null,
  });

  const weekDays: readonly string[] = [
    "Su",
    "Mo",
    "Tu",
    "We",
    "Th",
    "Fr",
    "Sa",
  ] as const;

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

  const handleDateClick = (day: CalendarDay): void => {
    if (day.isDisabled) return;

    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({
        start: day.date,
        end: null,
      });
    } else {
      if (day.date.isBefore(selectedRange.start)) {
        setSelectedRange({
          start: day.date,
          end: selectedRange.start,
        });
      } else {
        setSelectedRange({
          start: selectedRange.start,
          end: day.date,
        });
      }
    }
  };

  const isDateInRange = (date: Dayjs): boolean => {
    if (!selectedRange.start || !selectedRange.end) return false;
    return date.isBetween(selectedRange.start, selectedRange.end, "day", "[]");
  };

  const isDateSelected = (date: Dayjs): boolean => {
    return Boolean(
      selectedRange.start?.isSame(date, "day") ||
        selectedRange.end?.isSame(date, "day"),
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
              className="w-[5rem] h-[5rem]"
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
    </>
  );
};
