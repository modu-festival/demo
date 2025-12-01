/**
 * Google Calendar 관련 유틸리티 함수
 */

export interface CalendarEvent {
  title: string;
  description?: string;
  location?: string;
  startDate: string; // ISO 8601 형식 (YYYY-MM-DDTHH:mm:ss) 또는 YYYYMMDDTHHMMSS
  endDate: string;
}

/**
 * 날짜를 Google Calendar URL 형식으로 변환
 * ISO 8601 형식 (YYYY-MM-DDTHH:mm:ss)을 YYYYMMDDTHHMMSS 형식으로 변환
 * 타임존 정보 없이 로컬 시간으로 처리
 */
function formatDateForGoogleCalendar(dateStr: string): string {
  // 이미 YYYYMMDDTHHMMSS 형식이면 그대로 사용
  if (/^\d{8}T\d{6}$/.test(dateStr)) {
    return dateStr;
  }

  // ISO 8601 형식 변환 (YYYY-MM-DDTHH:mm:ss 형태)
  // 로컬 시간을 유지하기 위해 문자열 파싱 사용
  const [datePart, timePart] = dateStr.split('T');
  const [year, month, day] = datePart.split('-');
  const [hours, minutes, seconds = '00'] = timePart.split(':');

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

/**
 * Google Calendar에 이벤트 추가 URL 생성
 * @param event 캘린더 이벤트 정보
 * @returns Google Calendar URL
 */
export function createGoogleCalendarUrl(event: CalendarEvent): string {
  const baseUrl = 'https://calendar.google.com/calendar/render';

  const startFormatted = formatDateForGoogleCalendar(event.startDate);
  const endFormatted = formatDateForGoogleCalendar(event.endDate);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startFormatted}/${endFormatted}`,
  });

  if (event.description) {
    params.append('details', event.description);
  }

  if (event.location) {
    params.append('location', event.location);
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * .ics 파일 생성 (iCalendar 형식)
 * @param event 캘린더 이벤트 정보
 * @returns .ics 파일 Blob
 */
export function createICSFile(event: CalendarEvent): Blob {
  const startFormatted = formatDateForGoogleCalendar(event.startDate).replace(/[-:]/g, '');
  const endFormatted = formatDateForGoogleCalendar(event.endDate).replace(/[-:]/g, '');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//시흥갯골축제//NONSGML v1.0//EN',
    'BEGIN:VEVENT',
    `DTSTART:${startFormatted}`,
    `DTEND:${endFormatted}`,
    `SUMMARY:${event.title}`,
    event.description ? `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}` : '',
    event.location ? `LOCATION:${event.location}` : '',
    `UID:${Date.now()}@siheunggaetgol.com`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');

  return new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
}

/**
 * .ics 파일 다운로드
 * @param event 캘린더 이벤트 정보
 * @param filename 파일명 (기본값: event.ics)
 */
export function downloadICSFile(event: CalendarEvent, filename: string = 'event.ics'): void {
  const blob = createICSFile(event);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 프로그램 정보를 CalendarEvent로 변환
 * @param programName 프로그램 이름
 * @param date 날짜 (YYYY-MM-DD)
 * @param time 시간 (HH:mm~HH:mm 또는 HH:mm)
 * @param location 장소
 * @param description 설명
 */
export function createEventFromProgram(
  programName: string,
  date: string,
  time: string,
  location?: string,
  description?: string
): CalendarEvent {
  // 시간 파싱 (예: "14:00~16:00" 또는 "14:00")
  const timeParts = time.split('~');
  const startTime = timeParts[0].trim();
  const endTime = timeParts[1]?.trim() || startTime;

  // ISO 8601 형식으로 날짜 생성
  const startDate = `${date}T${startTime}:00`;

  // 종료 시간 처리
  let endDate = `${date}T${endTime}:00`;

  // 종료 시간이 없으면 1시간 추가
  if (!timeParts[1]) {
    const start = new Date(startDate);
    start.setHours(start.getHours() + 1);
    endDate = start.toISOString().slice(0, 16) + ':00';
  }

  return {
    title: `[시흥갯골축제] ${programName}`,
    description: description || `${programName} 프로그램`,
    location: location || '시흥갯골생태공원',
    startDate,
    endDate,
  };
}
