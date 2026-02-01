/**
 * クイズの問題
 */
export type QuizQuestion = {
  id: string
  term: string
  meaning: string
  choices: [string, string, string, string]
  answer: 0 | 1 | 2 | 3
  example?: string
}
