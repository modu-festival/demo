import type { Language } from "@shared/schema";
import { festivalInfo } from "@/data/festivalData";
import { getTranslation } from "@/lib/translations";
import { Calendar, MapPin, Ticket } from "lucide-react";

interface FestivalInfoProps {
  lang: Language;
}

export function FestivalInfo({ lang }: FestivalInfoProps) {
  return (
    <div className="bg-white px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center" data-testid="text-festival-name">
        {festivalInfo.name[lang]}
      </h1>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3" data-testid="info-dates">
          <Calendar className="h-5 w-5 text-modu-red mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-600 mb-1">{getTranslation(lang, "date")}</p>
            <p className="text-base text-gray-900">{festivalInfo.dates[lang]}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3" data-testid="info-location">
          <MapPin className="h-5 w-5 text-modu-red mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-600 mb-1">{getTranslation(lang, "locationLabel")}</p>
            <p className="text-base text-gray-900">{festivalInfo.location[lang]}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3" data-testid="info-price">
          <Ticket className="h-5 w-5 text-modu-red mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-600 mb-1">{getTranslation(lang, "price")}</p>
            <p className="text-base font-semibold text-modu-red">{festivalInfo.price[lang]}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 border-t border-gray-300" />
    </div>
  );
}
