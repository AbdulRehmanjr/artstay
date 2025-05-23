import { Calendar, CheckCircle2, Building, Map, MapPin } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { FairEventBook } from "~/components/fair/booking/fair-book";
import dayjs from "dayjs";

export const FairEvent = ({ event }: { event: FairEventProps }) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="font-heading text-xl font-semibold text-secondary">
                {event.title}
              </h3>
              <p className="font-text text-sm text-gray-500">
                {event.organizer}
              </p>
            </div>
            <Badge>
              {dayjs(event.startDate).format("MMM D")} -{" "}
              {dayjs(event.endDate).format("MMM D, YYYY")}
            </Badge>
          </div>

          <p className="mb-6 text-gray-600">{event.description}</p>

          <div className="grid gap-4">
            <p className="font-heading text-lg text-secondary">
              Event Details{" "}
            </p>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-secondary" />
              <span className="text-sm text-gray-600">
                Location: {event.location}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-secondary" />
              <span className="text-sm text-gray-600">
                Venue: {event.vanue}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Map className="h-4 w-4 text-secondary" />
              <span className="text-sm text-gray-600">
                Coordinates: {event.latitude}, {event.longitude}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-secondary" />
              <span className="text-sm text-gray-600">
                Fair Type: {event.fairType}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-lg bg-gray-50 p-4 lg:w-64">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Created: {new Date(event.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Updated: {new Date(event.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <FairEventBook event={event} />
        </div>
      </div>
    </div>
  );
};
