// 完全に最小構成の IndexedDB モック（setTimeoutなし・完全同期版）

export const setupMockDB = () => {
  if (typeof globalThis === 'undefined') {
    return
  }

  type MockRequest = {
    readyState: string
    result?: unknown
    onsuccess?: (ev: { target: MockRequest }) => void
    onerror?: (ev: Event) => void
    onupgradeneeded?: (ev: { target: { result: MockDB } }) => void
  }

  type MockStore = {
    name: string
    keyPath: string | null
    autoIncrement: boolean
    records: Map<number | string, unknown>
    nextId: number
    createIndex: () => void
    get: (key: string | number) => MockRequest
    add: (value: unknown) => MockRequest
    getAll: () => MockRequest
    clear: () => MockRequest
    put: (value: unknown) => MockRequest
  }

  type MockDB = {
    name: string
    version: number
    objectStoreNames: {
      names: string[]
      contains: (n: string) => boolean
      addStore: (n: string) => void
      readonly length: number
      item: (i: number) => string | null
    }
    stores: Map<string, MockStore>
    createObjectStore: (name: string, options?: { keyPath?: string | null; autoIncrement?: boolean }) => MockStore
    transaction: (_storeNames: unknown, _mode: string) => MockTransaction
    close: () => void
  }

  type MockTransaction = {
    _isAborted: boolean
    abort: () => void
    commit: () => void
    onerror: ((ev: Event) => void) | null
    oncomplete: ((ev: Event) => void) | null
    objectStore: (storeName: string) => MockObjectStoreAPI | undefined
  }

  type MockObjectStoreAPI = {
    get: (key: string | number) => MockRequest
    add: (value: unknown) => MockRequest
    put: (value: unknown) => MockRequest
    getAll: () => MockRequest
    clear: () => MockRequest
  }

  const dbs = new Map<string, MockDB>()

  const makeStore = (storeName: string, options?: { keyPath?: string | null; autoIncrement?: boolean }): MockStore => ({
    name: storeName,
    keyPath: options?.keyPath || null,
    autoIncrement: options?.autoIncrement || false,
    records: new Map(),
    nextId: 1,
    createIndex: () => {},
    get(key: string | number) {
      return { readyState: 'done', result: this.records.get(key) }
    },
    add(value: unknown) {
      const req: MockRequest = { readyState: 'pending' }
      const valObj = value as Record<string, unknown>
      const keyToCheck = this.keyPath ? String(this.keyPath) : ''
      const id = this.autoIncrement
        ? this.nextId++
        : (valObj[keyToCheck] !== undefined ? valObj[keyToCheck] as string | number : Date.now())
      if (this.autoIncrement && typeof value === 'object' && value !== null) {
        (value as Record<string, unknown>).id = id
      }
      this.records.set(id, value)
      req.result = id
      req.readyState = 'done'
      return req
    },
    getAll() {
      return { readyState: 'done', result: Array.from(this.records.values()) }
    },
    clear() {
      this.records.clear()
      return { readyState: 'done' }
    },
    put(value: unknown) {
      return this.add(value)
    }
  })

  const mockIndexedDB = {
    open: (name: string, version: number) => {
      const request: MockRequest = { readyState: 'pending' }

      let db = dbs.get(name)
      if (!db || db.version < version) {
        db = {
          name,
          version,
          objectStoreNames: {
            names: [] as string[],
            contains(storeName: string) { return this.names.includes(storeName) },
            addStore(storeName: string) {
              if (!this.names.includes(storeName)) {
                this.names.push(storeName)
              }
            },
            get length() { return this.names.length },
            item(i: number) { return this.names[i] || null }
          },
          stores: new Map<string, MockStore>(),
          createObjectStore(storeName: string, options?: { keyPath?: string | null; autoIncrement?: boolean }) {
            this.objectStoreNames.addStore(storeName)
            const store = makeStore(storeName, options)
            this.stores.set(storeName, store)
            return store
          },
          transaction() {
            const stores = this.stores
            const tx: MockTransaction = {
              _isAborted: false,
              abort() { this._isAborted = true },
              commit() {},
              onerror: null,
              oncomplete: null,
              objectStore(storeName: string): MockObjectStoreAPI | undefined {
                const baseStore = stores.get(storeName)
                if (!baseStore) { return undefined }

                return {
                  get: (key: string | number): MockRequest => {
                    const req = baseStore.get(key)
                    Promise.resolve().then(() => {
                      if (!tx._isAborted && req.onsuccess) {
                        req.onsuccess({ target: req })
                      }
                    })
                    return req
                  },
                  add: (value: unknown): MockRequest => {
                    const req = baseStore.add(value)
                    Promise.resolve().then(() => {
                      if (!tx._isAborted && req.onsuccess) {
                        req.onsuccess({ target: req })
                      }
                    })
                    return req
                  },
                  put: (value: unknown): MockRequest => {
                    const req = baseStore.put(value)
                    Promise.resolve().then(() => {
                      if (!tx._isAborted && req.onsuccess) {
                        req.onsuccess({ target: req })
                      }
                      Promise.resolve().then(() => {
                        if (!tx._isAborted && tx.oncomplete) {
                          tx.oncomplete({ target: tx } as unknown as Event)
                        }
                      })
                    })
                    return req
                  },
                  getAll: (): MockRequest => {
                    const req = baseStore.getAll()
                    Promise.resolve().then(() => {
                      if (!tx._isAborted && req.onsuccess) {
                        req.onsuccess({ target: req })
                      }
                    })
                    return req
                  },
                  clear: (): MockRequest => {
                    const req = baseStore.clear()
                    Promise.resolve().then(() => {
                      if (!tx._isAborted && req.onsuccess) {
                        req.onsuccess({ target: req })
                      }
                      Promise.resolve().then(() => {
                        if (!tx._isAborted && tx.oncomplete) {
                          tx.oncomplete({ target: tx } as unknown as Event)
                        }
                      })
                    })
                    return req
                  }
                }
              }
            }
            return tx
          },
          close() {}
        }
        dbs.set(name, db)

        Promise.resolve().then(() => {
          if (request.onupgradeneeded) {
            request.onupgradeneeded({ target: { result: db! } })
          }
          request.result = db
          request.readyState = 'done'
          if (request.onsuccess) {
            request.onsuccess({ target: request })
          }
        })
      } else {
        Promise.resolve().then(() => {
          request.result = db
          request.readyState = 'done'
          if (request.onsuccess) {
            request.onsuccess({ target: request })
          }
        })
      }

      return request
    },
    deleteDatabase: (name: string) => {
      const request: MockRequest = { readyState: 'pending' }
      Promise.resolve().then(() => {
        dbs.delete(name)
        request.readyState = 'done'
        if (request.onsuccess) {
          request.onsuccess({ target: request })
        }
      })
      return request
    }
  }

  try {
    if (globalThis.indexedDB !== mockIndexedDB as unknown) {
      Object.defineProperty(globalThis, 'indexedDB', {
        value: mockIndexedDB,
        writable: true,
        configurable: true
      })
    }
  } catch {
    (globalThis as Record<string, unknown>).indexedDB = mockIndexedDB
  }
}
