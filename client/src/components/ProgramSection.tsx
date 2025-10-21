import { useState } from "react";
import type { Language } from "@shared/schema";
import { programCategories } from "@/data/festivalData";
import { getTranslation } from "@/lib/translations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, MapPin } from "lucide-react";

interface ProgramSectionProps {
  lang: Language;
  onDownloadPamphlet: (programId?: string) => void;
}

export function ProgramSection({ lang, onDownloadPamphlet }: ProgramSectionProps) {
  const [selectedDate, setSelectedDate] = useState<string>("all");

  const dates = ["all", "2025-05-26", "2025-05-27", "2025-05-28"];
  const dateLabels: Record<string, string> = {
    all: getTranslation(lang, "all"),
    "2025-05-26": `26 (${getTranslation(lang, "friday")})`,
    "2025-05-27": `27 (${getTranslation(lang, "saturday")})`,
    "2025-05-28": `28 (${getTranslation(lang, "sunday")})`,
  };

  // Filter performances by date
  const getFilteredCategories = () => {
    if (selectedDate === "all") {
      return programCategories;
    }

    return programCategories
      .map((category) => ({
        ...category,
        performances: category.performances
          .filter((performance) =>
            performance.schedule.some((s) => s.date === selectedDate)
          )
          .map((performance) => ({
            ...performance,
            schedule: performance.schedule.filter((s) => s.date === selectedDate),
          })),
      }))
      .filter((category) => category.performances.length > 0);
  };

  const filteredCategories = getFilteredCategories();

  return (
    <div className="bg-white px-6 py-8 border-t border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{getTranslation(lang, "program")}</h2>
      
      {/* Date filter tabs */}
      <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 mb-4">
        <div className="flex gap-2 pb-2 min-w-max">
          {dates.map((date) => (
            <Button
              key={date}
              data-testid={`program-date-${date}`}
              variant={selectedDate === date ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDate(date)}
              className="whitespace-nowrap flex-shrink-0"
            >
              {dateLabels[date]}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Program categories */}
      <Accordion type="single" collapsible className="space-y-3">
        {filteredCategories.map((category) => (
          <AccordionItem
            key={category.id}
            value={category.id}
            className="border border-gray-300 rounded-md px-4"
            data-testid={`program-category-${category.id}`}
          >
            <AccordionTrigger className="text-base font-semibold text-gray-900 hover:no-underline">
              {category.name[lang]}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {category.performances.map((performance) => (
                  <div
                    key={performance.id}
                    className="bg-gray-50 rounded-md p-4 space-y-3"
                    data-testid={`performance-${performance.id}`}
                  >
                    {/* Performance name with badge */}
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{performance.name[lang]}</h4>
                      {performance.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {performance.badge[lang]}
                        </Badge>
                      )}
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-modu-red mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-gray-600">{getTranslation(lang, "venue")}: </span>
                        <span className="text-gray-900">{performance.location[lang]}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-sm">
                      <span className="text-gray-600">{getTranslation(lang, "priceLabel")}: </span>
                      <span className="text-gray-900 font-medium">{performance.price[lang]}</span>
                    </div>

                    {/* Description */}
                    {performance.description && (
                      <p className="text-sm text-gray-700">{performance.description[lang]}</p>
                    )}

                    {/* Schedule */}
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        {getTranslation(lang, "programSchedule")}
                      </p>
                      <div className="space-y-2">
                        {performance.schedule.map((scheduleItem, idx) => {
                          const dayNum = scheduleItem.date.split("-")[2];
                          const dayName =
                            scheduleItem.date === "2025-05-26"
                              ? getTranslation(lang, "friday")
                              : scheduleItem.date === "2025-05-27"
                              ? getTranslation(lang, "saturday")
                              : getTranslation(lang, "sunday");
                          
                          const dateStr = lang === "en"
                            ? `${getTranslation(lang, "may")} ${dayNum} (${dayName})`
                            : `${getTranslation(lang, "may")} ${dayNum}${getTranslation(lang, "day")} (${dayName})`;
                          
                          return (
                            <div key={idx} className="space-y-1">
                              <p className="text-sm text-gray-700 font-medium">{dateStr}</p>
                              {scheduleItem.sessions.map((session) => (
                                <div key={session.sessionNumber} className="flex items-center gap-2 text-sm ml-2">
                                  <Badge variant="outline" className="text-xs">
                                    {session.sessionNumber}{getTranslation(lang, "session")}
                                  </Badge>
                                  <span className="text-gray-700">{session.time}</span>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Individual pamphlet download */}
                    <Button
                      data-testid={`button-download-performance-${performance.id}`}
                      onClick={() => onDownloadPamphlet(performance.id)}
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2 text-modu-red"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {getTranslation(lang, "downloadCategoryDetail")}
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      {/* Full timetable download */}
      <Button
        data-testid="button-download-full-timetable"
        onClick={() => onDownloadPamphlet()}
        variant="outline"
        className="w-full mt-6"
      >
        <Download className="mr-2 h-4 w-4" />
        {getTranslation(lang, "downloadFullTimetable")}
      </Button>
    </div>
  );
}
