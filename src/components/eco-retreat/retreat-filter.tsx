"use client";

import { useState, useEffect, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { Search, Calendar, Users, Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import dayjs from "dayjs";
import { cn } from "~/lib/utils";

export const EcoRetreatFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("general");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const guestSelectorRef = useRef<HTMLDivElement>(null);

  // Only these 4 states - that's it!
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [child, setChild] = useState(0);

  // Date picker internal state
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedStart, setSelectedStart] = useState<dayjs.Dayjs | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<dayjs.Dayjs | null>(null);
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);

  // Update date picker when props change
  useEffect(() => {
    setSelectedStart(checkIn ? dayjs(checkIn) : null);
    setSelectedEnd(checkOut ? dayjs(checkOut) : null);
  }, [checkIn, checkOut]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
      if (guestSelectorRef.current && !guestSelectorRef.current.contains(event.target as Node)) {
        setShowGuestSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateClick = (date: dayjs.Dayjs) => {
    if (!selectedStart || (selectedStart && selectedEnd) || isSelectingEnd) {
      if (!selectedStart) {
        setSelectedStart(date);
        setIsSelectingEnd(true);
      } else if (date.isBefore(selectedStart)) {
        setSelectedStart(date);
        setSelectedEnd(null);
        setIsSelectingEnd(true);
      } else {
        setSelectedEnd(date);
        setIsSelectingEnd(false);
        setCheckIn(selectedStart.format('YYYY-MM-DD'));
        setCheckOut(date.format('YYYY-MM-DD'));
        setShowDatePicker(false);
      }
    } else {
      setSelectedEnd(date);
      setIsSelectingEnd(false);
      setCheckIn(selectedStart.format('YYYY-MM-DD'));
      setCheckOut(date.format('YYYY-MM-DD'));
      setShowDatePicker(false);
    }
  };

  const updateGuests = (type: 'adults' | 'child', operation: 'add' | 'subtract') => {
    if (type === 'adults') {
      const newAdults = operation === 'add' ? adults + 1 : Math.max(1, adults - 1);
      setAdults(newAdults);
    } else {
      const newChild = operation === 'add' ? child + 1 : Math.max(0, child - 1);
      setChild(newChild);
    }
  };

  const onSubmit = () => {
    setShowGuestSelector(false);
    setShowDatePicker(false);
    
    const params = new URLSearchParams();
    
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    params.set("adults", adults.toString());
    params.set("child", child.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  const onClear = () => {
    setCheckIn("");
    setCheckOut("");
    setAdults(2);
    setChild(0);
    setSelectedStart(null);
    setSelectedEnd(null);
    setShowGuestSelector(false);
    setShowDatePicker(false);
    
    // Navigate to clean URL without any params
    router.push(pathname);
  };

  const renderCalendar = (monthOffset = 0) => {
    const month = currentMonth.add(monthOffset, 'month');
    const startOfMonth = month.startOf('month');
    const endOfMonth = month.endOf('month');
    const startOfWeek = startOfMonth.startOf('week');
    const endOfWeek = endOfMonth.endOf('week');

    const days = [];
    let current = startOfWeek;

    while (current.isBefore(endOfWeek) || current.isSame(endOfWeek, 'day')) {
      days.push(current);
      current = current.add(1, 'day');
    }

    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          {monthOffset === 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <h3 className="font-semibold text-center flex-1">
            {month.format('MMMM YYYY')}
          </h3>
          {monthOffset === 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isCurrentMonth = day.month() === month.month();
            const isToday = day.isSame(dayjs(), 'day');
            const isPast = day.isBefore(dayjs(), 'day');
            const isSelected = (selectedStart && day.isSame(selectedStart, 'day')) ?? 
                              (selectedEnd && day.isSame(selectedEnd, 'day'));
            const isInRange = selectedStart && selectedEnd && 
                             day.isAfter(selectedStart) && day.isBefore(selectedEnd);

            return (
              <button
                key={index}
                onClick={() => !isPast && isCurrentMonth && handleDateClick(day)}
                disabled={isPast || !isCurrentMonth}
                className={cn(
                  "p-2 text-sm rounded-md transition-colors relative",
                  "hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50",
                  !isCurrentMonth && "text-gray-300",
                  isToday && "font-bold",
                  isSelected && "bg-primary text-white hover:bg-primary/60",
                  isInRange && "bg-blue-100 text-primary/90",
                  isPast && "text-gray-300 cursor-not-allowed"
                )}
              >
                {day.date()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const formatDateRange = () => {
    if (checkIn && checkOut) {
      const start = dayjs(checkIn);
      const end = dayjs(checkOut);
      const nights = end.diff(start, 'day');
      return `${start.format('MMM DD')} - ${end.format('MMM DD')} (${nights} night${nights !== 1 ? 's' : ''})`;
    }
    return "Check-in / Check-out";
  };

  const formatGuests = () => {
    const guestText = `${adults} adult${adults !== 1 ? 's' : ''}`;
    const childText = child > 0 ? `, ${child} child${child !== 1 ? 'ren' : ''}` : '';
    return guestText + childText;
  };

  return (
    <div className="-mt-24">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
          <div className="rounded-b-none rounded-t-lg bg-secondary px-4 py-2 font-text text-lg text-white z-[101] p-3">
            <b>HOTEL BOOKING</b>
          </div>
          {[
            { id: "general", label: "Search Hotels" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="rounded-b-none rounded-t-lg bg-gray-200 px-4 py-2 font-text text-lg text-gray-950 backdrop-blur hover:bg-primary hover:text-white data-[state=active]:text-primary"
            >
              <span className="mr-2">+</span>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="rounded-lg bg-white/90 p-6 shadow-lg backdrop-blur">
          <TabsContent value="general">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-8">
              <div className="lg:col-span-4 relative" ref={datePickerRef}>
                <label className="mb-2 block text-sm font-medium">Dates</label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 justify-start text-left font-normal"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formatDateRange()}
                </Button>
                
                {showDatePicker && (
                  <div className="absolute top-full left-0 z-[9999] bg-white border rounded-lg shadow-lg mt-2 min-w-[600px]">
                    <div className="flex">
                      {renderCalendar(0)}
                      <div className="border-l">
                        {renderCalendar(1)}
                      </div>
                    </div>
                    <div className="border-t p-4 flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {selectedStart && selectedEnd ? (
                          `${selectedStart.format('MMM DD')} - ${selectedEnd.format('MMM DD, YYYY')}`
                        ) : selectedStart ? (
                          `Check-in: ${selectedStart.format('MMM DD, YYYY')}`
                        ) : (
                          'Select your dates'
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowDatePicker(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-3 relative" ref={guestSelectorRef}>
                <label className="mb-2 block text-sm font-medium">Guests</label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 justify-start text-left font-normal"
                  onClick={() => setShowGuestSelector(!showGuestSelector)}
                >
                  <Users className="mr-2 h-4 w-4" />
                  {formatGuests()}
                </Button>
                
                {showGuestSelector && (
                  <div className="absolute top-full right-0 z-[9999] bg-white border rounded-lg shadow-lg mt-2 w-80">
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Adults</div>
                          <div className="text-sm text-gray-500">Ages 13 or above</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateGuests('adults', 'subtract')}
                            disabled={adults <= 1}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{adults}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateGuests('adults', 'add')}
                            disabled={adults >= 10}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Children</div>
                          <div className="text-sm text-gray-500">Ages 0-12</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateGuests('child', 'subtract')}
                            disabled={child <= 0}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{child}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateGuests('child', 'add')}
                            disabled={child >= 10}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1 flex items-end gap-2">
                <Button type="button" onClick={onClear} variant="outline" className="flex-1 h-12">
                  Clear
                </Button>
                <Button type="button" onClick={onSubmit} className="flex-1 h-12">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};