export * from './types'
export * from './database'
export * from './historyRepository'
export * from './statsRepository'

import { getDB } from './database'
import type { HistoryRecord } from './types'

/**
 * クイズの問題に対する解答をHistoryとStatsの両方に記録します。
 * トランザクションを利用して安全に両方のストアを更新します。
 */
export const recordAnswer = async (
  questionId: string,
  category: string,
  isCorrect: boolean
): Promise<void> => {
  const db = await getDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['history', 'stats'], 'readwrite')
    transaction.onerror = () => reject(transaction.error)

    try {
      // 1. History レコードの追加
      const historyStore = transaction.objectStore('history')
      const historyRecord: Omit<HistoryRecord, 'id'> = {
        questionId,
        category,
        correct: isCorrect,
        timestamp: Date.now()
      }
      historyStore.add(historyRecord)

      // 2. Stats レコードの更新（get → put の連鎖）
      const statsStore = transaction.objectStore('stats')
      const getRequest = statsStore.get(questionId)

      getRequest.onsuccess = () => {
        let stats = getRequest.result as {
          questionId: string
          correctCount: number
          wrongCount: number
          lastAnswered: number
        } | undefined

        if (!stats) {
          stats = {
            questionId,
            correctCount: 0,
            wrongCount: 0,
            lastAnswered: 0
          }
        }

        if (isCorrect) {
          stats.correctCount += 1
        } else {
          stats.wrongCount += 1
        }
        stats.lastAnswered = Date.now()

        // put が最後の操作 → put の onsuccess で resolve
        const putRequest = statsStore.put(stats)
        putRequest.onsuccess = () => resolve()
      }
    } catch (e) {
      transaction.abort()
      reject(e)
    }
  })
}

/**
 * DB 内の全アプリケーションデータ (History, Stats) を一括でクリアします。
 */
export const clearAllData = async (): Promise<void> => {
  const db = await getDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['history', 'stats'], 'readwrite')
    transaction.onerror = () => reject(transaction.error)

    try {
      transaction.objectStore('history').clear()
      // stats の clear が最後の操作 → onsuccess で resolve
      const statsClear = transaction.objectStore('stats').clear()
      statsClear.onsuccess = () => resolve()
    } catch (e) {
      transaction.abort()
      reject(e)
    }
  })
}
