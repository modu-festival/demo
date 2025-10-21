import type { Language } from "@shared/schema";
import { locationInfo } from "@/data/festivalData";
import { getTranslation } from "@/lib/translations";
import { MapPin, Car, Train } from "lucide-react";

interface LocationSectionProps {
  lang: Language;
}

export function LocationSection({ lang }: LocationSectionProps) {
  return (
    <div className="bg-white px-6 py-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{getTranslation(lang, "location")}</h2>
      
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div>
            <p className="text-sm text-gray-900">{locationInfo.address[lang]}</p>
          </div>
        </div>
        
        {/* Map placeholder */}
        <div className="bg-gray-200 rounded-md overflow-hidden" data-testid="map-container">
          <div className="w-full h-[250px] bg-gray-300 flex items-center justify-center">
            <MapPin className="h-12 w-12 text-gray-500" />
          </div>
        </div>
        
        {/* {locationInfo.parking && (
          <div className="flex items-start gap-3">
            <Car className="h-5 w-5 text-modu-red mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-600 mb-1">{getTranslation(lang, "parking")}</p>
              <p className="text-base text-gray-900">{locationInfo.parking[lang]}</p>
            </div>
          </div>
        )}
        
        {locationInfo.publicTransport && (
          <div className="flex items-start gap-3">
            <Train className="h-5 w-5 text-modu-red mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-600 mb-1">{getTranslation(lang, "publicTransport")}</p>
              <p className="text-base text-gray-900">{locationInfo.publicTransport[lang]}</p>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
