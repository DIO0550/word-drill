export type WordDrillDBSchema = {
  history: {
    key: number
    value: {
      questionId: string
      category: string
      correct: boolean
      timestamp: number
    }
  }
  stats: {
    key: string
    value: {
      questionId: string
      correctCount: number
      wrongCount: number
      lastAnswered: number
    }
  }
}

const DB_NAME = 'word-drill'
const DB_VERSION = 1

let dbPromise: Promise<IDBDatabase> | null = null

/**
 * IndexedDB 接続を取得する（シングルトン）
 */
export const getDB = (): Promise<IDBDatabase> => {
  if (dbPromise) 
{return dbPromise}

  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB is not supported in this environment.'))
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      console.error('Failed to open IndexedDB:', request.error)
      dbPromise = null
      reject(request.error)
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      if (!db.objectStoreNames.contains('history')) {
        const historyStore = db.createObjectStore('history', {
          keyPath: 'id',
          autoIncrement: true,
        })
        historyStore.createIndex('questionId', 'questionId')
        historyStore.createIndex('category', 'category')
        historyStore.createIndex('timestamp', 'timestamp')
      }

      if (!db.objectStoreNames.contains('stats')) {
        db.createObjectStore('stats', { keyPath: 'questionId' })
      }
    }
  })

  return dbPromise
}

// テスト用ユーティリティ: シングルトンの状態をリセットする
export const resetDBInstance = () => {
  dbPromise = null
}
