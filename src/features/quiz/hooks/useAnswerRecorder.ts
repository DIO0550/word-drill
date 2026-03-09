import { useCallback } from 'react'
import { recordAnswer } from '../../../lib/db'

/**
 * クイズの解答結果を IndexedDB へ記録するフック
 */
export const useAnswerRecorder = (categoryId: string) => {
  const record = useCallback(
    async (questionId: string, isCorrect: boolean): Promise<void> => {
      try {
        await recordAnswer(questionId, categoryId, isCorrect)
      } catch (e) {
        // 記録失敗はクイズの進行を妨げないようにサイレントに処理
        console.error('[useAnswerRecorder] Failed to record answer:', e)
      }
    },
    [categoryId]
  )

  return { record }
}
