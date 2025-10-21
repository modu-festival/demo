import type { Language } from "@shared/schema";
import { galleryItems } from "@/data/festivalData";
import { getTranslation } from "@/lib/translations";

interface GallerySectionProps {
  lang: Language;
}

export function GallerySection({ lang }: GallerySectionProps) {
  return (
    <div className="bg-white px-6 py-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{getTranslation(lang, "gallery")}</h2>
      
      <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
        <div className="flex gap-4 pb-2">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              data-testid={`gallery-item-${item.id}`}
              className="flex-shrink-0 w-[280px]"
            >
              <div className="rounded-md overflow-hidden bg-gray-200">
                <img
                  src={item.imageUrl}
                  alt={item.caption?.[lang] || ""}
                  className="w-full h-[210px] object-cover"
                  loading="lazy"
                />
              </div>
              {item.caption && (
                <p className="text-sm text-gray-700 mt-2">{item.caption[lang]}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
