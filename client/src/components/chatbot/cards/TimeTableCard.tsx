import { useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TimeTableData } from "../types";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";

interface TimeTableCardProps {
  title: string;
  data: TimeTableData;
}

// 시간 문자열을 분(minutes)으로 변환
const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// 분을 시간 문자열로 변환
const formatMinutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

// 시간 슬롯 배열 생성
const generateTimeSlots = (startTime: string, endTime: string, interval: number): string[] => {
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);
  const slots: string[] = [];

  for (let current = startMinutes; current <= endMinutes; current += interval) {
    slots.push(formatMinutesToTime(current));
  }

  return slots;
};

// 세션의 정확한 위치 계산 (분 단위)
interface SessionPosition {
  topPx: number;
  heightPx: number;
}

const calculateSessionPosition = (
  sessionStartTime: string,
  sessionEndTime: string,
  tableStartTime: string,
  interval: number
): SessionPosition => {
  const tableStart = parseTimeToMinutes(tableStartTime);
  const sessionStart = parseTimeToMinutes(sessionStartTime);
  const sessionEnd = parseTimeToMinutes(sessionEndTime);

  // 분 단위로 정확한 위치 계산
  let startMinutesFromTable = sessionStart - tableStart;
  let endMinutesFromTable = sessionEnd - tableStart;

  // 범위 체크: 세션이 테이블 시작 전에 시작하는 경우 0으로 제한
  if (startMinutesFromTable < 0) {
    console.warn(`Session starts before table: ${sessionStartTime} < ${tableStartTime}`);
    startMinutesFromTable = 0;
  }

  // 픽셀 단위로 변환 (interval 분마다 64px)
  const pixelsPerMinute = 64 / interval;
  const topPx = startMinutesFromTable * pixelsPerMinute;
  const heightPx = (endMinutesFromTable - startMinutesFromTable) * pixelsPerMinute;

  return { topPx, heightPx };
};

// 시간 헤더 컴포넌트
interface TimeHeaderProps {
  slots: string[];
}

// 시간 슬롯들 컴포넌트
const TimeSlots = ({ slots }: TimeHeaderProps) => (
  <div className="sticky left-0 bg-white z-10 border-r border-gray-300 w-[40px]">
    {slots.map((time) => (
      <div
        key={time}
        className="h-16 flex items-center justify-center text-[11px] font-semibold text-gray-800 border-b border-gray-200"
      >
        {time}
      </div>
    ))}
  </div>
);

// 프로그램별 색상 선택 (프로그램 id 기반)
const getProgramColor = (programId: string): { bg: string; hover: string } => {
  const colors = [
    { bg: "bg-[blue-500/90]", hover: "hover:bg-blue-600/90" },
    { bg: "bg-[#4CBF20]", hover: "hover:bg-green-600/90" },
    { bg: "bg-purple-500/90", hover: "hover:bg-purple-600/90" },
    { bg: "bg-[#FFB45F]", hover: "hover:bg-orange-600/90" },
    { bg: "bg-pink-500/90", hover: "hover:bg-pink-600/90" },
    { bg: "bg-indigo-500/90", hover: "hover:bg-indigo-600/90" },
    { bg: "bg-teal-500/90", hover: "hover:bg-teal-600/90" },
    { bg: "bg-[#FFAAC6]", hover: "hover:bg-red-600/90" },
    { bg: "bg-[#C5C5C5]", hover: "hover:bg-emerald-600/90" },
    { bg: "bg-[#6EBDF0]", hover: "hover:bg-cyan-600/90" },
  ];

  // 프로그램 id를 해시하여 색상 인덱스 선택
  let hash = 0;
  for (let i = 0; i < programId.length; i++) {
    hash = programId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// 프로그램 헤더
interface ProgramHeaderProps {
  name: string;
}

const ProgramHeader = ({ name }: ProgramHeaderProps) => (
  <div className="border-r border-gray-200 w-[70px] flex items-center justify-center px-2 py-1.5 text-[11px] font-semibold text-gray-900 border-b border-gray-300">
    <span className="text-center leading-tight [word-break:keep-all]">
      {name}
    </span>
  </div>
);

// 프로그램 세션 본체
interface ProgramBodyProps {
  program: TimeTableData["programs"][0];
  tableStartTime: string;
  interval: number;
  totalSlots: number;
}

const ProgramBody = ({ program, tableStartTime, interval, totalSlots }: ProgramBodyProps) => {
  const programColor = getProgramColor(program.id);

  return (
    <div className="relative border-r border-gray-200 w-[70px] overflow-hidden">
        {Array.from({ length: totalSlots }).map((_, index) => (
          <div
            key={index}
            className="h-16 border-b border-gray-100"
          />
        ))}

        {/* 세션 블록들 (절대 위치) */}
        {program.sessions.map((session, sessionIndex) => {
          const { topPx, heightPx } = calculateSessionPosition(
            session.startTime,
            session.endTime,
            tableStartTime,
            interval
          );

          return (
            <div
              key={sessionIndex}
              className={`absolute ${programColor.bg} px-1.5 py-2 text-white`}
              style={{
                top: `${topPx}px`,
                height: `${heightPx}px`,
              }}
            >
              <div className="text-[12px] font-bold leading-tight text-white [word-break:keep-all]">
                {session.startTime} - {session.endTime}
              </div>
              {session.note && (
                <div className="text-[10px] font-semibold mt-1 leading-tight [word-break:keep-all]">
                  {session.note}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default function TimeTableCard({ title, data }: TimeTableCardProps) {
  const { timeConfig, programs } = data;
  const timeSlots = generateTimeSlots(
    timeConfig.startTime,
    timeConfig.endTime,
    timeConfig.interval
  );

  const tableRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!tableRef.current || !containerRef.current) return;

    setIsDownloading(true);

    try {
      const element = containerRef.current;

      // 원래 스타일 저장
      const originalOverflow = element.style.overflow;
      const originalWidth = element.style.width;

      // 전체 보이도록 임시 변경
      element.style.overflow = 'visible';
      element.style.width = 'auto';

      // 약간의 딜레이 (브라우저가 리플로우할 시간)
      await new Promise(resolve => setTimeout(resolve, 100));

      // 캡처
      const canvas = await html2canvas(tableRef.current, {
        scale: 2, // 고해상도
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // 다운로드
      const link = document.createElement('a');
      link.download = `timetable-${title.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      // 원래대로 복구
      element.style.overflow = originalOverflow;
      element.style.width = originalWidth;

    } catch (error) {
      console.error('Failed to download timetable:', error);
      alert('타임테이블 다운로드에 실패했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className="border border-gray-300 rounded-md px-4">
        <AccordionTrigger className="text-sm font-semibold text-gray-900 hover:no-underline">
          <div className="flex items-center justify-between w-full pr-2">
            <span>{title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              disabled={isDownloading}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
            >
              <Download className="h-3 w-3" />
              <span>{isDownloading ? '저장 중...' : 'PNG'}</span>
            </button>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div ref={containerRef} className="pt-2 overflow-x-auto">
            <div ref={tableRef} className="inline-block border border-gray-300 overflow-hidden">
              {/* 헤더 행 - 모든 헤더가 같은 높이를 가짐 */}
              <div className="flex">
                <div className="sticky left-0 bg-white z-10 border-r border-gray-300 w-[40px] flex items-center justify-center font-semibold text-[11px] text-gray-600 border-b border-gray-300 py-1.5">
                  시간
                </div>
                {programs.map((program) => (
                  <ProgramHeader key={program.id} name={program.name} />
                ))}
              </div>

              {/* 본체 행 */}
              <div className="flex">
                <TimeSlots slots={timeSlots} />
                {programs.map((program) => (
                  <ProgramBody
                    key={program.id}
                    program={program}
                    tableStartTime={timeConfig.startTime}
                    interval={timeConfig.interval}
                    totalSlots={timeSlots.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
