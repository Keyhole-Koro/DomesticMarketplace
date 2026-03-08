import type { WorkProject } from "./types";

export const featuredProjects: WorkProject[] = [
  {
    id: "Honnoba",
    title: {
      ja: "ホンノバ",
      en: "Honnoba"
    },
    type: {
      ja: "ウェブアプリ",
      en: "Web App"
    },
    year: "2025",
    role: {
      ja: "エンジニア",
      en: "Engineer"
    },
    duration: "Jun 2024 - Present",
    summary: {
      ja: "徳島県神山町で、「本のある場」と町民を繋ぐウェブアプリ",
      en: "A web app connecting 'places with books' and townspeople in Kamiyama, Tokushima."
    },
    description: {
      ja: "神山町には公共図書館がありません。でも、本のある場所、「本のある場」はたくさんあります。でも、どこに本の場があるのか、いつ開いているのかわかりにくい。本の場でイベントを開催しても、人があまり集まらない。それならば、テクノロジーの力で本の場と町民を繋ごうと、5人の本好きが、この課題に向き合おうと決めました。そうして出来上がったのが「ホンノバ」です。\n私は、総合的なエンジニアとしてフロントエンドの実装からバックエンドの実装、セキュリティなどの対応を行っています。特に難しかったのがセキュリティの実装です。初めての本格的なウェブアプリであり、どのように利用者の個人情報を守るか、どのように不正アクセスを防ぐかなど、多くのことを学びながら実装を進めました。現在は、町民に実際に活用していただけるよう、機能改善やバグ修正、ホンノバを活用するためのイベントの実施などを行っています。\n特に、独自の「AIを用いた検索」の実装や情報の管理、継続的な運用を見据えた構成などを意識しています。",
      en: "Kamiyama Town does not have a public library, but there are many 'book places' throughout the town. However, it was difficult to know where they were or when they were open. When events were held at these places, few people gathered. So, five book lovers decided to tackle this challenge using technology to connect these book places with the townspeople. That's how 'Honnoba' was born.\n As a general engineer, I worked on everything from frontend and backend implementation to security. Implementing security was particularly challenging. As my first full-scale web app, I learned a lot about protecting user's personal information and preventing unauthorized access. Currently, I am working on functional improvements, bug fixes, and organizing events to encourage townspeople to use Honnoba."
    },
    stack: ["Next.js", "Gemini API", "TypeScript", "Firebase", "Cloudflare", "Python", "Local LLM"],
    href: "/work/Honnoba",
    image: "/projects/honnoba/honnoba.png",
    gallery: ["/projects/honnoba/honnoba1.png", "/projects/honnoba/honnoba2.png", "/projects/honnoba/honnoba3.png"],
    links: {
      live: "https://kamiyama.honnoba.jp"
    },
    achievements: [
      {
        ja: "地域創生・社会課題解決 AI プログラミングコンテスト 2025: 最優秀賞",
        en: "Regional Revitalization and Social Issue Resolution AI Programming Contest 2025: Grand Prize"
      },
      {
        ja: "U-22プログラミングコンテスト2025: AWS賞",
        en: "U-22 Programming Contest 2025: AWS Award"
      }
    ]
  },
  {
    id: "Undelry",
    title: {
      ja: "Undelry",
      en: "Undelry"
    },
    type: {
      ja: "ウェブアプリ",
      en: "Web App"
    },
    year: "2025",
    role: {
      ja: "エンジニア",
      en: "Engineer"
    },
    duration: "Sep 2025 - Oct 2025",
    summary: {
      ja: "まるごと祭での展示体験のためのwebアプリ",
      en: "An web app for the exhibition experience at Marugoto Festival 2025."
    },
    description: {
      ja: "神山まるごと高専で一年に一度行われるイベント、まるごと祭にて、脳波について活動しているUndelryというグループの展示用のウェブアプリを制作しました。デザイナーと協力しながら、デザイナーが制作したデザインを実装することや、事前相談などで仕様を具体的に決めることなどから始まり、当日では多くの方に触っていただくことができました。\n要素としては、AR.jsを用いたARの読み込みやその動線、そして体験者の交流としてRealtime Databaseを用いた感想の投稿の仕組みを実現しました。\n特に難しかったのが、ARの部分であり、レイテンシがまるごと祭当日は非常に高くなってしまったため、その後のイベントなどで活用していただく中で改善することを目指し、試行錯誤しました。",
      en: "At Marugoto Festival, an annual event at Kamiyama Marugoto College of Technology, I created a web app for the exhibition of a group called 'Undelry' that works on brainwaves. Starting from implementing the design created by the designer and concretely deciding the specifications through prior consultations, many people were able to interact with it on the day. \nElements included AR loading using AR.js and its flow, as well as a mechanism for visitors to post their thoughts using Realtime Database. \nWhat was particularly difficult was the AR part. The latency became very high on the day of the Marugoto Festival, so we experimented and tried various things with the aim of improving it for future use in events."
    },
    stack: ["Next.js", "Firebase", "AR.js"],
    href: "/work/Undelry",
    image: "/projects/undelry/undelry.png",
    gallery: ["/projects/undelry/undelry1.png", "/projects/undelry/undelry2.png", "/projects/undelry/undelry3.png"],
    links: {
      live: "https://undelry.vercel.app/"
    }
  },
  {
    id: "FxN_Flyer",
    title: {
      ja: "FxN告知フライヤー",
      en: "FxN Flyer Design"
    },
    type: {
      ja: "エディトリアルデザイン",
      en: "Editorial Design"
    },
    year: "2025",
    role: {
      ja: "デザイナー",
      en: "Designer"
    },
    duration: "Sep 2025 - Oct 2025",
    summary: {
      ja: "FxN内のイベントの企画の告知フライヤーを制作",
      en: "Designed a flyer for an event withinFxN."
    },
    description: {
      ja: "",
      en: ""
    },
    stack: ["Adobe Illustrator", "Adobe Photoshop"],
    href: "/work/FxN_Flyer",
    image: "/projects/fxn_flyer/fxn_flyer.png",
    gallery: ["/projects/fxn_flyer/fxn_flyer1.png", "/projects/fxn_flyer/fxn_flyer2.png", "/projects/fxn_flyer/fxn_flyer3.png"],
  }
];
