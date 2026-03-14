import type { HistoryRecord } from '../../../lib/db/types'
import { mainCategories } from '../../category/data/categories'

export type Period = 'this-week' | 'this-month' | 'all'

export type OverallStatsData = {
  totalAnswers: number
  accuracyRate: number | null
  studyDays: number
  streakDays: number
}

export type SubCategoryStatsData = {
  id: string
  name: string
  totalAnswers: number
  accuracyRate: number | null
}

export type MainCategoryStatsData = {
  id: string
  name: string
  totalAnswers: number
  accuracyRate: number | null
  subCategories: SubCategoryStatsData[]
}

export type WeakWordData = {
  questionId: string
  correctCount: number
  totalCount: number
  accuracyRate: number
}

// サブカテゴリIDからメインカテゴリの情報を引くためのマップ
const subToMainMap = new Map<
  string,
  { mainId: string; mainName: string; subName: string }
>()
for (const main of mainCategories) {
  for (const sub of main.subCategories) {
    subToMainMap.set(sub.id, {
      mainId: main.id,
      mainName: main.name,
      subName: sub.name,
    })
  }
}

const UNKNOWN_MAIN_CATEGORY = { id: 'other', name: 'その他' }

const resolveCategory = function(subCategoryId: string) {
  return (
    subToMainMap.get(subCategoryId) ?? {
      mainId: UNKNOWN_MAIN_CATEGORY.id,
      mainName: UNKNOWN_MAIN_CATEGORY.name,
      subName: subCategoryId,
    }
  )
}

const truncateToDate = function(timestamp: number): number {
  const d = new Date(timestamp)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export const StatsCalculator = {
  getPeriodStart(period: Period): number {
    if (period === 'all') { return 0 }

    const now = new Date()
    now.setHours(0, 0, 0, 0)

    if (period === 'this-month') {
      now.setDate(1)
      return now.getTime()
    }

    if (period === 'this-week') {
      // getDay()は0が日曜, 1が月曜... 6が土曜
      const day = now.getDay()
      // 月曜始まりとするため、日曜(0)は7日前とする
      const diff = day === 0 ? 6 : day - 1
      now.setDate(now.getDate() - diff)
      return now.getTime()
    }
    return 0
  },

  calcStreakDays(allRecords: HistoryRecord[]): number {
    if (allRecords.length === 0) { return 0 }

    // 日付 (yyyy-MM-dd等) でユニーク化するか、00:00:00 のタイムスタンプでセットを作る
    const dateSet = new Set<number>()
    for (const r of allRecords) {
      dateSet.add(truncateToDate(r.timestamp))
    }

    const todayDate = truncateToDate(Date.now())
    if (!dateSet.has(todayDate)) {
      return 0
    }

    let streak = 0
    let checkDate = todayDate
    const DAY_MS = 24 * 60 * 60 * 1000

    while (dateSet.has(checkDate)) {
      streak++
      checkDate -= DAY_MS
    }

    return streak
  },

  calcOverallStats(
    records: HistoryRecord[],
    allRecords: HistoryRecord[]
  ): OverallStatsData {
    const totalAnswers = records.length
    let correctCount = 0
    const studyDateSet = new Set<number>()

    for (const r of records) {
      if (r.correct) { correctCount++ }
      studyDateSet.add(truncateToDate(r.timestamp))
    }

    const accuracyRate =
      totalAnswers === 0 ? null : Math.round((correctCount / totalAnswers) * 100)

    return {
      totalAnswers,
      accuracyRate,
      studyDays: studyDateSet.size,
      streakDays: StatsCalculator.calcStreakDays(allRecords),
    }
  },

  calcCategoryStats(records: HistoryRecord[]): MainCategoryStatsData[] {
    // 集計用のデータ構造
    type CountVars = { correct: number; total: number }
    const mainStats = new Map<string, CountVars & { name: string }>()
    const subStats = new Map<
      string,
      Map<string, CountVars & { name: string }>
    >() // mainId -> Map(subId -> stats)

    for (const r of records) {
      const { mainId, mainName, subName } = resolveCategory(r.category)
      const isCorrect = r.correct ? 1 : 0

      // メインカテゴリ集計
      let mGroup = mainStats.get(mainId)
      if (!mGroup) {
        mGroup = { correct: 0, total: 0, name: mainName }
        mainStats.set(mainId, mGroup)
      }
      mGroup.correct += isCorrect
      mGroup.total += 1

      // サブカテゴリ集計
      let sGroupMap = subStats.get(mainId)
      if (!sGroupMap) {
        sGroupMap = new Map()
        subStats.set(mainId, sGroupMap)
      }

      let sGroup = sGroupMap.get(r.category)
      if (!sGroup) {
        sGroup = { correct: 0, total: 0, name: subName }
        sGroupMap.set(r.category, sGroup)
      }
      sGroup.correct += isCorrect
      sGroup.total += 1
    }

    const result: MainCategoryStatsData[] = []
    // mainCategoryとsubCategoriesの配列として整形
    for (const [mainId, mStats] of mainStats.entries()) {
      const subCategories: SubCategoryStatsData[] = []
      const sGroupMap = subStats.get(mainId)
      if (sGroupMap) {
        for (const [subId, sStats] of sGroupMap.entries()) {
          subCategories.push({
            id: subId,
            name: sStats.name,
            totalAnswers: sStats.total,
            accuracyRate: Math.round((sStats.correct / sStats.total) * 100),
          })
        }
      }
      // サブカテゴリの表示順（id等）は必要に応じてソート
      subCategories.sort((a, b) => a.id.localeCompare(b.id))

      result.push({
        id: mainId,
        name: mStats.name,
        totalAnswers: mStats.total,
        accuracyRate: Math.round((mStats.correct / mStats.total) * 100),
        subCategories,
      })
    }

    // 表示順
    // categories.tsの定義順に揃える処理などがあればここで（現状はID名ソート）
    // とりあえず未知の「その他」は最後に回すなどの調整をする
    result.sort((a, b) => {
      if (a.id === 'other') { return 1 }
      if (b.id === 'other') { return -1 }
      return a.id.localeCompare(b.id)
    })

    return result
  },

  calcWeakWords(records: HistoryRecord[]): WeakWordData[] {
    const counts = new Map<string, { correct: number; total: number }>()

    for (const r of records) {
      const stat = counts.get(r.questionId) ?? { correct: 0, total: 0 }
      stat.total += 1
      if (r.correct) { stat.correct += 1 }
      counts.set(r.questionId, stat)
    }

    const result: WeakWordData[] = []
    for (const [qId, stat] of counts.entries()) {
      if (stat.total < 2) { continue }

      const accuracy = Math.round((stat.correct / stat.total) * 100)
      if (accuracy <= 50) {
        result.push({
          questionId: qId,
          correctCount: stat.correct,
          totalCount: stat.total,
          accuracyRate: accuracy,
        })
      }
    }

    // 正答率の低い順、同じ場合は回答数が多い順、更に同じならID順
    result.sort((a, b) => {
      if (a.accuracyRate !== b.accuracyRate) { return a.accuracyRate - b.accuracyRate }
      if (b.totalCount !== a.totalCount) { return b.totalCount - a.totalCount }
      return a.questionId.localeCompare(b.questionId)
    })

    return result
  },
} as const
