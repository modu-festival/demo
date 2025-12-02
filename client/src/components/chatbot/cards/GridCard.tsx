import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GridData } from "../types";

interface GridCardProps {
  title: string;
  data: GridData;
}

export default function GridCard({ title, data }: GridCardProps) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className="border border-gray-300 rounded-md px-4">
        <AccordionTrigger className="text-sm font-semibold text-gray-900 hover:no-underline">
          {title}
        </AccordionTrigger>
        <AccordionContent>
          <div className={`grid gap-2.5 pt-2 ${data.columns === 2 ? 'sm:grid-cols-2' : ''}`}>
            {data.items.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-md p-3 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900">
                      {item.title}
                    </h4>
                    {item.subtitle && (
                      <p className="text-xs text-gray-600 mt-0.5">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                  {item.badge && (
                    <span className="text-xs px-2 py-0.5 bg-gray-800 text-white rounded-sm flex-shrink-0 ml-2 font-medium">
                      {item.badge}
                    </span>
                  )}
                </div>
                {item.fields && item.fields.length > 0 && (
                  <div className="space-y-1 text-xs text-gray-700 mt-2">
                    {item.fields.map((field, fieldIdx) => (
                      <div key={fieldIdx} className="flex items-start gap-2">
                        <span className="font-medium text-gray-600 whitespace-nowrap">
                          {field.key}:
                        </span>
                        <span className="font-medium [word-break:keep-all]">
                          {field.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
