import type {
  FestivalInfo,
  Announcement,
  GalleryItem,
  FoodZone,
  ProgramCategory,
  GoodsItem,
  LocationInfo,
} from "@shared/schema";

export const festivalInfo: FestivalInfo = {
  name: {
    ko: "20주년 시흥 갯골축제",
    en: "20th Anniversary Siheung Gaetgol Festival",
    zh: "20周年 始兴 갯골节",
    ja: "20周年 シフン ゲットゴル祭り",
  },
  dates: {
    ko: "2025년 9월 26일 (금) - 9월 28일 (일)",
    en: "September 26 (Fri) – September 28 (Sun), 2025",
    zh: "2025年9月26日（ 金 ）- 9月28日（日）",
    ja: "2025年9月26日（金）- 9月28日（日）",
  },
  location: {
    ko: "경기도 시흥시 동서로 287 (장곡동)",
    en: "287 Dongseo-ro, Siheung-si, Gyeonggi-do",
    zh: "京畿道 始兴市 东西路 287（长谷洞）",
    ja: "京畿道 始興市 東西路287（長谷洞）",
  },
  price: {
    ko: "무료 (일부 체험 프로그램 유료)",
    en: "Free (Some experience programs require fee)",
    zh: "免费入场（部分体验项目收费）",
    ja: "無料入場（体験プログラム一部有料）",
  },
};

export const announcements: Announcement[] = [
  {
    id: "1",
    title: {
      ko: "우천 취소 안내",
      en: "Notice: Weather-related Cancellations",
      zh: "雨天取消通知",
      ja: "雨天中止のお知らせ",
    },
    content: {
      ko: "현재 비로 인해 열기구/소금에 빠지새우/갯골버스킹 오전 진행이 불가하며 갯골요가/염부체험 우천 취소입니다.",
      en: "Due to rain, the morning sessions of balloon rides / salt-immersed shrimp / Gaetgol busking are cancelled, and Gaetgol yoga / salt-worker experience are cancelled for the rain.",
      zh: "因雨天，热气球／盐中沉虾／盖特谷街头演出上午场无法进行，盖特谷瑜伽／盐工体验也因雨取消。",
      ja: "雨天のため、熱気球／塩に浸かるエビ／ゲットゴルバスキングの午前回は実施できず、ゲットゴルヨガ／塩工体験も雨天中止となります。",
    },
    date: "2025-09-28",
  },
];

export const galleryItems: GalleryItem[] = [
  {
    id: "1",
    imageUrl:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop",
    caption: {
      ko: "2024 축제 현장",
      en: "2024 Festival Scene",
      zh: "2024节日现场",
      ja: "2024フェスティバル会場",
    },
  },
  {
    id: "2",
    imageUrl:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
    caption: {
      ko: "공연 무대",
      en: "Performance Stage",
      zh: "演出舞台",
      ja: "パフォーマンスステージ",
    },
  },
  {
    id: "3",
    imageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
    caption: {
      ko: "음악 공연",
      en: "Music Performance",
      zh: "音乐表演",
      ja: "音楽パフォーマンス",
    },
  },
  {
    id: "4",
    imageUrl:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=600&fit=crop",
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
          ko: "거창왕족발",
          en: "Geochang Wang Jokbal",
          zh: "居昌王猪脚",
          ja: "コチャン王チョッパル",
        },
        menu: [
          {
            name: {
              ko: "족발(소)",
              en: "Pork Hock (Small)",
              zh: "猪脚（小）",
              ja: "豚足（小）",
            },
            price: "25,000원",
          },
          {
            name: {
              ko: "족발(중)",
              en: "Pork Hock (Medium)",
              zh: "猪脚（中）",
              ja: "豚足（中）",
            },
            price: "35,000원",
          },
          {
            name: {
              ko: "족발(대)",
              en: "Pork Hock (Large)",
              zh: "猪脚（大）",
              ja: "豚足（大）",
            },
            price: "45,000원",
          },
        ],
      },
      {
        id: "a2",
        name: {
          ko: "경기식품",
          en: "Gyeonggi Foods",
          zh: "京畿食品",
          ja: "キョンギ食品",
        },
        menu: [
          {
            name: {
              ko: "30cm 왕핫도그",
              en: "30 cm King Hotdog",
              zh: "30 厘米王热狗",
              ja: "30cm 王ホットドッグ",
            },
            price: "6,000원",
          },
          {
            name: {
              ko: "순대",
              en: "Sundae (Korean blood sausage)",
              zh: "血肠",
              ja: "スンデ",
            },
            price: "6,000원",
          },
          {
            name: {
              ko: "소떡소떡",
              en: "So-Tteok So-Tteok",
              zh: "年糕香肠串",
              ja: "ソトッソトッ（串）",
            },
            price: "4,500원",
          },
        ],
      },
      {
        id: "a3",
        name: {
          ko: "토키타코",
          en: "Toki Taco",
          zh: "托基塔可",
          ja: "トキタコ",
        },
        menu: [
          {
            name: {
              ko: "까르니따스타코 2p",
              en: "Carnitas Taco 2p",
              zh: "墨西哥炖猪肉塔可2个",
              ja: "カルニタスタコ2個",
            },
            price: "11,000원",
          },
          {
            name: {
              ko: "부리또보울(치킨)",
              en: "Burrito Bowl (Chicken)",
              zh: "鸡肉卷碗",
              ja: "ブリトーボウル（チキン）",
            },
            price: "14,000원",
          },
          {
            name: {
              ko: "칠리콘치즈나쵸",
              en: "Chili con Cheese Nachos",
              zh: "辣椒芝士玉米片",
              ja: "チリコンチーズナチョス",
            },
            price: "13,500원",
          },
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
          ko: "배곧마루카페",
          en: "Baegot Maru Cafe",
          zh: "培葛马루咖啡馆",
          ja: "ベゴッマルカフェ",
        },
        menu: [
          {
            name: {
              ko: "지팡이 소금 아이스크림",
              en: "Salt Stick Ice Cream",
              zh: "拐杖盐冰淇淋",
              ja: "杖ソルトアイスクリーム",
            },
            price: "5,000원",
          },
          {
            name: {
              ko: "복숭아 소금에이드",
              en: "Peach Salt Ade",
              zh: "桃盐汽水",
              ja: "ピーチソルトエード",
            },
            price: "4,500원",
          },
        ],
      },
      {
        id: "b2",
        name: {
          ko: "해질녘카페",
          en: "Sunset Cafe",
          zh: "日落咖啡馆",
          ja: "夕暮れカフェ",
        },
        menu: [
          {
            name: {
              ko: "소금수제레몬에이드",
              en: "Hand-made Lemon Salt Ade",
              zh: "手作盐柠檬汽水",
              ja: "手作り塩レモンエード",
            },
            price: "22,000원",
          },
          {
            name: {
              ko: "소금컵빙수",
              en: "Salt Cup Bingsu",
              zh: "盐杯刨冰",
              ja: "塩カップかき氷",
            },
            price: "25,000원",
          },
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
          ko: "비건프렌즈",
          en: "Vegan Friends",
          zh: "纯素朋友",
          ja: "ヴィーガンフレンズ",
        },
        menu: [
          {
            name: {
              ko: "비건 떡볶이",
              en: "Vegan Tteokbokki",
              zh: "纯素炒年糕",
              ja: "ヴィーガントッポッキ",
            },
            price: "5,000원",
          },
          {
            name: {
              ko: "비건 감자 핫도그",
              en: "Vegan Potato Hotdog",
              zh: "纯素土豆热狗",
              ja: "ヴィーガンポテトホットドッグ",
            },
            price: "4,000원",
          },
          {
            name: {
              ko: "비건 핫도그 스키니",
              en: "Vegan Hotdog Skinny",
              zh: "纯素热狗斯基尼",
              ja: "ヴィーガンホットドッグスキニー",
            },
            price: "3,000원",
          },
        ],
      },
      {
        id: "c2",
        name: {
          ko: "넘버원푸드",
          en: "Number One Food",
          zh: "第一号食品",
          ja: "ナンバーワンフード",
        },
        menu: [
          {
            name: {
              ko: "왕닭꼬치",
              en: "King Chicken Skewer",
              zh: "王鸡肉串",
              ja: "キングチキン串",
            },
            price: "5,000원",
          },
          {
            name: {
              ko: "빙수(팥, 망고)",
              en: "Bingsu (Red Bean, Mango)",
              zh: "刨冰（红豆、芒果）",
              ja: "かき氷（小豆、マンゴー）",
            },
            price: "6,000원",
          },
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
          ko: "자연과 어우러져 즐기는 버스킹 공연",
          en: "Free-spirited street performances",
          zh: "自由氛围的街头表演",
          ja: "自由な雰囲気のストリートパフォーマンス",
        },
        badge: {
          ko: "무료",
          en: "Free",
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
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop",
  },
];

export const locationInfo: LocationInfo = {
  address: {
    ko: "경기도 시흥시 동서로 287 (장곡동)",
    en: "330 Yeouidong-ro, Yeongdeungpo-gu, Seoul, Yeouido Hangang Park",
    zh: "首尔特别市永登浦区汝矣岛路330号汉江公园汝矣岛地区",
    ja: "ソウル特別市永登浦区汝矣島路330 漢江公園汝矣島地区",
  },
  mapUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3164.289!2d126.932!3d37.529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDMxJzQ0LjQiTiAxMjbCsDU1JzU1LjIiRQ!5e0!3m2!1sen!2skr!4v1234567890",
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
