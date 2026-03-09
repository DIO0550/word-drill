import { test, expect, beforeEach, afterEach } from 'vitest'
import { getDB, resetDBInstance } from './database'
import { recordAnswer, clearAllData } from './index'
import { getAllHistory } from './historyRepository'
import { getAllStats, getStats } from './statsRepository'
import { setupMockDB } from '../../testing/mockDB'

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

test('recordAnswer() で history と stats が両方正しく更新されること', async () => {
  // 最初の解答（正解）
  await recordAnswer('q-1', 'cat-A', true)

  // time-gap を確保
  await new Promise(r => setTimeout(r, 10))

  // 2度目の解答（不正解）
  await recordAnswer('q-1', 'cat-A', false)

  const history = await getAllHistory(db)
  expect(history).toHaveLength(2)
  expect(history[0].questionId).toBe('q-1')
  expect(history[0].correct).toBe(true)
  expect(history[1].questionId).toBe('q-1')
  expect(history[1].correct).toBe(false)
  expect(history[1].timestamp).toBeGreaterThan(history[0].timestamp)

  const stats = await getStats(db, 'q-1')
  expect(stats).not.toBeNull()
  expect(stats!.correctCount).toBe(1)
  expect(stats!.wrongCount).toBe(1)
  expect(stats!.lastAnswered).toBeGreaterThan(0)
})

test('clearAllData() で両方のストアが完全に消去されること', async () => {
  // データを挿入
  await recordAnswer('q-1', 'cat-A', true)
  await recordAnswer('q-2', 'cat-B', false)

  let history = await getAllHistory(db)
  let stats = await getAllStats(db)
  expect(history).toHaveLength(2)
  expect(stats).toHaveLength(2)

  // クリア処理
  await clearAllData()

  history = await getAllHistory(db)
  stats = await getAllStats(db)
  expect(history).toHaveLength(0)
  expect(stats).toHaveLength(0)
})
