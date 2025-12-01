import { DetailCard } from "../types";
import KeyValueCard from "./KeyValueCard";
import GridCard from "./GridCard";
import TableCard from "./TableCard";
import CalendarCard from "./CalendarCard";
import MapCard from "./MapCard";

interface CardRendererProps {
  cards: DetailCard[];
}

export default function CardRenderer({ cards }: CardRendererProps) {
  return (
    <div className="flex justify-start mt-2">
      <div className="max-w-[95%] w-full space-y-3">
        {cards.map((card, idx) => {
          switch (card.type) {
            case "keyvalue":
              return <KeyValueCard key={idx} title={card.title} data={card.data} />;

            case "grid":
              return <GridCard key={idx} title={card.title} data={card.data} />;

            case "table":
              return <TableCard key={idx} title={card.title} data={card.data} />;

            case "calendar":
              return <CalendarCard key={idx} title={card.title} data={card.data} />;

            case "map":
              return <MapCard key={idx} title={card.title} data={card.data} />;

            default:
              console.warn(`Unknown card type: ${card.type}`);
              return null;
          }
        })}
      </div>
    </div>
  );
}
