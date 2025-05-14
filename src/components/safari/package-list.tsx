import { Calendar, CheckCircle2 } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { SafariBook } from "~/components/safari/booking/safari-book";

export const SafariPackage = ({ tour }: { tour: SafariTourProps }) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="font-heading text-xl font-semibold text-secondary">
                {tour.title}
              </h3>
              <p className="font-text text-sm text-gray-500">{tour.operator}</p>
            </div>
            <Badge className="bg-primary/10 text-primary">
              {tour.duration}
            </Badge>
          </div>

          <p className="mb-6 text-gray-600">{tour.description}</p>

          <div className="grid gap-4">
            <p className="font-heading text-lg text-secondary">Features </p>
            {tour.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-secondary" />
                <span className="text-sm text-gray-600">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-lg bg-gray-50 p-4 lg:w-64">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="text-xl font-semibold text-primary">
                ${tour.fee.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Updated: {new Date(tour.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <SafariBook tour={tour}/>
        </div>
      </div>
    </div>
  );
};
