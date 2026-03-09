import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { getDB, resetDBInstance } from './database'
import { getStats, getAllStats, updateStats, clearStats } from './statsRepository'
import { setupMockDB } from '../../testing/mockDB'

describe('statsRepository', () => {
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

  test('存在しないレコードを取得した場合は null が返ること', async () => {
    const result = await getStats(db, 'q-notFound')
    expect(result).toBeNull()
  })

  test('初回正解時の updateStats で正しい初期値が設定されること', async () => {
    await updateStats(db, 'q-1', true)

    const stats = await getStats(db, 'q-1')
    expect(stats).not.toBeNull()
    expect(stats?.questionId).toBe('q-1')
    expect(stats?.correctCount).toBe(1)
    expect(stats?.wrongCount).toBe(0)
    expect(stats?.lastAnswered).toBeGreaterThan(0)
  })

  test('初回不正解時の updateStats で正しい初期値が設定されること', async () => {
    await updateStats(db, 'q-2', false)

    const stats = await getStats(db, 'q-2')
    expect(stats?.correctCount).toBe(0)
    expect(stats?.wrongCount).toBe(1)
  })

  test('2回目以降の回答時の updateStats でカウントと最終回答日時が正しく更新されること', async () => {
    await updateStats(db, 'q-3', true)
    
    // 時間差をつけるために少し待つ
    await new Promise((resolve) => setTimeout(resolve, 10))
    const tempStats = await getStats(db, 'q-3')
    
    await updateStats(db, 'q-3', false)
    await updateStats(db, 'q-3', true)

    const stats = await getStats(db, 'q-3')
    expect(stats?.correctCount).toBe(2)
    expect(stats?.wrongCount).toBe(1)
    expect(stats!.lastAnswered).toBeGreaterThanOrEqual(tempStats!.lastAnswered)
  })

  test('getAllStats(), clearStats() が正しく機能すること', async () => {
    await updateStats(db, 'q-1', true)
    await updateStats(db, 'q-2', false)

    let all = await getAllStats(db)
    expect(all).toHaveLength(2)

    await clearStats(db)
    all = await getAllStats(db)
    expect(all).toHaveLength(0)
  })
})
