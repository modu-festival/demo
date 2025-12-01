import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TableData } from "../types";

interface TableCardProps {
  title: string;
  data: TableData;
}

export default function TableCard({ title, data }: TableCardProps) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className="border border-gray-300 rounded-md px-4">
        <AccordionTrigger className="text-sm font-semibold text-gray-900 hover:no-underline">
          {title}
        </AccordionTrigger>
        <AccordionContent>
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  {data.headers.map((header, idx) => (
                    <th
                      key={idx}
                      className="text-left px-2 py-2 font-semibold text-gray-900 whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className="px-2 py-2 text-gray-800 font-medium whitespace-nowrap"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
