import type { Language } from "@shared/schema";
import { goodsItems } from "@/data/festivalData";
import { getTranslation } from "@/lib/translations";

interface GoodsSectionProps {
  lang: Language;
}

export function GoodsSection({ lang }: GoodsSectionProps) {
  return (
    <div className="bg-white px-6 py-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{getTranslation(lang, "goods")}</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {goodsItems.map((item) => (
          <div
            key={item.id}
            data-testid={`goods-item-${item.id}`}
            className="bg-gray-50 rounded-md overflow-hidden"
          >
            <div className="aspect-square bg-gray-200">
              <img
                src={item.imageUrl}
                alt={item.name[lang]}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-[13px] text-gray-900">{item.name[lang]}</h3>
              <p className="text-[16px] font-semibold text-gray-900">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
