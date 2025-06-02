"use client";

import {
  Users,
  PlusIcon,
  MinusIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRoom } from "~/hooks/use-room";

export const RoomInput = () => {
  const { roomData, setRoomData } = useRoom();

  const updateRoomData = (field: 'adults' | 'children' | 'quantity', operation: 'add' | 'subtract') => {
    const currentValue = roomData[field];
    let newValue: number;

    if (operation === 'add') {
      newValue = currentValue + 1;
    } else {
      // Different minimum values for each field
      if (field === 'adults') {
        newValue = Math.max(1, currentValue - 1); // Adults minimum is 1
      } else if (field === 'children') {
        newValue = Math.max(0, currentValue - 1); // Children minimum is 0
      } else { // quantity
        newValue = Math.max(1, currentValue - 1); // Quantity minimum is 1
      }
    }

    setRoomData({ [field]: newValue });
  };

  return (
    <div className="w-full space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 lg:p-8">
        <div className="mb-4 sm:mb-6">
          <h2 className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-primary/70">
            Search Rooms
          </h2>
          <p className="text-sm text-gray-500">Select your dates and guests</p>
        </div>
        <div className="space-y-4 rounded-lg bg-gray-50 p-3 sm:p-4">
          <h3 className="font-medium text-gray-700">Guests & Rooms</h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {/* Quantity (Rooms) Selector */}
            <div className="group relative flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-primary hover:shadow-md sm:gap-3 sm:p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                <span className="text-sm font-medium text-gray-700">
                  Rooms
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updateRoomData('quantity', 'subtract')}
                  disabled={roomData.quantity <= 1}
                >
                  <MinusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <span className="w-6 text-center text-base font-semibold text-primary sm:w-8 sm:text-lg">
                  {roomData.quantity}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updateRoomData('quantity', 'add')}
                  className="h-7 w-7 rounded-full transition-colors hover:bg-primary hover:text-white sm:h-8 sm:w-8"
                >
                  <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            {/* Adults Selector */}
            <div className="group relative flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-primary hover:shadow-md sm:gap-3 sm:p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                <span className="text-sm font-medium text-gray-700">
                  Adults
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updateRoomData('adults', 'subtract')}
                  disabled={roomData.adults <= 1}
                >
                  <MinusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <span className="w-6 text-center text-base font-semibold text-primary sm:w-8 sm:text-lg">
                  {roomData.adults}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updateRoomData('adults', 'add')}
                  className="h-7 w-7 rounded-full transition-colors hover:bg-primary hover:text-white sm:h-8 sm:w-8"
                >
                  <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            {/* Children Selector */}
            <div className="group relative flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-primary hover:shadow-md sm:gap-3 sm:p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                <span className="text-sm font-medium text-gray-700">
                  Children
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updateRoomData('children', 'subtract')}
                  disabled={roomData.children <= 0}
                >
                  <MinusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <span className="w-6 text-center text-base font-semibold text-primary sm:w-8 sm:text-lg">
                  {roomData.children}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updateRoomData('children', 'add')}
                  className="h-7 w-7 rounded-full transition-colors hover:bg-primary hover:text-white sm:h-8 sm:w-8"
                >
                  <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Display Current Selection */}
          <div className="mt-4 rounded-lg bg-blue-50 p-3">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-gray-700">Current Selection:</span>
              <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                {roomData.quantity} {roomData.quantity === 1 ? 'Room' : 'Rooms'}
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                {roomData.adults} {roomData.adults === 1 ? 'Adult' : 'Adults'}
              </span>
              {roomData.children > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                  {roomData.children} {roomData.children === 1 ? 'Child' : 'Children'}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setRoomData({ adults: 2, children: 0, quantity: 1 })}
              className="flex-1"
            >
              Reset
            </Button>
            <Button className="flex-1">
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};