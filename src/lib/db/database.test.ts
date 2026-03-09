import { describe, test, expect, beforeEach } from 'vitest'
import { getDB, resetDBInstance } from './database'
import { setupMockDB } from '../../testing/mockDB'

describe('database.ts', () => {
  beforeEach(() => {
    setupMockDB()
    resetDBInstance()
    // mockDB のデータをクリア
    const request = indexedDB.deleteDatabase('word-drill')
    request.onsuccess = () => {}
  })

  test('DB初期化でhistoryストアとstatsストアが作成されること', async () => {
    const db = await getDB()
    expect(db.objectStoreNames.contains('history')).toBe(true)
    expect(db.objectStoreNames.contains('stats')).toBe(true)

    // インデックスの確認 (mockDBの仕様上、名前が正しく渡されているか)
    // モックが簡易実装のため、ここではストアの存在確認を主に行います。
  })

  test('getDB() はシングルトンであること', async () => {
    const db1 = await getDB()
    const db2 = await getDB()
    expect(db1).toBe(db2)
  })

  test('IndexedDB が利用できない環境では reject されること', async () => {
    resetDBInstance()
    // 一時的に indexedDB を undefiend にする
    const originalIndexedDB = globalThis.indexedDB
    Object.defineProperty(globalThis, 'indexedDB', { value: undefined, configurable: true })

    await expect(getDB()).rejects.toThrow('IndexedDB is not supported in this environment.')

    // 元に戻す
    Object.defineProperty(globalThis, 'indexedDB', { value: originalIndexedDB, configurable: true })
  })
})
