import type { FestivalInfo, Announcement, GalleryItem, FoodZone, ProgramCategory, GoodsItem, LocationInfo } from "@shared/schema";

export const festivalInfo: FestivalInfo = {
  name: {
    ko: "20주년 시흥 갯골축제",
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
    ko: "무료 (일부체험프로그램 유료)",
    en: "Free Admission",
    zh: "免费入场",
    ja: "無料入場",
  },
};

export const announcements: Announcement[] = [
  {
    id: "1",
    title: {
      ko: "우천 취소 안내",
      en: "Festival Opening Notice",
      zh: "节日开幕通知",
      ja: "フェスティバル開催のお知らせ",
    },
    content: {
      ko: "햔재 비로 인해 열기구 / 소금에 빠지새오 / 갯골버스킹 오전 진행이 불가하며 갯골요가 / 염부체험 우천 취소입니다.",
      en: "The festival will be held for 3 days from May 26 to 28, 2025. We look forward to your interest and participation.",
      zh: "节日将于2025年5月26日至28日举行，为期3天。期待您的关注和参与。",
      ja: "2025年5月26日から28日までの3日間開催されます。皆様のご関心とご参加をお待ちしております。",
    },
    date: "2025-05-01",
  },
  // {
  //   id: "2",
  //   title: {
  //     ko: "주차 및 교통 안내",
  //     en: "Parking and Transportation Guide",
  //     zh: "停车和交通指南",
  //     ja: "駐車と交通案内",
  //   },
  //   content: {
  //     ko: "축제 기간 중 주차장이 혼잡할 수 있으니 대중교통 이용을 권장합니다.",
  //     en: "Parking lots may be crowded during the festival. We recommend using public transportation.",
  //     zh: "节日期间停车场可能会很拥挤。建议使用公共交通。",
  //     ja: "フェスティバル期間中は駐車場が混雑する可能性があります。公共交通機関のご利用をお勧めします。",
  //   },
  //   date: "2025-05-10",
  // },
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

export const programCategories: ProgramCategory[] = [
  {
    id: "performance",
    name: {
      ko: "공연 프로그램",
      en: "Performance Program",
      zh: "演出节目",
      ja: "公演プログラム",
    },
    performances: [
      {
        id: "gaetgol-busking",
        name: {
          ko: "갯골버스킹",
          en: "Gaetgol Busking",
          zh: "盖特谷街头表演",
          ja: "ゲットゴルバスキング",
        },
        location: {
          ko: "갯골광장",
          en: "Gaetgol Square",
          zh: "盖特谷广场",
          ja: "ゲットゴル広場",
        },
        price: {
          ko: "무료",
          en: "Free",
          zh: "免费",
          ja: "無料",
        },
        description: {
          ko: "자유로운 분위기의 거리 공연",
          en: "Free-spirited street performances",
          zh: "自由氛围的街头表演",
          ja: "自由な雰囲気のストリートパフォーマンス",
        },
        badge: {
          ko: "상시",
          en: "Always",
          zh: "常设",
          ja: "常設",
        },
        schedule: [
          {
            date: "2025-05-26",
            sessions: [{ sessionNumber: 1, time: "14:00 ~ 16:00" }],
          },
          {
            date: "2025-05-27",
            sessions: [
              { sessionNumber: 1, time: "14:00 ~ 17:00" },
              { sessionNumber: 2, time: "18:00 ~ 20:00" },
            ],
          },
          {
            date: "2025-05-28",
            sessions: [{ sessionNumber: 1, time: "15:00 ~ 17:00" }],
          },
        ],
      },
      {
        id: "gaetgol-chunmong",
        name: {
          ko: "갯골 춘몽",
          en: "Gaetgol Chunmong",
          zh: "盖特谷春梦",
          ja: "ゲットゴル春夢",
        },
        location: {
          ko: "야외무대",
          en: "Outdoor Stage",
          zh: "户外舞台",
          ja: "屋外ステージ",
        },
        price: {
          ko: "5,000원",
          en: "5,000 KRW",
          zh: "5,000韩元",
          ja: "5,000ウォン",
        },
        description: {
          ko: "전통과 현대가 어우러진 특별 공연",
          en: "Special performance blending tradition and modernity",
          zh: "传统与现代融合的特别演出",
          ja: "伝統と現代が融合した特別公演",
        },
        schedule: [
          {
            date: "2025-05-27",
            sessions: [{ sessionNumber: 1, time: "19:00 ~ 20:30" }],
          },
          {
            date: "2025-05-28",
            sessions: [{ sessionNumber: 1, time: "16:00 ~ 17:30" }],
          },
        ],
      },
      {
        id: "salt-warehouse-puppet",
        name: {
          ko: "소금창고 인형극장",
          en: "Salt Warehouse Puppet Theater",
          zh: "盐仓木偶剧场",
          ja: "塩倉庫人形劇場",
        },
        location: {
          ko: "소금창고",
          en: "Salt Warehouse",
          zh: "盐仓",
          ja: "塩倉庫",
        },
        price: {
          ko: "무료",
          en: "Free",
          zh: "免费",
          ja: "無料",
        },
        description: {
          ko: "어린이를 위한 즐거운 인형극",
          en: "Delightful puppet show for children",
          zh: "儿童趣味木偶戏",
          ja: "子供のための楽しい人形劇",
        },
        schedule: [
          {
            date: "2025-05-26",
            sessions: [
              { sessionNumber: 1, time: "11:00 ~ 12:00" },
              { sessionNumber: 2, time: "15:00 ~ 16:00" },
            ],
          },
          {
            date: "2025-05-27",
            sessions: [
              { sessionNumber: 1, time: "11:00 ~ 12:00" },
              { sessionNumber: 2, time: "15:00 ~ 16:00" },
            ],
          },
          {
            date: "2025-05-28",
            sessions: [{ sessionNumber: 1, time: "11:00 ~ 12:00" }],
          },
        ],
      },
      {
        id: "hundred-guitars",
        name: {
          ko: "100인의 기타 둥둥",
          en: "100 Guitars Dongdong",
          zh: "百人吉他咚咚",
          ja: "100人のギタードンドン",
        },
        location: {
          ko: "메인 스테이지",
          en: "Main Stage",
          zh: "主舞台",
          ja: "メインステージ",
        },
        price: {
          ko: "무료",
          en: "Free",
          zh: "免费",
          ja: "無料",
        },
        description: {
          ko: "100명의 기타리스트가 함께하는 대규모 공연",
          en: "Large-scale performance with 100 guitarists",
          zh: "100位吉他手共同演出的大型表演",
          ja: "100人のギタリストによる大規模公演",
        },
        schedule: [
          {
            date: "2025-05-27",
            sessions: [{ sessionNumber: 1, time: "16:00 ~ 18:00" }],
          },
        ],
      },
      {
        id: "forest-music-festival",
        name: {
          ko: "나무숲 음악제",
          en: "Forest Music Festival",
          zh: "森林音乐节",
          ja: "森林音楽祭",
        },
        location: {
          ko: "나무숲 야외무대",
          en: "Forest Outdoor Stage",
          zh: "森林户外舞台",
          ja: "森林屋外ステージ",
        },
        price: {
          ko: "10,000원",
          en: "10,000 KRW",
          zh: "10,000韩元",
          ja: "10,000ウォン",
        },
        description: {
          ko: "자연 속에서 즐기는 음악 축제",
          en: "Music festival in nature",
          zh: "在自然中享受的音乐节",
          ja: "自然の中で楽しむ音楽祭",
        },
        schedule: [
          {
            date: "2025-05-26",
            sessions: [{ sessionNumber: 1, time: "17:00 ~ 19:00" }],
          },
          {
            date: "2025-05-28",
            sessions: [{ sessionNumber: 1, time: "14:00 ~ 16:00" }],
          },
        ],
      },
    ],
  },
  {
    id: "special",
    name: {
      ko: "특별 프로그램",
      en: "Special Program",
      zh: "特别节目",
      ja: "特別プログラム",
    },
    performances: [
      {
        id: "opening-ceremony",
        name: {
          ko: "개막식",
          en: "Opening Ceremony",
          zh: "开幕式",
          ja: "開会式",
        },
        location: {
          ko: "메인 스테이지",
          en: "Main Stage",
          zh: "主舞台",
          ja: "メインステージ",
        },
        price: {
          ko: "무료",
          en: "Free",
          zh: "免费",
          ja: "無料",
        },
        description: {
          ko: "모두의 축제 개막을 알리는 특별 행사",
          en: "Special event announcing the opening of Modu Festival",
          zh: "宣布大家节日开幕的特别活动",
          ja: "みんなの祭り開幕を告げる特別イベント",
        },
        schedule: [
          {
            date: "2025-05-26",
            sessions: [{ sessionNumber: 1, time: "10:00 ~ 11:00" }],
          },
        ],
      },
      {
        id: "fireworks",
        name: {
          ko: "불꽃놀이",
          en: "Fireworks",
          zh: "焰火表演",
          ja: "花火大会",
        },
        location: {
          ko: "한강 수변",
          en: "Han River Waterfront",
          zh: "汉江水边",
          ja: "漢江水辺",
        },
        price: {
          ko: "무료",
          en: "Free",
          zh: "免费",
          ja: "無料",
        },
        description: {
          ko: "화려한 불꽃으로 밤하늘을 수놓는 특별 이벤트",
          en: "Special event painting the night sky with brilliant fireworks",
          zh: "用绚丽烟花装点夜空的特别活动",
          ja: "華やかな花火で夜空を彩る特別イベント",
        },
        schedule: [
          {
            date: "2025-05-28",
            sessions: [{ sessionNumber: 1, time: "20:00 ~ 20:30" }],
          },
        ],
      },
    ],
  },
  {
    id: "participation",
    name: {
      ko: "참여 체험 프로그램",
      en: "Participation Experience Program",
      zh: "参与体验节目",
      ja: "参加体験プログラム",
    },
    performances: [
      {
        id: "craft-workshop",
        name: {
          ko: "전통 공예 체험",
          en: "Traditional Craft Workshop",
          zh: "传统工艺体验",
          ja: "伝統工芸体験",
        },
        location: {
          ko: "체험관",
          en: "Experience Hall",
          zh: "体验馆",
          ja: "体験館",
        },
        price: {
          ko: "5,000원",
          en: "5,000 KRW",
          zh: "5,000韩元",
          ja: "5,000ウォン",
        },
        description: {
          ko: "전통 공예품을 직접 만들어보는 체험",
          en: "Hands-on experience making traditional crafts",
          zh: "亲手制作传统工艺品的体验",
          ja: "伝統工芸品を直接作る体験",
        },
        schedule: [
          {
            date: "2025-05-26",
            sessions: [
              { sessionNumber: 1, time: "10:00 ~ 12:00" },
              { sessionNumber: 2, time: "14:00 ~ 16:00" },
            ],
          },
          {
            date: "2025-05-27",
            sessions: [
              { sessionNumber: 1, time: "10:00 ~ 12:00" },
              { sessionNumber: 2, time: "14:00 ~ 16:00" },
            ],
          },
          {
            date: "2025-05-28",
            sessions: [{ sessionNumber: 1, time: "10:00 ~ 12:00" }],
          },
        ],
      },
      {
        id: "dance-together",
        name: {
          ko: "함께 춤춰요",
          en: "Let's Dance Together",
          zh: "一起跳舞",
          ja: "一緒に踊ろう",
        },
        location: {
          ko: "야외 광장",
          en: "Outdoor Plaza",
          zh: "户外广场",
          ja: "屋外広場",
        },
        price: {
          ko: "무료",
          en: "Free",
          zh: "免费",
          ja: "無料",
        },
        description: {
          ko: "누구나 참여 가능한 단체 댄스 프로그램",
          en: "Group dance program open to everyone",
          zh: "任何人都可以参加的集体舞蹈节目",
          ja: "誰でも参加できる団体ダンスプログラム",
        },
        schedule: [
          {
            date: "2025-05-27",
            sessions: [{ sessionNumber: 1, time: "13:00 ~ 14:00" }],
          },
          {
            date: "2025-05-28",
            sessions: [{ sessionNumber: 1, time: "13:00 ~ 14:00" }],
          },
        ],
      },
    ],
  },
];

export const goodsItems: GoodsItem[] = [
  {
    id: "g1",
    name: {
      ko: "해로토로 키링 인형",
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
      ko: "해로토로 크로스백 파우치",
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
