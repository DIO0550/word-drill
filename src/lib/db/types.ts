export type HistoryRecord = {
  id?: number
  questionId: string
  category: string
  correct: boolean
  timestamp: number
}

export type StatsRecord = {
  questionId: string
  correctCount: number
  wrongCount: number
  lastAnswered: number
}
