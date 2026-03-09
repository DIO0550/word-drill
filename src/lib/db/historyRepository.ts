import type { HistoryRecord } from './types'

export const addHistory = (db: IDBDatabase, record: Omit<HistoryRecord, 'id'>): Promise<number> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['history'], 'readwrite')
    const store = transaction.objectStore('history')
    const request = store.add(record)

    request.onsuccess = () => {
      resolve(request.result as number)
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

export const getAllHistory = (db: IDBDatabase): Promise<HistoryRecord[]> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['history'], 'readonly')
    const store = transaction.objectStore('history')
    const request = store.getAll()

    request.onsuccess = () => {
      resolve(request.result as HistoryRecord[])
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

export const clearHistory = (db: IDBDatabase): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['history'], 'readwrite')
    const store = transaction.objectStore('history')
    const request = store.clear()

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}
