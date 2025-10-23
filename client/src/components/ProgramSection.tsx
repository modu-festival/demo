import { useState, useMemo } from "react";
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
import { Download, MapPin, ArrowDownToLine } from "lucide-react";

interface ProgramSectionProps {
  lang: Language;
  onDownloadPamphlet: (programId?: string) => void;
}

export function ProgramSection({
  lang,
  onDownloadPamphlet,
}: ProgramSectionProps) {
  const [selectedDate, setSelectedDate] = useState<string>("all");

  const dates = ["all", "2025-05-26", "2025-05-27", "2025-05-28"];

  // dateLabels를 useMemo로 메모이제이션 - lang 변경 시만 재생성
  const dateLabels = useMemo<Record<string, string>>(
    () => ({
      all: getTranslation(lang, "all"),
      "2025-05-26": `26${getTranslation(lang, "day")} (${getTranslation(
        lang,
        "friday"
      )})`,
      "2025-05-27": `27${getTranslation(lang, "day")} (${getTranslation(
        lang,
        "saturday"
      )})`,
      "2025-05-28": `28${getTranslation(lang, "day")} (${getTranslation(
        lang,
        "sunday"
      )})`,
    }),
    [lang]
  );

  // 필터링된 카테고리를 useMemo로 메모이제이션
  const filteredCategories = useMemo(() => {
    if (selectedDate === "all") return programCategories;

    return programCategories
      .map((category) => ({
        ...category,
        performances: category.performances
          .filter((performance) =>
            performance.schedule.some((s) => s.date === selectedDate)
          )
          .map((performance) => ({
            ...performance,
            schedule: performance.schedule.filter(
              (s) => s.date === selectedDate
            ),
          })),
      }))
      .filter((category) => category.performances.length > 0);
  }, [selectedDate]);

  return (
    <div className="bg-white px-6 py-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {getTranslation(lang, "program")}
      </h2>

      {/* 날짜 필터 탭 */}
      <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 mb-4">
        <div className="flex gap-2 pb-2 min-w-max">
          {dates.map((date) => (
            <Button
              key={date}
              data-testid={`program-date-${date}`}
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate(date)}
              className={`whitespace-nowrap flex-shrink-0 rounded-md px-2 py-1 ${
                selectedDate === date
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200"
              }`}
            >
              {dateLabels[date]}
            </Button>
          ))}
        </div>
      </div>

      {/* 프로그램 카테고리 */}
      <Accordion type="multiple" className="space-y-3">
        {filteredCategories.map((category) => (
          <AccordionItem
            key={category.id}
            value={category.id}
            className="border border-gray-300 rounded-md px-4"
            data-testid={`program-category-${category.id}`}
          >
            <AccordionTrigger className="text-base font-semibold text-gray-900 hover:no-underline">
              {/* 제목 + 개수 수직 정렬 */}
              <div className="flex flex-col text-left">
                <span className="text-[16px] font-semibold text-gray-900 leading-tight">
                  {category.name[lang]}
                </span>
                <span className="text-[13px] text-gray-500 mt-1 leading-tight">
                  {category.performances.length}
                  {getTranslation(lang, "programCountUnit")}
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="space-y-4 pt-2">
                {category.performances.map((performance) => (
                  <div
                    key={performance.id}
                    className="bg-gray-100 border border-gray-300 rounded-[5px] p-4"
                    data-testid={`performance-${performance.id}`}
                  >
                    {/* 공연 제목 + 뱃지 */}
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-[16px] font-bold text-gray-900">
                        {performance.name[lang]}
                      </h4>
                      {performance.badge && (
                        <Badge className="bg-gray-800 rounded-[3px] text-white text-[11px] px-2 py-0.5">
                          {performance.badge[lang]}
                        </Badge>
                      )}
                    </div>

                    {/* 설명 */}
                    {performance.description && (
                      <p className="text-[13px] font-medium text-gray-600 mb-3">
                        {performance.description[lang]}
                      </p>
                    )}

                    {/* 위치 */}
                    <div className="flex items-center gap-1 text-[12px] font-medium mb-3">
                      <MapPin className="h-3.5 w-3.5 text-gray-600" />
                      <span className="text-gray-700">
                        {performance.location[lang]}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 my-3" />

                    {/* 일정 */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <p className="text-[12px] font-medium text-gray-900">
                          {getTranslation(lang, "programSchedule")}
                        </p>
                      </div>
                      <div className="space-y-3">
                        {performance.schedule.map((scheduleItem, idx) => {
                          const dayNum = scheduleItem.date.split("-")[2];
                          const dayName =
                            scheduleItem.date === "2025-05-26"
                              ? getTranslation(lang, "friday")
                              : scheduleItem.date === "2025-05-27"
                              ? getTranslation(lang, "saturday")
                              : getTranslation(lang, "sunday");

                          const dateStr =
                            lang === "en"
                              ? `${getTranslation(
                                  lang,
                                  "may"
                                )} ${dayNum} (${dayName})`
                              : `${getTranslation(
                                  lang,
                                  "may"
                                )} ${dayNum}${getTranslation(
                                  lang,
                                  "day"
                                )} (${dayName})`;

                          return (
                            <div
                              key={idx}
                              className="bg-white rounded-md px-4 py-3"
                            >
                              <p className="text-sm font-medium text-gray-900 mb-3">
                                {dateStr}
                              </p>
                              <div className="space-y-2">
                                {scheduleItem.sessions.map((session) => (
                                  <div
                                    key={session.sessionNumber}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <Badge className="bg-gray-600 rounded-[3px] text-white text-[11px] px-2 py-0.5">
                                      {session.sessionNumber}
                                      {getTranslation(lang, "session")}
                                    </Badge>
                                    <span className="font-medium text-gray-700">
                                      {session.time}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 개별 팜플렛 다운로드 */}
                    <div className="flex justify-end">
                      <Button
                        data-testid={`button-download-performance-${performance.id}`}
                        onClick={() => onDownloadPamphlet(performance.id)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-700 flex items-center gap-1"
                      >
                        <span className="text-[13px]">
                          {getTranslation(lang, "downloadCategoryDetail")}
                        </span>
                        <ArrowDownToLine className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* 전체 시간표 다운로드 */}
      <Button
        data-testid="button-download-full-timetable"
        onClick={() => onDownloadPamphlet()}
        variant="outline"
        className="w-full mt-6 py-3"
      >
        {getTranslation(lang, "downloadFullTimetable")}
        <Download className="mr-2 h-3 w-3" />
      </Button>
    </div>
  );
}
