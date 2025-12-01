import { MapData } from "../types";

interface MapCardProps {
  title: string;
  data: MapData;
}

export default function MapCard({ title, data }: MapCardProps) {
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || "";

  // Google Maps Embed URL 생성
  const getMapUrl = (): string => {
    if (!apiKey) {
      console.error("Google Maps API key is not set");
      return "";
    }

    // 주소가 있으면 주소 기반 검색 우선
    if (data.address) {
      return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(data.address)}`;
    }

    // 좌표가 있으면 좌표 기반
    if (data.lat && data.lng) {
      const zoom = data.zoom || 15;
      return `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${data.lat},${data.lng}&zoom=${zoom}`;
    }

    return "";
  };

  const mapUrl = getMapUrl();

  if (!mapUrl) {
    return (
      <div className="rounded-2xl bg-gray-100/80 backdrop-blur-sm px-4 py-3">
        <h4 className="text-[13px] font-semibold text-gray-800 -tracking-[0.01em] mb-2">
          {title}
        </h4>
        <p className="text-[12px] text-gray-600">
          지도를 표시할 수 없습니다. 주소 또는 좌표 정보가 필요합니다.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gray-100/80 backdrop-blur-sm overflow-hidden">
      <div className="px-4 py-3">
        <h4 className="text-[13px] font-semibold text-gray-800 -tracking-[0.01em]">
          {title}
        </h4>
      </div>
      <div className="w-full aspect-[16/10]">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={title}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
