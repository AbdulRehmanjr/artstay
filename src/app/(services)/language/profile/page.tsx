import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/server";
import Image from "next/image";
import {
  MapPin,
  Star,
  Clock,
  Languages as LanguagesIcon,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  DollarSign,
  Globe,
  Check,
} from "lucide-react";
import { HeadlingUnderline } from "~/components/common/heading-underline";
import { Badge } from "~/components/ui/badge";
import { LanguageServiceBook } from "~/components/language/booking/book-now";

type PageProps = {
  searchParams: Promise<{ serviceId: string }>;
};

export default async function LanguageServicePage({ searchParams }: PageProps) {
  const paramProps = await searchParams;
  const service: LanguageServiceProps = await api.language.getLanguageById({
    id: paramProps.serviceId,
  });

  return (
    <Tabs defaultValue="general" className="w-full">
      <div className="relative flex flex-col items-center pb-6">
        <div className="flex gap-2">
          <div className="relative -mt-[14rem] h-[15rem] w-[15rem] overflow-hidden rounded-lg shadow-lg">
            <Image
              src={service.profileImage || '/placeholder.png'}
              alt="Profile photo"
              priority
              className="rounded-lg object-cover"
              fill
              sizes="100%"
            />
            <div className="absolute bottom-0 left-0 right-0 h-[3rem] bg-gradient-to-t from-[#0088cc] to-transparent p-4">
              <h2 className="text-center text-sm font-semibold text-white">
                {service.firstName} {service.lastName}
              </h2>
            </div>
          </div>
          <TabsList className="relative -mt-[12rem] flex h-auto flex-wrap items-end justify-end gap-2 bg-transparent p-0">
            {[
              { id: "general", label: "General Info" },
              { id: "portfolio", label: "Portfolio" },
              { id: "booking", label: "Booking Info" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="rounded-b-none rounded-t-lg bg-gray-200 px-4 py-2 font-text text-lg text-gray-950 backdrop-blur hover:bg-primary hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <span className="mr-2">+</span>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-white/90 p-6 text-gray-900 shadow-lg backdrop-blur">
        <TabsContent value="general" className="grid gap-6">
          <HeadlingUnderline title="Translator Profile" />
          <div className="rounded-lg bg-primary p-8 text-white shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  {/* Star Rating */}
                  <div className="flex">
                    {Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <Star
                          key={index}
                          className={`h-6 w-6 transition-colors duration-200 ${
                            index < Math.floor(service.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-300 text-gray-300"
                          }`}
                        />
                      ))}
                    <span className="ml-2 text-sm">({service.rating.toFixed(1)})</span>
                  </div>

                  <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                    <span className="text-xs text-white/70">Experience</span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-400" />
                      <span className="text-base font-medium">{service.experience}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                    <span className="text-xs text-white/70">Hourly Rate</span>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-400" />
                      <span className="text-base font-medium">
                        ${service.hourlyRate}/hour
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-white/70">Specialization</span>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-green-400" />
                    <span className="text-base font-medium">
                      {service.specialization.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                  <span className="text-xs text-white/70">Languages</span>
                  <div className="flex items-center gap-2">
                    <LanguagesIcon className="h-5 w-5 text-orange-400" />
                    <span className="text-base font-medium">
                      {service.languages.join(', ')}
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 rounded p-2 transition-colors duration-200 hover:bg-white/5">
                  <MapPin className="h-5 w-5" />
                  <span className="text-base">{service.location}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <h2 className="border-b border-gray-200 pb-3 text-xl font-semibold text-gray-800">
              About {service.firstName} {service.lastName}
            </h2>
            <p className="text-base leading-relaxed text-gray-700">
              {service.description}
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="border-b border-gray-200 pb-3 text-xl font-semibold text-gray-800">
              Qualifications & Certifications
            </h2>
            <div className="rounded-lg bg-gray-50 p-6">
              <div className="mb-4 flex items-start gap-3">
                <GraduationCap className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Educational Qualification</h3>
                  <p className="mt-1 text-gray-600">{service.qualification}</p>
                </div>
              </div>
              
              {service.certification.length > 0 && (
                <div className="flex items-start gap-3">
                  <Award className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Professional Certifications</h3>
                    <ul className="mt-2 space-y-1">
                      {service.certification.map((cert, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-600">
                          <Check className="h-4 w-4 text-green-500" />
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
           <LanguageServiceBook service={service}/>
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="grid gap-6">
          <HeadlingUnderline title="Portfolio & Work Samples" />
          
          {service.portfolio && service.portfolio.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {service.portfolio.map((item, index) => (
                <div 
                  key={index} 
                  className="overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <div className="relative h-40 w-full">
                    <Image
                      src={item || '/placeholder-document.png'}
                      alt={`Portfolio item ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">Portfolio Sample {index + 1}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      View sample of previous translation or interpretation work
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
              <LanguagesIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No Portfolio Samples</h3>
              <p className="mt-2 text-gray-500">
                This translator hasn&apos;t uploaded any portfolio samples yet.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="booking" className="grid gap-6">
          <HeadlingUnderline title="Booking Information" />
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div className="rounded-lg bg-blue-50 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-blue-700">
                  <Calendar className="h-5 w-5" />
                  Availability
                </h3>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <span className="text-gray-700">Available Days:</span>
                    <div className="flex flex-wrap gap-2">
                      {service.availability.map((day, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-blue-100 pt-4">
                    <div>
                      <span className="text-sm text-gray-700">Working Hours:</span>
                      <p className="font-medium text-gray-900">{service.startTime} - {service.endTime}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg bg-gray-50 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-medium">
                  <Globe className="h-5 w-5 text-primary" />
                  Service Modes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {service.serviceMode.map((mode, index) => (
                    <Badge key={index} className="px-3 py-1">
                      {mode}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-medium">Booking Requirements</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-200 pb-3">
                  <span className="text-gray-700">Hourly Rate:</span>
                  <span className="font-medium text-gray-900">${service.hourlyRate}</span>
                </div>
                
                <div className="flex justify-between border-b border-gray-200 pb-3">
                  <span className="text-gray-700">Minimum Booking:</span>
                  <span className="font-medium text-gray-900">{service.minBookingHours} hour{service.minBookingHours > 1 ? 's' : ''}</span>
                </div>
                
                <div className="flex justify-between border-b border-gray-200 pb-3">
                  <span className="text-gray-700">Maximum Booking:</span>
                  <span className="font-medium text-gray-900">{service.maxBookingHours} hours</span>
                </div>
                
                <div className="pt-4">
                <LanguageServiceBook service={service}/>
                  <p className="mt-2 text-center text-xs text-gray-500">
                    Book this translator&apos;s services based on your specific needs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}