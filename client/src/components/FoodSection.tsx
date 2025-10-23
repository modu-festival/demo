import type { Language } from "@shared/schema";
import { foodZones } from "@/data/festivalData";
import { getTranslation } from "@/lib/translations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Download, Utensils } from "lucide-react";

interface FoodSectionProps {
  lang: Language;
  onDownloadPamphlet: () => void;
}

export function FoodSection({ lang, onDownloadPamphlet }: FoodSectionProps) {
  return (
    <div className="bg-white px-6 py-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {getTranslation(lang, "food")}
      </h2>

      <Accordion type="multiple" className="space-y-3">
        {foodZones.map((zone) => (
          <AccordionItem
            key={zone.id}
            value={zone.id}
            className="border border-gray-300 rounded-md px-4"
            data-testid={`food-zone-${zone.id}`}
          >
            <AccordionTrigger className="text-base font-semibold text-gray-900 hover:no-underline">
              <div className="flex items-center gap-2">
                <Utensils className="h-4 w-4 text-gray-900" />
                {zone.name[lang]}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {zone.restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="bg-gray-50 rounded-md p-4"
                  >
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">
                      {restaurant.name[lang]}
                    </h4>
                    <div className="space-y-1">
                      {restaurant.menu.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="font-medium text-gray-800">
                            {item.name[lang]}
                          </span>
                          <span className="font-medium text-gray-800">
                            {item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button
        data-testid="button-download-food-pamphlet"
        onClick={onDownloadPamphlet}
        variant="outline"
        className="w-full mt-6 py-3"
      >
        {getTranslation(lang, "downloadFoodPamphlet")}
        <Download className="mr-2 h-3 w-3" />
      </Button>
    </div>
  );
}
