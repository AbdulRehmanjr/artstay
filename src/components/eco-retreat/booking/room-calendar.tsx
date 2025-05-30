"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";


export const RoomCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs>(
    dayjs().startOf("month")
  );
  const [nextMonth, setNextMonth] = useState<dayjs.Dayjs>(
    dayjs().add(1, "month").startOf("month")
  );
  const [hoverDate, setHoverDate] = useState<dayjs.Dayjs | null>(null);
  const [selectingStart, setSelectingStart] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add listener for resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Navigate both months together
  const goToPreviousMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
    setNextMonth(nextMonth.subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
    setNextMonth(nextMonth.add(1, "month"));
  };

  // Generate calendar days for a specific month
  const generateMonthDays = (month: dayjs.Dayjs) => {
    const firstDayOfMonth = month.startOf("month");
    const lastDayOfMonth = month.endOf("month");
    const startOfCalendar = firstDayOfMonth.startOf("week");
    const endOfCalendar = lastDayOfMonth.endOf("week");

    const calendarDays: dayjs.Dayjs[] = [];
    let day = startOfCalendar;

    while (day.isBefore(endOfCalendar) || day.isSame(endOfCalendar, "day")) {
      calendarDays.push(day);
      day = day.add(1, "day");
    }

    return calendarDays;
  };

  const handleDateClick = (date: dayjs.Dayjs) => {
    // Prevent selecting dates in the past
    if (date.isBefore(dayjs(), "day")) {
      return;
    }

    if (selectingStart) {
      onStartDateChange(date.toDate());
      if (endDate && date.isAfter(dayjs(endDate))) {
        onEndDateChange(date.add(1, "day").toDate());
      }
      setSelectingStart(false);
    } else {
      // Make sure end date is not before start date
      if (startDate && date.isBefore(dayjs(startDate))) {
        onStartDateChange(date.toDate());
        onEndDateChange(dayjs(startDate).toDate());
      } else {
        onEndDateChange(date.toDate());
      }
      setSelectingStart(true);
    }
  };

  const isInRange = (date: dayjs.Dayjs) => {
    if (!startDate || !endDate) return false;

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (!selectingStart && hoverDate) {
      return (
        (date.isAfter(start, "day") || date.isSame(start, "day")) &&
        (date.isBefore(hoverDate, "day") || date.isSame(hoverDate, "day"))
      );
    }

    return (
      (date.isAfter(start, "day") || date.isSame(start, "day")) &&
      (date.isBefore(end, "day") || date.isSame(end, "day"))
    );
  };

  const isStartDate = (date: dayjs.Dayjs) => {
    return startDate ? date.isSame(dayjs(startDate), "day") : false;
  };

  const isEndDate = (date: dayjs.Dayjs) => {
    return endDate ? date.isSame(dayjs(endDate), "day") : false;
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const shortWeekdays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="p-2 sm:p-4">
      <div className="flex flex-col md:grid md:grid-cols-2 md:gap-10 lg:gap-40">
        {/* First Month */}
        <div className="mb-6 md:mb-0">
          <div className="flex items-center justify-between mb-4">
            <Button
              type="button"
              size="icon"
              onClick={goToPreviousMonth}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <h2 className="text-base sm:text-lg font-semibold text-center">
              {currentMonth.format("MMMM YYYY")}
            </h2>
            {/* On mobile, we need next button for first month too */}
            {isMobile && (
              <Button
                type="button"
                size="icon"
                onClick={goToNextMonth}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 md:hidden"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
            {/* Empty div to maintain flex layout on desktop */}
            {!isMobile && <div className="w-7 sm:w-8"></div>}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Weekday headers */}
            {(isMobile ? shortWeekdays : weekdays).map((day, index) => (
              <div
                key={`first-${index}`}
                className="text-center text-xs sm:text-sm font-medium text-gray-500 p-1 sm:p-2"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {generateMonthDays(currentMonth).map((day) => {
              const isCurrentMonth = day.month() === currentMonth.month();
              const isToday = day.isSame(dayjs(), "day");
              const isPast = day.isBefore(dayjs(), "day");
              const isStart = isStartDate(day);
              const isEnd = isEndDate(day);
              const inRange = isInRange(day);

              return (
                <button
                  type="button"
                  key={`first-${day.format("YYYY-MM-DD")}`}
                  onClick={() => !isPast && handleDateClick(day)}
                  onMouseEnter={() => !selectingStart && setHoverDate(day)}
                  onMouseLeave={() => setHoverDate(null)}
                  disabled={isPast}
                  className={cn(
                    "relative p-1 sm:p-2 text-center rounded-md transition-colors text-sm sm:text-base md:text-lg",
                    isCurrentMonth ? "text-gray-900" : "text-gray-400",
                    isPast ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-100",
                    isToday && "border border-primary",
                    isStart && "bg-primary text-white hover:bg-primary",
                    isEnd && "bg-primary text-white hover:bg-primary",
                    inRange && !isStart && !isEnd && "bg-primary/10"
                  )}
                >
                  {day.date()}

                  {/* Start/End indicators */}
                  {(isStart || isEnd) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs">
                      •
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Second Month - Only show on larger screens or as needed */}
        {(!isMobile || currentMonth.month() !== nextMonth.month()) && (
          <div>
            <div className="flex items-center justify-between mb-4">
              {/* On mobile, this is an empty div to maintain layout */}
              {isMobile ? <div className="w-7 sm:w-8"></div> : null}
              <h2 className="text-base sm:text-lg font-semibold text-center">
                {nextMonth.format("MMMM YYYY")}
              </h2>
              <Button
                type="button"
                size="icon"
                onClick={goToNextMonth}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {/* Weekday headers */}
              {(isMobile ? shortWeekdays : weekdays).map((day, index) => (
                <div
                  key={`second-${index}`}
                  className="text-center text-xs sm:text-sm font-medium text-gray-500 p-1 sm:p-2"
                >
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {generateMonthDays(nextMonth).map((day) => {
                const isCurrentMonth = day.month() === nextMonth.month();
                const isToday = day.isSame(dayjs(), "day");
                const isPast = day.isBefore(dayjs(), "day");
                const isStart = isStartDate(day);
                const isEnd = isEndDate(day);
                const inRange = isInRange(day);

                return (
                  <button
                    type="button"
                    key={`second-${day.format("YYYY-MM-DD")}`}
                    onClick={() => !isPast && handleDateClick(day)}
                    onMouseEnter={() => !selectingStart && setHoverDate(day)}
                    onMouseLeave={() => setHoverDate(null)}
                    disabled={isPast}
                    className={cn(
                      "relative p-1 sm:p-2 text-center rounded-md transition-colors text-sm sm:text-base md:text-lg",
                      isCurrentMonth ? "text-gray-900" : "text-gray-400",
                      isPast ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-100",
                      isToday && "border border-primary",
                      isStart && "bg-primary text-white hover:bg-primary",
                      isEnd && "bg-primary text-white hover:bg-primary",
                      inRange && !isStart && !isEnd && "bg-primary/10"
                    )}
                  >
                    {day.date()}

                    {/* Start/End indicators */}
                    {(isStart || isEnd) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs">
                        •
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 p-2 sm:p-3 bg-gray-50 rounded-md">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <div>
            <span className="text-xs sm:text-sm font-medium">Selected:</span>
            <div className="text-xs sm:text-sm">
              {startDate
                ? dayjs(startDate).format("MMM D, YYYY")
                : "Select check-in"}{" "}
              -{" "}
              {endDate
                ? dayjs(endDate).format("MMM D, YYYY")
                : "Select check-out"}
            </div>
            {startDate && endDate && (
              <div className="text-xs text-gray-500">
                {dayjs(endDate).diff(dayjs(startDate), "day")} nights
              </div>
            )}
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => {
                onStartDateChange(null);
                onEndDateChange(null);
              }}
              className="text-xs sm:text-sm text-primary hover:underline px-2 py-1 h-auto sm:h-8"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}