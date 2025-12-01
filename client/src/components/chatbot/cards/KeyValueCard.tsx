import { KeyValueData } from "../types";

interface KeyValueCardProps {
  title: string;
  data: KeyValueData;
}

// 전화번호 형식인지 확인 (예: 031-310-2920, 010-1234-5678)
const isPhoneNumber = (value: string): boolean => {
  return /^\d{2,4}-\d{3,4}-\d{4}$/.test(value.trim());
};

export default function KeyValueCard({ title, data }: KeyValueCardProps) {
  return (
    <div className="rounded-2xl bg-gray-100/80 backdrop-blur-sm px-4 py-3">
      <h4 className="text-[13px] font-semibold text-gray-800 -tracking-[0.01em] mb-2.5">
        {title}
      </h4>
      <div className="space-y-1.5">
        {data.items.map((item, idx) => {
          const isPhone = isPhoneNumber(item.value);

          return (
            <div
              key={idx}
              className="flex items-start justify-between gap-3 text-[13px] -tracking-[0.01em]"
            >
              <span className="text-gray-700 font-medium whitespace-nowrap">{item.key}</span>
              {isPhone ? (
                <a
                  href={`tel:${item.value}`}
                  className="font-semibold text-right [word-break:keep-all] underline underline-offset-2 text-blue-700"
                >
                  {item.value}
                </a>
              ) : (
                <span
                  className={`font-semibold text-right [word-break:keep-all] ${
                    item.highlight ? "text-blue-700" : "text-gray-900"
                  }`}
                >
                  {item.value}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
