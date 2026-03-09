import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { getDB, resetDBInstance } from './database'
import { addHistory, getAllHistory, clearHistory } from './historyRepository'
import { setupMockDB } from '../../testing/mockDB'

describe('historyRepository', () => {
  let db: IDBDatabase

  beforeEach(async () => {
    setupMockDB()
    resetDBInstance()
    const request = indexedDB.deleteDatabase('word-drill')
    request.onsuccess = () => {}
    db = await getDB()
  })

  afterEach(() => {
    db.close()
  })

  test('addHistory() で履歴が追加され、idが返ること (T-002)', async () => {
    const record = {
      questionId: 'q-1',
      category: 'kanji',
      correct: true,
      timestamp: Date.now(),
    }
    const id = await addHistory(db, record)
    expect(id).toBe(1)
  })

  test('getAllHistory() で全履歴が取得できること (T-003)', async () => {
    const record1 = { questionId: 'q-1', category: 'kanji', correct: true, timestamp: 1000 }
    const record2 = { questionId: 'q-2', category: 'kanji', correct: false, timestamp: 2000 }
    
    await addHistory(db, record1)
    await addHistory(db, record2)

    const all = await getAllHistory(db)
    expect(all).toHaveLength(2)
    expect(all[0]).toEqual({ ...record1, id: 1 })
    expect(all[1]).toEqual({ ...record2, id: 2 })
  })

  test('clearHistory() で全データが削除されること (T-004)', async () => {
    const record = { questionId: 'q-1', category: 'kanji', correct: true, timestamp: 1000 }
    await addHistory(db, record)

    let all = await getAllHistory(db)
    expect(all).toHaveLength(1)

    await clearHistory(db)
    all = await getAllHistory(db)
    expect(all).toHaveLength(0)
  })
})
