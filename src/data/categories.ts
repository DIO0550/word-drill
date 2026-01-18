export interface SubCategory {
  id: string
  name: string
  description: string
  icon: string
  wordCount: number
}

export interface MainCategory {
  id: string
  name: string
  description: string
  icon: string
  subCategories: SubCategory[]
}

export const mainCategories: MainCategory[] = [
  {
    id: 'general',
    name: '一般英語',
    description: '日常会話からビジネス、資格試験まで',
    icon: '📚',
    subCategories: [
      {
        id: 'general',
        name: '日常・ビジネス',
        description: '日常・ビジネス英語',
        icon: '💬',
        wordCount: 0,
      },
      {
        id: 'general-toeic',
        name: 'TOEIC向け',
        description: 'TOEIC頻出単語',
        icon: '🎯',
        wordCount: 0,
      },
    ],
  },
  {
    id: 'programming',
    name: 'プログラミング英語',
    description: '開発・インフラ・セキュリティの技術用語',
    icon: '💻',
    subCategories: [
      {
        id: 'tech-programming',
        name: '開発用語',
        description: '開発用語全般',
        icon: '⌨️',
        wordCount: 0,
      },
      {
        id: 'tech-infra',
        name: 'インフラ/クラウド',
        description: 'AWS, Docker, K8sなど',
        icon: '☁️',
        wordCount: 0,
      },
      {
        id: 'tech-security',
        name: 'セキュリティ',
        description: '脆弱性、認証など',
        icon: '🔒',
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
