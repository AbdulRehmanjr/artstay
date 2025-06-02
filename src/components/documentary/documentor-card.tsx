import { Calendar, CheckCircle2 } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { DocumentorPackageBook } from "~/components/documentary/booking/booking-now";

export const DocumentorPackageCard = ({ package: pkg }: { package: DocumentorPackageProps }) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg border">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-heading text-xl font-semibold text-secondary">
              {pkg.title}
            </h3>
            <Badge variant="outline" className="mt-1">
              {pkg.packageType}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">${pkg.price}</div>
            <div className="text-sm text-gray-500">{pkg.duration} days</div>
          </div>
        </div>

        <p className="text-gray-600 text-sm">{pkg.description}</p>

        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Deliverables
          </h4>
          <ul className="space-y-1">
            {pkg.deliverables.map((deliverable, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                {deliverable}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Created: {new Date(pkg.createdAt).toLocaleDateString()}
            </div>
          </div>
          <DocumentorPackageBook package={pkg} />
        </div>
      </div>
    </div>
  );
};