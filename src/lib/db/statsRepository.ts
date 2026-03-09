import type { StatsRecord } from './types'

export const getStats = (db: IDBDatabase, questionId: string): Promise<StatsRecord | null> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['stats'], 'readonly')
    const store = transaction.objectStore('stats')
    const request = store.get(questionId)

    request.onsuccess = () => {
      resolve((request.result as StatsRecord | undefined) ?? null)
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

export const getAllStats = (db: IDBDatabase): Promise<StatsRecord[]> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['stats'], 'readonly')
    const store = transaction.objectStore('stats')
    const request = store.getAll()

    request.onsuccess = () => {
      resolve(request.result as StatsRecord[])
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

export const updateStats = async (db: IDBDatabase, questionId: string, isCorrect: boolean): Promise<void> => {
  const currentStats = await getStats(db, questionId)
  
  const newStats: StatsRecord = currentStats ?? {
    questionId,
    correctCount: 0,
    wrongCount: 0,
    lastAnswered: 0
  }

  if (isCorrect) {
    newStats.correctCount += 1
  } else {
    newStats.wrongCount += 1
  }
  newStats.lastAnswered = Date.now()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['stats'], 'readwrite')
    const store = transaction.objectStore('stats')
    const request = store.put(newStats)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

export const clearStats = (db: IDBDatabase): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['stats'], 'readwrite')
    const store = transaction.objectStore('stats')
    const request = store.clear()

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}
