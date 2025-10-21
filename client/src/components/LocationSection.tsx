import { MapPin } from "lucide-react";
import type { Language } from "@shared/schema";
import { locationInfo } from "@/data/festivalData";
import { getTranslation } from "@/lib/translations";
import locationImage from "@assets/location.png";

// declare global {
//   interface Window {
//     kakao: any;
//   }
// }

interface LocationSectionProps {
  lang: Language;
}

export function LocationSection({ lang }: LocationSectionProps) {
  // const mapRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   console.log("카카오맵 키:", import.meta.env.VITE_KAKAO_MAP_KEY);
  //   // 이미 스크립트가 로드되어 있는지 확인
  //   if (window.kakao && window.kakao.maps) {
  //     initMap();
  //     return;
  //   }

  //   const script = document.createElement("script");
  //   script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
  //     import.meta.env.VITE_KAKAO_MAP_KEY
  //   }&autoload=false`;
  //   script.async = true;

  //   script.onload = () => {
  //     initMap();
  //   };

  //   script.onerror = () => {
  //     console.error("카카오맵 스크립트 로드 실패");
  //   };

  //   document.head.appendChild(script);

  //   return () => {
  //     // 클린업: 필요시 스크립트 제거
  //     // document.head.removeChild(script);
  //   };
  // }, []);

  // const initMap = () => {
  //   if (!mapRef.current) return;

  //   window.kakao.maps.load(() => {
  //     const options = {
  //       center: new window.kakao.maps.LatLng(37.3802, 126.8026),
  //       level: 4,
  //     };

  //     const map = new window.kakao.maps.Map(mapRef.current, options);

  //     // 마커 추가
  //     new window.kakao.maps.Marker({
  //       position: options.center,
  //       map,
  //     });
  //   });
  // };

  return (
    <div className="bg-white px-6 py-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {getTranslation(lang, "location")}
      </h2>

      <p className="text-sm text-gray-900 mb-4">{locationInfo.address[lang]}</p>

      <div className="w-full h-[250px] rounded-md overflow-hidden bg-gray-200">
        <img
          src={locationImage}
          alt="Festival Location"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
