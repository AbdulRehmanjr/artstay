"use client";

import {
  Users,
  PlusIcon,
  MinusIcon,
} from "lucide-react";
import { useCallback, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { useRoom } from "~/hooks/use-room";
import { api } from "~/trpc/react";

type ComponentProps = {
  room: RoomProps;
};

export const RoomInput = ({ room }: ComponentProps) => {
  const { roomData, setRoomData, setRrpId } = useRoom();

  const [ratePlans] = api.ecoretreact.getRoomRateByRoomId.useSuspenseQuery({
    roomId: room.roomId,
  });

  // Dynamic rate plan assignment logic
  const getRatePlan = useCallback(
    (adults: number, children: number) => {
      const totalOccupancy = adults + children;

      if (totalOccupancy === 0) return null;

      // Get all available occupancy options from all rate plans
      const occupancyOptions: Array<{
        occupancy: number;
        rrpId: string;
        ratePlanName: string;
      }> = [];

      ratePlans.forEach(ratePlan => {
        ratePlan.roomrateplans?.forEach(rrp => {
          occupancyOptions.push({
            occupancy: rrp.occupancy,
            rrpId: rrp.rrpId,
            ratePlanName: ratePlan.name
          });
        });
      });

      // Sort by occupancy ascending
      occupancyOptions.sort((a, b) => a.occupancy - b.occupancy);

      // Find the best match:
      // 1. Exact occupancy match
      let bestMatch = occupancyOptions.find(option => option.occupancy === totalOccupancy);

      // 2. If no exact match, find smallest occupancy that can accommodate
      if (!bestMatch) {
        bestMatch = occupancyOptions.find(option => option.occupancy >= totalOccupancy);
      }

      // 3. If still no match, use the highest available occupancy
      if (!bestMatch && occupancyOptions.length > 0) {
        bestMatch = occupancyOptions[occupancyOptions.length - 1];
      }
      
      return bestMatch?.rrpId ?? null;
    },
    [ratePlans]
  );

  // Update rate plan when guests change
  useEffect(() => {
    const rrpId = getRatePlan(roomData.adults, roomData.children);
    if (rrpId) {
      setRrpId(rrpId);
    }
  }, [roomData.adults, roomData.children, getRatePlan, setRrpId]);

  const updateRoomData = (field: 'adults' | 'children' | 'quantity', operation: 'add' | 'subtract') => {
    const currentValue = roomData[field];
    let newValue: number;

    if (operation === 'add') {
      if (field === 'quantity') {
        newValue = Math.min(room.quantity, currentValue + 1);
      } else {
        // Check total guest capacity
        const totalGuests = roomData.adults + roomData.children + (field === 'adults' ? 1 : 0) + (field === 'children' ? 1 : 0);
        const maxCapacity = room.capacity * roomData.quantity;
        
        if (totalGuests <= maxCapacity) {
          newValue = currentValue + 1;
        } else {
          newValue = currentValue; // Don't increase if it exceeds capacity
        }
      }
    } else {
      if (field === 'adults') {
        newValue = Math.max(1, currentValue - 1); // Adults minimum is 1
      } else if (field === 'children') {
        newValue = Math.max(0, currentValue - 1); // Children minimum is 0
      } else { // quantity
        newValue = Math.max(1, currentValue - 1); // Quantity minimum is 1
        // If reducing rooms, ensure guests don't exceed new capacity
        const newMaxCapacity = room.capacity * Math.max(1, currentValue - 1);
        const currentTotalGuests = roomData.adults + roomData.children;
        if (currentTotalGuests > newMaxCapacity) {
          // Don't allow room reduction if it would exceed capacity
          return;
        }
      }
    }

    setRoomData({ [field]: newValue });
  };

  const totalGuests = roomData.adults + roomData.children;
  const maxCapacity = room.capacity * roomData.quantity;
  const canAddGuests = totalGuests < maxCapacity;

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
                  disabled={roomData.quantity >= room.quantity}
                  className="h-7 w-7 rounded-full transition-colors hover:bg-primary hover:text-white sm:h-8 sm:w-8"
                >
                  <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">
                Max: {room.quantity} available
              </span>
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
                  disabled={!canAddGuests}
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
                  disabled={!canAddGuests}
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
              <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600 text-xs">
                Capacity: {totalGuests}/{maxCapacity}
              </span>
              {roomData.rrpId && (
                <span className="rounded-full bg-green-100 px-2 py-1 text-green-700 text-xs">
                  Rate Plan: {roomData.rrpId}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};