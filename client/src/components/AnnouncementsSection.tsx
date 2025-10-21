import type { Language } from "@shared/schema";
import { announcements } from "@/data/festivalData";
import { getTranslation } from "@/lib/translations";
import { Megaphone } from "lucide-react";

interface AnnouncementsSectionProps {
  lang: Language;
}

export function AnnouncementsSection({ lang }: AnnouncementsSectionProps) {
  return (
    <div className="bg-white px-6 pb-4">
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            data-testid={`announcement-${announcement.id}`}
            className="bg-gray-100 rounded-md p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              {/* <Megaphone className="h-4 w-4 text-gray-900 flex-shrink-0" /> */}
              <h3 className="text-[14px] font-semibold text-gray-900">
                {announcement.title[lang]}
              </h3>
            </div>

            <p className="text-[13px] font-medium text-gray-700">
              {announcement.content[lang]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
