import type { FestivalInfo, Announcement, GalleryItem, FoodZone, Program, GoodsItem, LocationInfo } from "@shared/schema";

export const festivalInfo: FestivalInfo = {
  name: {
    ko: "모두의 축제",
    en: "Modu Festival",
    zh: "大家的节日",
    ja: "みんなの祭り",
  },
  dates: {
    ko: "2025년 5월 26일 (금) - 5월 28일 (일)",
    en: "May 26 (Fri) - May 28 (Sun), 2025",
    zh: "2025年5月26日（周五）- 5月28日（周日）",
    ja: "2025年5月26日（金）- 5月28日（日）",
  },
  location: {
    ko: "서울 한강공원 여의도 지구",
    en: "Yeouido Hangang Park, Seoul",
    zh: "首尔汉江公园汝矣岛地区",
    ja: "ソウル漢江公園汝矣島地区",
  },
  price: {
    ko: "무료 입장",
    en: "Free Admission",
    zh: "免费入场",
    ja: "無料入場",
  },
};

export const announcements: Announcement[] = [
  {
    id: "1",
    title: {
      ko: "축제 개최 안내",
      en: "Festival Opening Notice",
      zh: "节日开幕通知",
      ja: "フェスティバル開催のお知らせ",
    },
    content: {
      ko: "2025년 5월 26일부터 28일까지 3일간 진행됩니다. 많은 관심과 참여 부탁드립니다.",
      en: "The festival will be held for 3 days from May 26 to 28, 2025. We look forward to your interest and participation.",
      zh: "节日将于2025年5月26日至28日举行，为期3天。期待您的关注和参与。",
      ja: "2025年5月26日から28日までの3日間開催されます。皆様のご関心とご参加をお待ちしております。",
    },
    date: "2025-05-01",
  },
  {
    id: "2",
    title: {
      ko: "주차 및 교통 안내",
      en: "Parking and Transportation Guide",
      zh: "停车和交通指南",
      ja: "駐車と交通案内",
    },
    content: {
      ko: "축제 기간 중 주차장이 혼잡할 수 있으니 대중교통 이용을 권장합니다.",
      en: "Parking lots may be crowded during the festival. We recommend using public transportation.",
      zh: "节日期间停车场可能会很拥挤。建议使用公共交通。",
      ja: "フェスティバル期間中は駐車場が混雑する可能性があります。公共交通機関のご利用をお勧めします。",
    },
    date: "2025-05-10",
  },
];

export const galleryItems: GalleryItem[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop",
    caption: {
      ko: "2024 축제 현장",
      en: "2024 Festival Scene",
      zh: "2024节日现场",
      ja: "2024フェスティバル会場",
    },
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
    caption: {
      ko: "공연 무대",
      en: "Performance Stage",
      zh: "演出舞台",
      ja: "パフォーマンスステージ",
    },
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
    caption: {
      ko: "음악 공연",
      en: "Music Performance",
      zh: "音乐表演",
      ja: "音楽パフォーマンス",
    },
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=600&fit=crop",
    caption: {
      ko: "먹거리 존",
      en: "Food Zone",
      zh: "美食区",
      ja: "フードゾーン",
    },
  },
];

export const foodZones: FoodZone[] = [
  {
    id: "zone-a",
    name: {
      ko: "식음존 A",
      en: "Food Zone A",
      zh: "美食区 A",
      ja: "フードゾーン A",
    },
    restaurants: [
      {
        id: "a1",
        name: {
          ko: "한식당",
          en: "Korean Restaurant",
          zh: "韩国餐厅",
          ja: "韓国料理店",
        },
        menu: [
          { name: { ko: "비빔밥", en: "Bibimbap", zh: "拌饭", ja: "ビビンバ" }, price: "12,000원" },
          { name: { ko: "김치찌개", en: "Kimchi Stew", zh: "泡菜汤", ja: "キムチチゲ" }, price: "10,000원" },
          { name: { ko: "불고기", en: "Bulgogi", zh: "烤肉", ja: "プルコギ" }, price: "15,000원" },
        ],
      },
      {
        id: "a2",
        name: {
          ko: "분식집",
          en: "Snack Bar",
          zh: "小吃店",
          ja: "軽食店",
        },
        menu: [
          { name: { ko: "떡볶이", en: "Tteokbokki", zh: "炒年糕", ja: "トッポッキ" }, price: "5,000원" },
          { name: { ko: "순대", en: "Sundae", zh: "血肠", ja: "スンデ" }, price: "6,000원" },
          { name: { ko: "튀김", en: "Fried Food", zh: "油炸食品", ja: "揚げ物" }, price: "4,000원" },
        ],
      },
    ],
  },
  {
    id: "zone-b",
    name: {
      ko: "식음존 B",
      en: "Food Zone B",
      zh: "美食区 B",
      ja: "フードゾーン B",
    },
    restaurants: [
      {
        id: "b1",
        name: {
          ko: "치킨 전문점",
          en: "Chicken House",
          zh: "炸鸡店",
          ja: "チキン専門店",
        },
        menu: [
          { name: { ko: "후라이드 치킨", en: "Fried Chicken", zh: "炸鸡", ja: "フライドチキン" }, price: "18,000원" },
          { name: { ko: "양념 치킨", en: "Spicy Chicken", zh: "调味鸡", ja: "ヤンニョムチキン" }, price: "19,000원" },
        ],
      },
      {
        id: "b2",
        name: {
          ko: "피자 가게",
          en: "Pizza Shop",
          zh: "披萨店",
          ja: "ピザショップ",
        },
        menu: [
          { name: { ko: "페퍼로니 피자", en: "Pepperoni Pizza", zh: "意大利辣香肠披萨", ja: "ペパロニピザ" }, price: "22,000원" },
          { name: { ko: "콤비네이션 피자", en: "Combination Pizza", zh: "综合披萨", ja: "コンビネーションピザ" }, price: "25,000원" },
        ],
      },
    ],
  },
  {
    id: "zone-c",
    name: {
      ko: "식음존 C",
      en: "Food Zone C",
      zh: "美食区 C",
      ja: "フードゾーン C",
    },
    restaurants: [
      {
        id: "c1",
        name: {
          ko: "카페",
          en: "Cafe",
          zh: "咖啡厅",
          ja: "カフェ",
        },
        menu: [
          { name: { ko: "아메리카노", en: "Americano", zh: "美式咖啡", ja: "アメリカーノ" }, price: "4,500원" },
          { name: { ko: "카페 라떼", en: "Cafe Latte", zh: "拿铁咖啡", ja: "カフェラテ" }, price: "5,000원" },
          { name: { ko: "에이드", en: "Ade", zh: "果汁饮料", ja: "エード" }, price: "6,000원" },
        ],
      },
      {
        id: "c2",
        name: {
          ko: "디저트 가게",
          en: "Dessert Shop",
          zh: "甜品店",
          ja: "デザートショップ",
        },
        menu: [
          { name: { ko: "와플", en: "Waffle", zh: "华夫饼", ja: "ワッフル" }, price: "7,000원" },
          { name: { ko: "아이스크림", en: "Ice Cream", zh: "冰淇淋", ja: "アイスクリーム" }, price: "5,000원" },
        ],
      },
    ],
  },
];

export const programs: Program[] = [
  {
    id: "p1",
    title: {
      ko: "개막 공연",
      en: "Opening Performance",
      zh: "开幕演出",
      ja: "オープニングパフォーマンス",
    },
    date: "2025-05-26",
    time: "18:00",
    location: {
      ko: "메인 스테이지",
      en: "Main Stage",
      zh: "主舞台",
      ja: "メインステージ",
    },
    description: {
      ko: "화려한 개막 공연으로 축제의 시작을 알립니다.",
      en: "A spectacular opening performance to kick off the festival.",
      zh: "以华丽的开幕演出开始节日。",
      ja: "華やかなオープニングパフォーマンスでフェスティバルの始まりを告げます。",
    },
  },
  {
    id: "p2",
    title: {
      ko: "K-POP 콘서트",
      en: "K-POP Concert",
      zh: "K-POP 演唱会",
      ja: "K-POPコンサート",
    },
    date: "2025-05-26",
    time: "20:00",
    location: {
      ko: "메인 스테이지",
      en: "Main Stage",
      zh: "主舞台",
      ja: "メインステージ",
    },
  },
  {
    id: "p3",
    title: {
      ko: "전통 공연",
      en: "Traditional Performance",
      zh: "传统表演",
      ja: "伝統芸能",
    },
    date: "2025-05-27",
    time: "15:00",
    location: {
      ko: "야외 무대",
      en: "Outdoor Stage",
      zh: "户外舞台",
      ja: "屋外ステージ",
    },
  },
  {
    id: "p4",
    title: {
      ko: "인디 밴드 공연",
      en: "Indie Band Performance",
      zh: "独立乐队演出",
      ja: "インディーバンドパフォーマンス",
    },
    date: "2025-05-27",
    time: "19:00",
    location: {
      ko: "메인 스테이지",
      en: "Main Stage",
      zh: "主舞台",
      ja: "メインステージ",
    },
  },
  {
    id: "p5",
    title: {
      ko: "폐막 공연",
      en: "Closing Performance",
      zh: "闭幕演出",
      ja: "クロージングパフォーマンス",
    },
    date: "2025-05-28",
    time: "21:00",
    location: {
      ko: "메인 스테이지",
      en: "Main Stage",
      zh: "主舞台",
      ja: "メインステージ",
    },
  },
];

export const goodsItems: GoodsItem[] = [
  {
    id: "g1",
    name: {
      ko: "축제 티셔츠",
      en: "Festival T-Shirt",
      zh: "节日T恤",
      ja: "フェスティバルTシャツ",
    },
    price: "25,000원",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
  },
  {
    id: "g2",
    name: {
      ko: "에코백",
      en: "Eco Bag",
      zh: "环保袋",
      ja: "エコバッグ",
    },
    price: "15,000원",
    imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop",
  },
  {
    id: "g3",
    name: {
      ko: "머그컵",
      en: "Mug Cup",
      zh: "马克杯",
      ja: "マグカップ",
    },
    price: "12,000원",
    imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop",
  },
  {
    id: "g4",
    name: {
      ko: "스티커 세트",
      en: "Sticker Set",
      zh: "贴纸套装",
      ja: "ステッカーセット",
    },
    price: "8,000원",
    imageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop",
  },
];

export const locationInfo: LocationInfo = {
  address: {
    ko: "서울특별시 영등포구 여의동로 330 한강공원 여의도지구",
    en: "330 Yeouidong-ro, Yeongdeungpo-gu, Seoul, Yeouido Hangang Park",
    zh: "首尔特别市永登浦区汝矣岛路330号汉江公园汝矣岛地区",
    ja: "ソウル特別市永登浦区汝矣島路330 漢江公園汝矣島地区",
  },
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3164.289!2d126.932!3d37.529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDMxJzQ0LjQiTiAxMjbCsDU1JzU1LjIiRQ!5e0!3m2!1sen!2skr!4v1234567890",
  parking: {
    ko: "한강공원 주차장 이용 가능 (유료)",
    en: "Hangang Park parking available (paid)",
    zh: "可使用汉江公园停车场（收费）",
    ja: "漢江公園駐車場利用可能（有料）",
  },
  publicTransport: {
    ko: "지하철 5호선, 9호선 여의도역 3번 출구에서 도보 10분",
    en: "10 min walk from Yeouido Station (Line 5, 9) Exit 3",
    zh: "从汝矣岛站（5号线、9号线）3号出口步行10分钟",
    ja: "地下鉄5号線・9号線汝矣島駅3番出口から徒歩10分",
  },
};
