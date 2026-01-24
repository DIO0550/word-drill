export type SubCategory = {
  id: string
  name: string
  description: string
  icon: string
  wordCount: number
}

export type MainCategory = {
  id: string
  name: string
  description: string
  icon: string
  subCategories: SubCategory[]
}

export const mainCategories: MainCategory[] = [
  {
    id: 'english',
    name: '英単語',
    description: '日常・ビジネス英語から資格試験まで',
    icon: '📖',
    subCategories: [
      {
        id: 'en-general',
        name: '一般',
        description: '日常・ビジネス英語',
        icon: '💬',
        wordCount: 0,
      },
      {
        id: 'en-toeic',
        name: 'TOEIC',
        description: 'TOEIC頻出単語',
        icon: '🎯',
        wordCount: 0,
      },
      {
        id: 'en-technical-docs',
        name: '技術文書',
        description: '論文・ドキュメント頻出表現',
        icon: '📄',
        wordCount: 0,
      },
    ],
  },
  {
    id: 'programming',
    name: 'プログラミング英語',
    description: '言語別のプログラミング用語',
    icon: '💻',
    subCategories: [
      {
        id: 'prog-common',
        name: '共通',
        description: '言語問わず使う英単語',
        icon: '⌨️',
        wordCount: 0,
      },
      {
        id: 'prog-rust',
        name: 'Rust',
        description: 'ownership, borrowing, lifetime など',
        icon: '🦀',
        wordCount: 0,
      },
      {
        id: 'prog-javascript',
        name: 'JavaScript',
        description: 'hoisting, closure, prototype など',
        icon: '🟨',
        wordCount: 0,
      },
      {
        id: 'prog-go',
        name: 'Go',
        description: 'goroutine, defer, channel など',
        icon: '🐹',
        wordCount: 0,
      },
    ],
  },
  {
    id: 'it',
    name: 'IT用語',
    description: 'インフラ・セキュリティ・データベース',
    icon: '🖥️',
    subCategories: [
      {
        id: 'it-programming',
        name: 'プログラミング概念',
        description: 'OOP, デザインパターン, アルゴリズム',
        icon: '🧩',
        wordCount: 0,
      },
      {
        id: 'it-infra',
        name: 'インフラ',
        description: 'クラウド, コンテナ, ネットワーク',
        icon: '☁️',
        wordCount: 0,
      },
      {
        id: 'it-security',
        name: 'セキュリティ',
        description: '脆弱性, 認証, 暗号化',
        icon: '🔒',
        wordCount: 0,
      },
      {
        id: 'it-database',
        name: 'データベース',
        description: 'SQL, NoSQL, トランザクション',
        icon: '🗄️',
        wordCount: 0,
      },
    ],
  },
]

// 後方互換性のため、フラットなカテゴリリストも提供
export type Category = SubCategory

export const categories: Category[] = mainCategories.flatMap(
  (main) => main.subCategories
)
