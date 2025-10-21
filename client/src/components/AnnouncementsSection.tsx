import type { Language } from "@shared/schema";
import { announcements } from "@/data/festivalData";
import { getTranslation } from "@/lib/translations";
import { Megaphone } from "lucide-react";

interface AnnouncementsSectionProps {
  lang: Language;
}

export function AnnouncementsSection({ lang }: AnnouncementsSectionProps) {
  return (
    <div className="bg-white px-6 py-8">
      <div className="flex items-center gap-2 mb-4">
        <Megaphone className="h-5 w-5 text-modu-red" />
        <h2 className="text-xl font-bold text-gray-900">{getTranslation(lang, "announcements")}</h2>
      </div>
      
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            data-testid={`announcement-${announcement.id}`}
            className="bg-gray-100 rounded-md p-4"
          >
            <h3 className="font-semibold text-gray-900 mb-2">{announcement.title[lang]}</h3>
            <p className="text-sm text-gray-700 mb-2">{announcement.content[lang]}</p>
            <p className="text-xs text-gray-500">{announcement.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
