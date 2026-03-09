"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetDBInstance = exports.getDB = void 0;
var DB_NAME = 'word-drill';
var DB_VERSION = 1;
var dbPromise = null;
/**
 * IndexedDB 接続を取得する（シングルトン）
 */
var getDB = function () {
    if (dbPromise) {
        return dbPromise;
    }
    if (typeof indexedDB === 'undefined') {
        return Promise.reject(new Error('IndexedDB is not supported in this environment.'));
    }
    dbPromise = new Promise(function (resolve, reject) {
        var request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = function () {
            console.error('Failed to open IndexedDB:', request.error);
            dbPromise = null;
            reject(request.error);
        };
        request.onsuccess = function () {
            resolve(request.result);
        };
        request.onupgradeneeded = function (event) {
            var db = event.target.result;
            if (!db.objectStoreNames.contains('history')) {
                var historyStore = db.createObjectStore('history', {
                    keyPath: 'id',
                    autoIncrement: true,
                });
                historyStore.createIndex('questionId', 'questionId');
                historyStore.createIndex('category', 'category');
                historyStore.createIndex('timestamp', 'timestamp');
            }
            if (!db.objectStoreNames.contains('stats')) {
                db.createObjectStore('stats', { keyPath: 'questionId' });
            }
        };
    });
    return dbPromise;
};
exports.getDB = getDB;
// テスト用ユーティリティ: シングルトンの状態をリセットする
var resetDBInstance = function () {
    dbPromise = null;
};
exports.resetDBInstance = resetDBInstance;
