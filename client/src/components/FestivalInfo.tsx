import type { Language } from "@shared/schema";
import { festivalInfo } from "@/data/festivalData";
import { getTranslation } from "@/lib/translations";
import { Calendar, MapPin, Ticket } from "lucide-react";

interface FestivalInfoProps {
  lang: Language;
}

export function FestivalInfo({ lang }: FestivalInfoProps) {
  return (
    <div className="bg-white px-6 pt-8 pb-4">
      <h1
        className="text-title1_b_24 text-black mb-4 text-left"
        data-testid="text-festival-name"
      >
        {festivalInfo.name[lang]}
      </h1>

      <div className="space-y-2">
        <div className="flex items-center gap-2" data-testid="info-dates">
          <Calendar className="h-4 w-4 text-gray-600 flex-shrink-0" />
          <p className="text-[13px] font-medium text-gray-700">
            {festivalInfo.dates[lang]}
          </p>
        </div>

        <div className="flex items-center gap-2" data-testid="info-location">
          <MapPin className="h-4 w-4 text-gray-600 flex-shrink-0" />
          <p className="text-[13px] font-medium text-gray-700">
            {festivalInfo.location[lang]}
          </p>
        </div>

        <div className="flex items-center gap-2" data-testid="info-price">
          <Ticket className="h-4 w-4 text-gray-600 flex-shrink-0" />
          <p className="text-[13px] font-medium text-gray-700">
            {festivalInfo.price[lang]}
          </p>
        </div>
      </div>

      <div className="mt-7 border-t border-gray-300" />
    </div>
  );
}
