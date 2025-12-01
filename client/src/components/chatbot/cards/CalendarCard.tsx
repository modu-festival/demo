import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CalendarData } from "../types";
import { createGoogleCalendarUrl, createEventFromProgram } from "@/lib/googleCalendar";
import { Calendar } from "lucide-react";

interface CalendarCardProps {
  title: string;
  data: CalendarData;
}

export default function CalendarCard({ title, data }: CalendarCardProps) {
  const handleAddToCalendar = (event: CalendarData['events'][0]) => {
    const calendarEvent = createEventFromProgram(
      event.title,
      event.date,
      event.time,
      event.location,
      event.description
    );

    const url = createGoogleCalendarUrl(calendarEvent);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className="border border-gray-300 rounded-md px-4">
        <AccordionTrigger className="text-sm font-semibold text-gray-900 hover:no-underline">
          {title}
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2 pt-2">
            {data.events.map((event, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-md p-3 flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {event.date} • {event.time}
                  </p>
                  {event.location && (
                    <p className="text-xs text-gray-500 mt-0.5">{event.location}</p>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCalendar(event)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white rounded-md text-xs font-medium hover:bg-gray-800 transition-colors"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>캘린더 추가</span>
                </button>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
