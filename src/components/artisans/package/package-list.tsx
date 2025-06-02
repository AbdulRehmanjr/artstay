import React from "react";
import { Card, CardContent } from "~/components/ui/card";
import { BookOpen, Calendar, Scroll, Clock, GraduationCap } from "lucide-react";
import dayjs from "dayjs";
import { SelectPackage } from "~/components/artisans/package/select-package";

export const ArtisanPackage = ({
  packages,
}: {
  packages: ArtisanPackageProps[];
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg) => (
        <Card
          key={pkg.packageId}
          className="group relative grid overflow-hidden transition-all hover:shadow-lg"
        >
          {/* Price Tag */}
          <div className="absolute right-0 top-6 z-10">
            <div className="bg-primary px-4 py-1 text-sm font-medium text-primary-foreground shadow-sm">
              ${pkg.price}
            </div>
          </div>

          <CardContent className="grid p-6">
            {/* Package Header */}
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  Learning Package
                </span>
              </div>
              <h3 className="text-xl font-semibold tracking-tight">
                {pkg.title}
              </h3>
            </div>

            {/* Duration */}
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Duration: {pkg.duration} Days</span>
            </div>

            {/* Overview */}
            <div className="mb-6">
              <h4 className="mb-2 text-sm font-medium text-primary">
                Overview
              </h4>
              <p className="text-sm text-muted-foreground">{pkg.experience}</p>
            </div>

            {/* Key Learning Points */}
            <div className="mb-6 space-y-3">
              <h4 className="flex items-center gap-2 text-sm font-medium text-primary">
                <GraduationCap className="h-4 w-4" />
                Key Learning Points
              </h4>
              <ul className="space-y-2">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60" />
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Certifications */}
            <div className="mb-4 flex items-start gap-2">
              <Scroll className="h-4 w-4 text-primary" />
              <div>
                <h4 className="text-sm font-medium">Certifications</h4>
                <p className="text-sm text-muted-foreground">
                  Scroll of Completion
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  Updated {dayjs(pkg.updatedAt).format("MMM D, YYYY")}
                </span>
              </div>
              <SelectPackage packageId={pkg.packageId} duration={pkg.duration} amount={pkg.price} title={pkg.title} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
