import { useState } from "react";
import type { Language } from "@shared/schema";
import { programs } from "@/data/festivalData";
import { getTranslation } from "@/lib/translations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Download, Clock, MapPin } from "lucide-react";

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

  const filteredPrograms =
    selectedDate === "all"
      ? programs
      : programs.filter((p) => p.date === selectedDate);

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
      
      <Accordion type="single" collapsible className="space-y-3">
        {filteredPrograms.map((program) => (
          <AccordionItem
            key={program.id}
            value={program.id}
            className="border border-gray-300 rounded-md px-4"
            data-testid={`program-${program.id}`}
          >
            <AccordionTrigger className="text-base font-semibold text-gray-900 hover:no-underline">
              {program.title[lang]}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="h-4 w-4 text-modu-red" />
                  <span>{program.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin className="h-4 w-4 text-modu-red" />
                  <span>{program.location[lang]}</span>
                </div>
                {program.description && (
                  <p className="text-sm text-gray-600">{program.description[lang]}</p>
                )}
                <Button
                  data-testid={`button-download-program-${program.id}`}
                  onClick={() => onDownloadPamphlet(program.id)}
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {getTranslation(lang, "downloadProgramPamphlet")}
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      <Button
        data-testid="button-download-full-timetable"
        onClick={() => onDownloadPamphlet()}
        variant="default"
        className="w-full mt-6"
      >
        <Download className="mr-2 h-4 w-4" />
        {getTranslation(lang, "downloadFullTimetable")}
      </Button>
    </div>
  );
}
