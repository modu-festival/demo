export type MessageRole = "user" | "assistant";
export type MessageType = "text" | "image" | "map";

// 데이터 구조 기반 카드 타입
export type CardType = "keyvalue" | "grid" | "table" | "calendar" | "map";

// Key-Value 카드 데이터
export interface KeyValueData {
  items: {
    key: string;
    value: string;
    highlight?: boolean; // 강조 표시할지
  }[];
}

// Grid 카드 데이터 (카드 그리드)
export interface GridData {
  items: {
    title: string;
    subtitle?: string;
    badge?: string;
    fields?: {
      key: string;
      value: string;
    }[];
  }[];
  columns?: number; // 그리드 컬럼 수 (기본: 1, sm:2)
}

// Table 카드 데이터
export interface TableData {
  headers: string[];
  rows: string[][];
}

// Calendar 카드 데이터
export interface CalendarData {
  events: {
    title: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm~HH:mm
    location?: string;
    description?: string;
  }[];
}

// Map 카드 데이터
export interface MapData {
  address?: string; // 주소 기반 검색
  lat?: number; // 위도
  lng?: number; // 경도
  zoom?: number; // 줌 레벨 (기본: 15)
}

// 카드 인터페이스
export interface DetailCard {
  title: string;
  type: CardType;
  data: KeyValueData | GridData | TableData | CalendarData | MapData | any;
}

// 메시지 인터페이스
export interface Message {
  id: number;
  role: MessageRole;
  type: MessageType;
  content: string;
  url?: string; // image/map 같은 경우 사용
  cards?: DetailCard[]; // 상세 정보 카드들
}
