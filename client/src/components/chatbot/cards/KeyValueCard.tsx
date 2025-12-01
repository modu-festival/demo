import { KeyValueData } from "../types";

interface KeyValueCardProps {
  title: string;
  data: KeyValueData;
}

export default function KeyValueCard({ title, data }: KeyValueCardProps) {
  return (
    <div className="rounded-2xl bg-gray-100/80 backdrop-blur-sm px-4 py-3">
      <h4 className="text-[13px] font-semibold text-gray-800 -tracking-[0.01em] mb-2.5">
        {title}
      </h4>
      <div className="space-y-1.5">
        {data.items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-[13px] -tracking-[0.01em]"
          >
            <span className="text-gray-700 font-medium">{item.key}</span>
            <span
              className={`font-semibold ${
                item.highlight ? "text-blue-700" : "text-gray-900"
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
