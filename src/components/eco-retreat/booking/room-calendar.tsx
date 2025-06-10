"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { useRoom } from "~/hooks/use-room";
import { useState, useCallback, useMemo, useEffect } from "react";
import React, { memo } from "react";
import { useRouter } from "next/navigation";

dayjs.extend(isBetween);

type BlockDateProps = {
  startDate: string;
  endDate: string;
};

type ComponentProps = {
  room: RoomProps;
};

interface DateRange {
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
}

interface DateTemplateProps {
  date: dayjs.Dayjs | null;
  dateRange: DateRange;
  isDateBlocked: (date: dayjs.Dayjs) => boolean | undefined;
  getPrice: (date: dayjs.Dayjs) => number;
  handleDateClick: (date: dayjs.Dayjs) => void;
}

// Skeleton component for loading state
const DateSkeleton = memo(() => (
  <div className="aspect-square min-h-16 animate-pulse border border-gray-200 bg-gray-50 p-2">
    <div className="mb-2 h-4 rounded bg-gray-300"></div>
    <div className="h-3 w-2/3 rounded bg-gray-300"></div>
  </div>
));

DateSkeleton.displayName = "DateSkeleton";

const DateTemplate: React.FC<DateTemplateProps> = memo(
  ({ date, dateRange, isDateBlocked, getPrice, handleDateClick }) => {
    if (!date) {
      return (
        <div className="aspect-square min-h-16 border border-gray-200 bg-gray-50" />
      );
    }

    const isPast = date.isBefore(dayjs(), "day");
    const price = getPrice(date);
    const isBlocked = isDateBlocked(date);
    const hasNoPrice = price === 0;
    const isDisabled = isPast || (isBlocked ?? false) || hasNoPrice;

    const isSelected =
      ((dateRange.startDate && date.isSame(dateRange.startDate, "day")) ??
        false) ||
      (dateRange.endDate && date.isSame(dateRange.endDate, "day"));
    const isInSelectedRange =
      dateRange.startDate && dateRange.endDate
        ? date.isBetween(dateRange.startDate, dateRange.endDate, "day", "()")
        : false;
    const isCurrentMonth =
      date.month() === dayjs().month() && date.year() === dayjs().year();

    return (
      <button
        type="button"
        className={cn(
          "relative aspect-square min-h-16 border p-2 transition-all duration-200",
          "flex flex-col items-center justify-center text-sm",

          // Base styles
          "border-gray-200 bg-white",

          // Text colors based on state
          isCurrentMonth ? "text-gray-900" : "text-gray-400",

          // Disabled states
          isDisabled && "cursor-not-allowed opacity-50",
          isPast && "bg-gray-100",
          ((isBlocked ?? false) || hasNoPrice) &&
            "border-red-200 bg-red-100 text-red-600",

          // Selected states
          isSelected && "border-primary bg-primary font-semibold text-white",
          isInSelectedRange && "border-primary/30 bg-primary/20 text-primary",

          // Interactive states - avoid hover effects on selected dates
          !isDisabled &&
            !isSelected &&
            "cursor-pointer hover:border-primary hover:bg-gray-50 hover:shadow-sm",
          !isDisabled && isSelected && "cursor-pointer",

          // Focus styles
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
        )}
        disabled={isDisabled}
        onClick={() => !isDisabled && handleDateClick(date)}
      >
        <span
          className={cn(
            "mb-1 text-base font-medium",
            isSelected && "text-white",
          )}
        >
          {date.date()}
        </span>

        {/* Show price only if available and not disabled */}
        {!isDisabled && price > 0 && (
          <span
            className={cn(
              "text-xs font-medium",
              isSelected ? "text-white" : "text-gray-600",
              isInSelectedRange ? "text-primary" : "",
            )}
          >
            ${price}
          </span>
        )}

        {/* Show blocking reason */}
        {isBlocked && !isPast && (
          <span className="text-xs font-medium text-red-500">Blocked</span>
        )}

        {/* Show no rate for dates with zero price */}
        {hasNoPrice && !isPast && !isBlocked && (
          <span className="text-xs font-medium text-red-500">No Rate</span>
        )}
      </button>
    );
  },
);

DateTemplate.displayName = "DateTemplate";

// Calendar skeleton component
const CalendarSkeleton = memo(() => (
  <div className="w-full space-y-4">
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 lg:p-8">
      <div className="mb-4 sm:mb-6">
        <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-300"></div>
        <div className="h-3 w-48 animate-pulse rounded bg-gray-300"></div>
      </div>

      <div className="space-y-4 rounded-lg bg-gray-50 p-3 sm:p-4">
        {/* Header skeleton */}
        <div className="mb-6 flex items-center justify-between">
          <div className="h-10 w-24 animate-pulse rounded bg-gray-300"></div>
          <div className="h-8 w-32 animate-pulse rounded bg-gray-300"></div>
          <div className="h-10 w-24 animate-pulse rounded bg-gray-300"></div>
        </div>

        {/* Calendar grid skeleton */}
        <div className="space-y-2">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-8 animate-pulse rounded bg-gray-300" />
            ))}
          </div>

          {/* Calendar days */}
          {Array.from({ length: 6 }).map((_, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <DateSkeleton key={dayIndex} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
));

CalendarSkeleton.displayName = "CalendarSkeleton";

export const RoomCalendar = ({ room }: ComponentProps) => {
  const router = useRouter();
  const { roomData, setDateRange, clearDates, setTotalPrice, setDuration } =
    useRoom();
  const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs>(
    dayjs().startOf("month"),
  );
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const dateRange: DateRange = {
    startDate: roomData.startDate ? dayjs(roomData.startDate) : null,
    endDate: roomData.endDate ? dayjs(roomData.endDate) : null,
  };

  const [blockDates] =
    api.ecoretreact.getBlockDateByRoomIdAndQuantity.useSuspenseQuery({
      roomId: room.roomId,
      quantity: roomData.quantity,
    });

  const pricesData = api.ecoretreact.getPricesWithRoomRateId.useQuery(
    { roomRateId: roomData.rrpId ?? "" },
    { enabled: !!roomData.rrpId },
  );

  const goToPreviousMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  const currentMonthDays: (dayjs.Dayjs | null)[][] = useMemo(() => {
    const firstDay = currentMonth.clone().startOf("month").day();
    const daysInMonth = currentMonth.daysInMonth();
    const emptyDaysBefore: (dayjs.Dayjs | null)[] = Array(firstDay).fill(
      null,
    ) as (dayjs.Dayjs | null)[];
    const currentMonthDays: dayjs.Dayjs[] = Array.from(
      { length: daysInMonth },
      (_, i) => currentMonth.clone().date(i + 1),
    );
    const calendarGrid: (dayjs.Dayjs | null)[] = [
      ...emptyDaysBefore,
      ...currentMonthDays,
    ];
    const weekGrid: (dayjs.Dayjs | null)[][] = [];
    const chunkSize = 7;
    for (let i = 0; i < calendarGrid.length; i += chunkSize) {
      weekGrid.push(calendarGrid.slice(i, i + chunkSize));
    }
    return weekGrid;
  }, [currentMonth]);

  const isDateBlocked = useCallback(
    (date: dayjs.Dayjs): boolean => {
      if (!blockDates || blockDates.length === 0) return false;

      return blockDates.some((blockDate: BlockDateProps) => {
        const blockStart = dayjs(blockDate.startDate);
        const blockEnd = dayjs(blockDate.endDate);
        return date.isBetween(blockStart, blockEnd, "day", "[]");
      });
    },
    [blockDates],
  );

  const getPrice = useCallback(
    (date: dayjs.Dayjs): number => {
      if (pricesData.data?.roomprices) {
        const priceEntry = pricesData.data.roomprices.find((data) =>
          date.isBetween(
            dayjs(data.startDate),
            dayjs(data.endDate),
            "day",
            "[]",
          ),
        );
        return priceEntry?.price ?? 0;
      }
      return 0;
    },
    [pricesData.data],
  );

  const isRangeValid = useCallback(
    (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
      let currentDate = start.clone();
      while (currentDate.isBefore(end) || currentDate.isSame(end, "day")) {
        if (isDateBlocked(currentDate) || getPrice(currentDate) === 0) {
          return false;
        }
        currentDate = currentDate.add(1, "day");
      }
      return true;
    },
    [isDateBlocked, getPrice],
  );

  const isDateDisabled = useCallback(
    (date: dayjs.Dayjs) => {
      return (
        date.isBefore(dayjs(), "day") ||
        isDateBlocked(date) ||
        getPrice(date) === 0
      );
    },
    [isDateBlocked, getPrice],
  );

  const totalNights = useMemo(() => {
    if (!roomData.startDate || !roomData.endDate) {
      return 0;
    }
    return dayjs(roomData.endDate).diff(dayjs(roomData.startDate), "day");
  }, [roomData.startDate, roomData.endDate]);

  const totalPrice = useMemo(() => {
    if (!roomData.startDate || !roomData.endDate) {
      return 0;
    }

    let total = 0;
    let currentDate = dayjs(roomData.startDate).clone();
    const endDate = dayjs(roomData.endDate);

    while (currentDate.isBefore(endDate, "day")) {
      total += getPrice(currentDate);
      currentDate = currentDate.add(1, "day");
    }

    return total * roomData.quantity;
  }, [roomData.startDate, roomData.endDate, getPrice, roomData.quantity]);

  useEffect(() => {
    setDuration(totalNights);
  }, [totalNights, setDuration]);

  useEffect(() => {
    setTotalPrice(totalPrice);
  }, [totalPrice, setTotalPrice]);

  const handleDateClick = useCallback(
    (date: dayjs.Dayjs) => {
      if (isDateDisabled(date)) {
        return;
      }

      const clickedDate = date.format("YYYY-MM-DD");

      if (!roomData.startDate) {
        setDateRange(clickedDate, null);
        return;
      }

      if (roomData.startDate && !roomData.endDate) {
        const startDateObj = dayjs(roomData.startDate);

        if (date.isBefore(startDateObj)) {
          setDateRange(clickedDate, null);
        } else if (date.isSame(startDateObj, "day")) {
          setDateRange(null, null);
        } else {
          if (isRangeValid(startDateObj, date)) {
            setDateRange(roomData.startDate, clickedDate);
          } else {
            setDateRange(clickedDate, null);
          }
        }
        return;
      }

      if (roomData.startDate && roomData.endDate) {
        const startDateObj = dayjs(roomData.startDate);
        const endDateObj = dayjs(roomData.endDate);

        if (
          date.isSame(startDateObj, "day") ||
          date.isSame(endDateObj, "day")
        ) {
          setDateRange(null, null);
        } else {
          setDateRange(clickedDate, null);
        }
        return;
      }
    },
    [
      roomData.startDate,
      roomData.endDate,
      setDateRange,
      isDateDisabled,
      isRangeValid,
    ],
  );

  if (pricesData.isLoading || !roomData.rrpId) {
    return <CalendarSkeleton />;
  }

  return (
    <div className="w-full space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 lg:p-8">
        <div className="mb-4 sm:mb-6">
          <h2 className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-primary/70">
            Select Dates
          </h2>
          <p className="text-sm text-gray-500">
            Choose your check-in and check-out dates
          </p>
        </div>

        <div className="space-y-4 rounded-lg bg-gray-50 p-3 sm:p-4">
          <div className="mb-6 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={goToPreviousMonth}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <h3 className="text-xl font-bold text-gray-700">
              {currentMonth.format("MMMM YYYY")}
            </h3>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={goToNextMonth}
              aria-label="Next month"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-7 gap-2">
              {weekdays.map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-sm font-semibold text-gray-700"
                >
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day.charAt(0)}</span>
                </div>
              ))}
            </div>

            {currentMonthDays.map((week, index) => (
              <div key={index} className="grid grid-cols-7 gap-2">
                {week.map((date, dateIndex) => (
                  <DateTemplate
                    key={dateIndex}
                    date={date}
                    dateRange={dateRange}
                    isDateBlocked={isDateBlocked}
                    getPrice={getPrice}
                    handleDateClick={handleDateClick}
                  />
                ))}
              </div>
            ))}
          </div>

          {roomData.startDate && (
            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium text-gray-700">
                    {roomData.endDate ? "Selected Dates:" : "Check-in Date:"}
                  </span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                    {dayjs(roomData.startDate).format("MMM D, YYYY")}
                  </span>
                  {roomData.endDate && (
                    <>
                      <span className="text-gray-500">to</span>
                      <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                        {dayjs(roomData.endDate).format("MMM D, YYYY")}
                      </span>
                    </>
                  )}
                  {roomData.endDate && totalNights > 0 && (
                    <>
                      <span className="rounded-full bg-green-100 px-3 py-1 font-medium text-green-700">
                        {totalNights} nights
                      </span>
                      <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700">
                        Total: ${totalPrice}
                      </span>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={clearDates}
                  className="text-sm"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={clearDates}
              className="flex-1"
              disabled={!roomData.startDate}
            >
              Reset
            </Button>
            <Button
              type="button"
              className="flex-1"
              disabled={!roomData.startDate || !roomData.endDate}
              onClick={() => {
                router.push(`/eco-retreat/booking?roomId=${room.roomId}`);
              }}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};